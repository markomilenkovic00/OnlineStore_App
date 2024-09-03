using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiGateway
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public LoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            Log.Information("Request received: {Method} {Path}", context.Request.Method, context.Request.Path);

            await _next(context);

            Log.Information("Response sent: {StatusCode}", context.Response.StatusCode);
        }
    }
}
