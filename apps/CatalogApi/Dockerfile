FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY CatalogApi.sln ./
COPY CatalogApi.API/CatalogApi.API.csproj CatalogApi.API/
COPY CatalogApi.Application/CatalogApi.Application.csproj CatalogApi.Application/
COPY CatalogApi.Data/CatalogApi.Data.csproj CatalogApi.Data/
COPY CatalogApi.Domain/CatalogApi.Domain.csproj CatalogApi.Domain/

RUN dotnet restore

COPY . .

RUN dotnet publish CatalogApi.API/CatalogApi.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CatalogApi.API.dll"]
