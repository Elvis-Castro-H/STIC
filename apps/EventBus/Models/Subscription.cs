namespace EventBus;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Subscription
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("EventType")]
    public string EventType { get; set; }

    [BsonElement("CallbackUrl")]
    public string CallbackUrl { get; set; }
}
