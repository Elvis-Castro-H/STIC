namespace EventBus.Repositories;

using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISubscriptionRepository
{
    Task<List<Subscription>> GetAllSubscriptionsAsync();
    Task AddSubscriptionAsync(Subscription subscription);
    Task<bool> SubscriptionExistsAsync(string eventType, string callbackUrl);
}