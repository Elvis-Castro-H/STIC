using EventBus.Config;

namespace EventBus.Repositories;

using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

public class MongoSubscriptionRepository : ISubscriptionRepository
{
    private readonly IMongoCollection<Subscription> _subscriptions;

    public MongoSubscriptionRepository(IOptions<MongoDBSettings> settings, IMongoClient client)
    {
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _subscriptions = database.GetCollection<Subscription>(settings.Value.SubscriptionsCollectionName);
    }

    public async Task<List<Subscription>> GetAllSubscriptionsAsync() =>
        await _subscriptions.Find(sub => true).ToListAsync();

    public async Task AddSubscriptionAsync(Subscription subscription) =>
        await _subscriptions.InsertOneAsync(subscription);

    public async Task<bool> SubscriptionExistsAsync(string eventType, string callbackUrl)
    {
        var filter = Builders<Subscription>.Filter.Eq(s => s.EventType, eventType) &
                     Builders<Subscription>.Filter.Eq(s => s.CallbackUrl, callbackUrl);
        var count = await _subscriptions.CountDocumentsAsync(filter);
        return count > 0;
    }
}
