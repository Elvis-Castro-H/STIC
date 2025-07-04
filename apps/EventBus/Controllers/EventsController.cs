using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using EventBus;
using EventBus.Services;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public EventsController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe(string eventType, [FromBody] string callbackUrl)
    {
        await _subscriptionService.AddSubscriptionAsync(eventType, callbackUrl);
        return Ok($"Subscribed to {eventType} at {callbackUrl}");
    }

    [HttpPost("publish")]
    public async Task<IActionResult> PublishEvent()
    {
        try
        {
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                var jsonString = await reader.ReadToEndAsync();
                var eventWrapper = JsonConvert.DeserializeObject<EventWrapper>(jsonString);

                if (eventWrapper == null)
                {
                    return BadRequest("Invalid event format.");
                }

                var subscribers = await _subscriptionService.ForwardEventAsync(eventWrapper);
                return Ok(subscribers);
            }
        }
        catch (JsonException ex)
        {
            return BadRequest(new { message = "Invalid JSON format", error = ex.Message });
        }
    }

    [HttpGet("subscriptions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSubscriptions()
    {
        var subs = await _subscriptionService.GetAllSubscriptionsAsync();

        var grouped = subs
            .GroupBy(s => s.EventType)
            .ToDictionary(
                g => g.Key,
                g => g.Select(s => s.CallbackUrl)
                    .Distinct()
                    .ToList());

        return Ok(grouped);
    }
}