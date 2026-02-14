namespace TodoApi.Application.Contracts;

public class PagedResponse<TItem>
{
    public IReadOnlyList<TItem> Items { get; init; } = Array.Empty<TItem>();
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
}
