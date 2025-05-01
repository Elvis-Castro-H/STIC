namespace EventBus.Config;

public class MongoDBSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
    public string SubscriptionsCollectionName { get; set; }
}
