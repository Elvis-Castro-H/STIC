namespace EventBus.Services;

using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISubscriptionService
{
    Task<List<Subscription>> GetAllSubscriptionsAsync();
    Task AddSubscriptionAsync(string eventType, string callbackUrl);
    Task<ICollection<string>> ForwardEventAsync(EventWrapper eventWrapper);
}
