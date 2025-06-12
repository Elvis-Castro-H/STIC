namespace ApiGateway.Controllers;

using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
[ApiController]
[Route("proxy/{serviceName}/{*path}")]
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
    _logger.LogInformation("METHOD: {Method}, FULL PATH: {FullPath}, QUERY: {Query}", Request.Method, Request.Path, Request.QueryString);
    _logger.LogInformation("ProxyRequest initiated for service: {ServiceName}, path: {Path}", serviceName, path);
    _logger.LogInformation("Full URL: {Url}", $"{Request.Scheme}://{Request.Host}{Request.Path}{Request.QueryString}");

    var queryString = Request.QueryString.Value;
    var method = new HttpMethod(Request.Method);

    string bodyContent = null;

    if (Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase) ||
        Request.Method.Equals("PUT", StringComparison.OrdinalIgnoreCase) ||
        Request.Method.Equals("PATCH", StringComparison.OrdinalIgnoreCase))
    {
        using var reader = new StreamReader(Request.Body);
        bodyContent = await reader.ReadToEndAsync();
    }

    var downstreamUrl = $"{Request.Path}{queryString}";
    var requestMessage = new HttpRequestMessage(method, downstreamUrl);

    if (bodyContent != null)
    {
        requestMessage.Content = new StringContent(bodyContent, Encoding.UTF8, "application/json");
    }

    foreach (var header in Request.Headers)
    {
        requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
    }

    _logger.LogInformation("Request headers: {Headers}", requestMessage.Headers);
    _logger.LogInformation("Request content: {Content}", bodyContent ?? "(empty)");

    var response = await _requestRouter.RedirectRequestAsync(serviceName, path, requestMessage, queryString);

    var responseContent = await response.Content.ReadAsStringAsync();
    _logger.LogInformation("Response status code: {StatusCode}", response.StatusCode);
    _logger.LogInformation("Response content: {ResponseContent}", responseContent);

    return StatusCode((int)response.StatusCode, responseContent);
}

}