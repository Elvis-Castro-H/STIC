using Newtonsoft.Json.Linq;

namespace EventBus;

public class EventWrapper
{
    public string EventType { get; set; } 
    public JToken Data { get; set; }      

    public EventWrapper(string eventType, JToken data)
    {
        EventType = eventType;
        Data = data;
    }
}