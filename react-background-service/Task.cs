using System;
using System.Collections.Generic;
using System.Text;

namespace react_background_service
{
    public class Task
    {
        public Action MessageAction { get; set; }
        public Type TaskType { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public double Percentage { get; set; }
        public Result TaskResult { get; set; }
        public Status TaskStatus { get; set; }

        public enum Action
        {
            Add = 0,
            Remove = 1,
            Ping = 2,
            Null = 3,
        }

        public enum Status
        {
            Stopped = 0,
            Starting = 1,
            Running = 2,
            Ready = 3,
        }

        public enum Type
        {
            Enumeration = 0,
            BruteForce = 1,
            Null = 2,
        }
    }

    public class Result
    {
        public LoginCredentials BruteForce { get; set; }
        public List<UserObj> UserEnumeration { get; set; }
    }

    public class LoginCredentials
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserObj
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public string Url { get; set; }
        public string Slug { get; set; }
    }

    public class ProcessList
    {
        public readonly List<Task> Tasks = new List<Task>();
    }
}
