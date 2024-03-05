using HotelManagement.Core.Abstractions;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagement.Infrastructure.EntityFramework;

public record NpgsqlPaginatedResult<TResult>(
    [property: Column(TypeName = "jsonb")] IEnumerable<TResult> Results,
    int TotalCount
) : IPaginatedResult<TResult>;
