using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Data.Contexts;

public class PostgreSqlContext : DbContext
{
    public PostgreSqlContext(DbContextOptions<PostgreSqlContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(PostgreSqlContext).Assembly);
        base.OnModelCreating(builder);
    }
}