namespace EventBus.Extensions;

using Config;
using Repositories;
using Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.OpenApi.Models;

public static class ServiceExtensions
{
    public static void ConfigureMongoDB(this IServiceCollection services, IConfiguration configuration)
    {
        var mongoConnectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING");
        var mongoDatabaseName = Environment.GetEnvironmentVariable("MONGO_DATABASE_NAME");
        var mongoCollectionName = Environment.GetEnvironmentVariable("MONGO_COLLECTION_NAME");
        
        services.Configure<MongoDBSettings>(options =>
        {
            options.ConnectionString = mongoConnectionString;
            options.DatabaseName = mongoDatabaseName;
            options.SubscriptionsCollectionName = mongoCollectionName;
        });

        services.AddSingleton<IMongoClient, MongoClient>(sp =>
        {
            var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
            return new MongoClient(settings.ConnectionString);
        });
    }

    public static void ConfigureRepositories(this IServiceCollection services)
    {
        services.AddSingleton<ISubscriptionRepository, MongoSubscriptionRepository>();
    }

    public static void ConfigureServices(this IServiceCollection services)
    {
        services.AddSingleton<ISubscriptionService, SubscriptionService>();
    }

    public static void ConfigureSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "EventBus API",
                Description = "API for managing event subscriptions and publishing",
                Contact = new OpenApiContact
                {
                    Name = "EventBus Support",
                    Email = "support@eventbus.com",
                }
            });
        });
    }
}
