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
        var method = Request.Method;
        var queryString = Request.QueryString.Value ?? string.Empty;
        var fullPath = $"/proxy/{serviceName}/{path}";

        _logger.LogInformation("METHOD: {Method}, FULL PATH: {Path}, QUERY: {Query}", method, fullPath, queryString);
        _logger.LogInformation("ProxyRequest initiated for service: {ServiceName}, path: {Path}", serviceName, path);

        var requestMessage = new HttpRequestMessage(new HttpMethod(method), Request.Path);
        
        foreach (var header in Request.Headers)
        {
            requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
        }
        
        if (Request.ContentLength > 0 &&
            (method == HttpMethod.Post.Method || method == HttpMethod.Put.Method || method == HttpMethod.Patch.Method))
        {
            Request.EnableBuffering();
            using var reader = new StreamReader(Request.Body, Encoding.UTF8, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            Request.Body.Position = 0;

            requestMessage.Content = new StringContent(body, Encoding.UTF8, "application/json");
        }

        _logger.LogInformation("Request headers: {Headers}", requestMessage.Headers);
        if (requestMessage.Content != null)
            _logger.LogInformation("Request content: {Content}", await requestMessage.Content.ReadAsStringAsync());
        
        var response = await _requestRouter.RedirectRequestAsync(serviceName, path, requestMessage, queryString);

        var responseContent = await response.Content.ReadAsStringAsync();
        _logger.LogInformation("Response status code: {StatusCode}", response.StatusCode);
        _logger.LogInformation("Response content: {ResponseContent}", responseContent);

        return StatusCode((int)response.StatusCode, responseContent);
    }

}