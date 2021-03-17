using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace react_background_service
{
    class LoginAttempt
    {
        private readonly Uri _uri;
        private readonly HttpClient _client;

        public LoginAttempt(Uri uri)
        {
            _client = new HttpClient();
            _uri = uri;
        }

        public async Task<bool> LoginAttemptAsync(string user, string password)
        {
            // ToDo: [LoginAttemptAsync Task Cancellation]
            var dic = new Dictionary<string, string>
            {
                ["log"] = user,
                ["pwd"] = password
            };

            var request = new HttpRequestMessage(HttpMethod.Post, _uri) {Content = new FormUrlEncodedContent(dic)};

            var result = await _client.SendAsync(request);

            result.EnsureSuccessStatusCode();

            return result.Headers.First(x => x.Key.Equals("Set-Cookie", StringComparison.Ordinal)).Value
                .Any(x => x.StartsWith("wordpress_logged_in_", StringComparison.Ordinal));
        }
    }
}
