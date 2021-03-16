using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading;
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
                            Type = action.Type,
                            MessageAction = Task.Action.Ping,
                            TaskResult = new Result()
                            {
                                UserEnumeration = new List<UserObj>(), 
                                BruteForce = new LoginCredentials()
                            }
                        });

                        SendStatus();

                        if (action.Type == Task.TaskType.Enumeration)
                        {
                            var enumTask = new System.Threading.Tasks.Task(async () =>
                            {
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
