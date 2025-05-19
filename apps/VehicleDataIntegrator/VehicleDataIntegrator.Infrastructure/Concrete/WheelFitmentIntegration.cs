using System.Text.Json;
using Microsoft.Extensions.Options;
using VehicleDataIntegrator.Domain.Models;
using VehicleDataIntegrator.Infrastructure.Abstract;

namespace VehicleDataIntegrator.Infrastructure.Concrete;

public class WheelFitmentIntegration : IWheelDetailsIntegration
{
    private readonly HttpClient _httpClient;
    private readonly WheelFitmentSettings _settings;

    public WheelFitmentIntegration(HttpClient httpClient, IOptions<WheelFitmentSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }

    public async Task<IEnumerable<WheelDetails>> GetWheelFitmentAsync(string make, string model, int year)
    {
        var url = BuildRequestUrl(make, model, year);
        var json = await GetJsonResponseAsync(url);
        return ParseWheelFitments(json);
    }

    private string BuildRequestUrl(string make, string model, int year)
    {
        return $"{_settings.BaseUrl}/search/by_model/?user_key={_settings.ApiKey}&region=usdm&make={make}&model={model}&year={year}";
    }

    private async Task<string> GetJsonResponseAsync(string url)
    {
        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    private IEnumerable<WheelDetails> ParseWheelFitments(string json)
    {
        using var doc = JsonDocument.Parse(json);
        var data = doc.RootElement.GetProperty("data");

        var results = new List<WheelDetails>();

        foreach (var item in data.EnumerateArray())
        {
            var make = item.GetProperty("make").GetProperty("name").GetString();
            var model = item.GetProperty("model").GetProperty("name").GetString();
            var year = item.GetProperty("start_year").GetInt32();

            var tech = item.GetProperty("technical");

            var boltCount = tech.TryGetProperty("stud_holes", out var studVal) && studVal.ValueKind != JsonValueKind.Null
                ? studVal.GetInt32()
                : 0;

            var boltPattern = tech.TryGetProperty("pcd", out var pcdVal) && pcdVal.ValueKind != JsonValueKind.Null
                ? pcdVal.GetDouble()
                : 0;

            var centerBore = tech.TryGetProperty("centre_bore", out var boreVal) && boreVal.ValueKind != JsonValueKind.Null
                ? double.Parse(boreVal.GetString())
                : 0;

            var fasteners = tech.GetProperty("wheel_fasteners");

            var lugType = fasteners.TryGetProperty("type", out var lugVal) && lugVal.ValueKind != JsonValueKind.Null
                ? lugVal.GetString()
                : null;

            var threadSize = fasteners.TryGetProperty("thread_size", out var threadVal) && threadVal.ValueKind != JsonValueKind.Null
                ? threadVal.GetString()
                : null;

            var region = item.TryGetProperty("regions", out var regions) && regions.GetArrayLength() > 0
                ? regions[0].GetString()
                : "Global";

            results.Add(new WheelDetails
            {
                Make = make,
                Model = model,
                Year = year,
                Region = region,
                BoltCount = boltCount,
                BoltPattern = boltPattern,
                CenterBore = centerBore,
                LugType = lugType,
                ThreadSize = threadSize
            });
        }

        return results;
    }
}