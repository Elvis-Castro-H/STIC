using System.Text;
using EventBus.Repositories;

namespace EventBus.Services;

using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _repository;
    private readonly ILogger<SubscriptionService> _logger;

    public SubscriptionService(ISubscriptionRepository repository, ILogger<SubscriptionService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<List<Subscription>> GetAllSubscriptionsAsync()
    {
        return await _repository.GetAllSubscriptionsAsync();
    }

    public async Task AddSubscriptionAsync(string eventType, string callbackUrl)
    {
        var exists = await _repository.SubscriptionExistsAsync(eventType, callbackUrl);
        if (exists)
        {
            _logger.LogInformation($"Subscription for event '{eventType}' with callback URL '{callbackUrl}' already exists.");
            return;
        }

        var subscription = new Subscription
        {
            EventType = eventType,
            CallbackUrl = callbackUrl
        };

        await _repository.AddSubscriptionAsync(subscription);
    }

    public async Task<ICollection<string>> ForwardEventAsync(EventWrapper eventWrapper)
    {
        var subscriptions = await _repository.GetAllSubscriptionsAsync();
        var relevantSubscribers = subscriptions
            .Where(sub => sub.EventType == eventWrapper.EventType)
            .Select(sub => sub.CallbackUrl)
            .ToList();

        foreach (var url in relevantSubscribers)
        {
            using var client = new HttpClient();
            var jsonContent = new StringContent(JsonConvert.SerializeObject(eventWrapper), Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync(url, jsonContent);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Failed to send event to {url}. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception occurred while sending event to {url}: {ex.Message}");
            }
        }
        return relevantSubscribers;
    }
}
