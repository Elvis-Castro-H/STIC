namespace ApiGateway;

public class RequestRouter(CustomServiceDiscovery serviceDiscovery, IHttpClientFactory httpClientFactory)
{
    private readonly HttpClient _httpClient = httpClientFactory.CreateClient();

    public async Task<HttpResponseMessage> RedirectRequestAsync(string serviceName, string downstreamPath, HttpRequestMessage request, string queryString)
    {
        var serviceUri = await GetServiceUriAsync(serviceName);
        var downstreamUrl = BuildDownstreamUrl(serviceUri, downstreamPath, queryString);
        var downstreamRequest = CreateDownstreamRequest(request, downstreamUrl);

        return await SendDownstreamRequestAsync(downstreamRequest);
    }

    private async Task<string> GetServiceUriAsync(string serviceName)
    {
        var serviceUri = await serviceDiscovery.GetServiceUriAsync(serviceName);
        if (serviceUri == null)
        {
            throw new Exception($"Service {serviceName} not found in the service registry.");
        }
        return serviceUri;
    }

    private string BuildDownstreamUrl(string serviceUri, string downstreamPath, string queryString)
    {
        return $"{serviceUri}/{downstreamPath}{queryString}";
    }

    private HttpRequestMessage CreateDownstreamRequest(HttpRequestMessage originalRequest, string downstreamUrl)
    {
        var downstreamRequest = new HttpRequestMessage(originalRequest.Method, downstreamUrl)
        {
            Content = originalRequest.Content
        };

        foreach (var header in originalRequest.Headers)
        {
            downstreamRequest.Headers.TryAddWithoutValidation(header.Key, header.Value);
        }

        return downstreamRequest;
    }

    private async Task<HttpResponseMessage> SendDownstreamRequestAsync(HttpRequestMessage downstreamRequest)
    {
        return await _httpClient.SendAsync(downstreamRequest);
    }
}