using DotNetEnv;
using Microsoft.Extensions.DependencyInjection;
using EventBus.Extensions;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Services.ConfigureMongoDB(builder.Configuration);
builder.Services.ConfigureRepositories();
builder.Services.ConfigureServices();
builder.Services.ConfigureSwagger();

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "EventBus API v1");
        c.RoutePrefix = string.Empty; 
    });
}

app.MapControllers();
app.Run();