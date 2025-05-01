namespace ApiGateway.Controllers;

using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
[ApiController]
[Route("{serviceName}/{*path}")]
public class GatewayController : ControllerBase
{
    private readonly RequestRouter _requestRouter;
    private readonly IHttpClientFactory _clientFactory;

    private readonly ILogger<GatewayController> _logger;

    public GatewayController(RequestRouter requestRouter, IHttpClientFactory clientFactory, ILogger<GatewayController> logger)
    {
        _requestRouter = requestRouter;
        _clientFactory = clientFactory;
        _logger = logger;
    }

    [HttpGet, HttpPost, HttpPut, HttpDelete, HttpPatch]
    public async Task<IActionResult> ProxyRequest(string serviceName, string path)
    {
        _logger.LogInformation("ProxyRequest initiated for service: {ServiceName}, path: {Path}", serviceName, path);

        var requestMessage = new HttpRequestMessage(new HttpMethod(Request.Method), Request.Path)
        {
            Content = new StreamContent(Request.Body)
        };

        foreach (var header in Request.Headers)
        {
            requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
        }

        if ((Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase) ||
             Request.Method.Equals("PUT", StringComparison.OrdinalIgnoreCase)) &&
            !requestMessage.Content.Headers.Contains("Content-Type"))
        {
            requestMessage.Content.Headers.Add("Content-Type", "application/json");
        }

        if ((Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase) ||
             Request.Method.Equals("PUT", StringComparison.OrdinalIgnoreCase)) &&
            requestMessage.Content != null)
        {
            var content = await new StreamReader(Request.Body).ReadToEndAsync();
            requestMessage.Content = new StringContent(content, Encoding.UTF8, "application/json");
        }

        _logger.LogInformation("Request headers: {Headers}", requestMessage.Headers);
        _logger.LogInformation("Request content: {Content}", await requestMessage.Content.ReadAsStringAsync());

        var queryString = Request.QueryString.Value;
        var response = await _requestRouter.RedirectRequestAsync(serviceName, path, requestMessage, queryString);

        var responseContent = await response.Content.ReadAsStringAsync();
        _logger.LogInformation("Response status code: {StatusCode}", response.StatusCode);
        _logger.LogInformation("Response content: {ResponseContent}", responseContent);

        return StatusCode((int)response.StatusCode, responseContent);
    }
}