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
        public string Username { get; set; }
        public string Wordlist { get; set; }
        public double Percentage { get; set; }
        public Result TaskResult { get; set; }
        public Status TaskStatus { get; set; }
        public Options Options { get; set; }
        public string Exception { get; set; }
    }

    public enum Action
    {
        Add = 0,
        Remove = 1,
        Stop = 2,
        Ping = 3,
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

    public class Options
    {
        public BruteForceOptions BruteForceOptions { get; set; }
    }

    public class BruteForceOptions
    {
        public int MaxThreads { get; set; }
        public int BatchCount { get; set; }
        public int RetryCount { get; set; }
        
    }
}
