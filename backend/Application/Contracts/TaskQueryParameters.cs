using TodoApi.Domain.Enums;
using DomainTaskStatus = TodoApi.Domain.Enums.TaskStatus;

namespace TodoApi.Application.Contracts;

public class TaskQueryParameters
{
    private const int MaxPageSize = 100;
    private int _page = 1;
    private int _pageSize = 20;

    public string? Search { get; init; }
    public DomainTaskStatus? Status { get; init; }
    public TaskPriority? Priority { get; init; }
    public string SortBy { get; init; } = "createdAt";
    public string SortDirection { get; init; } = "desc";

    public int Page
    {
        get => _page;
        init => _page = value < 1 ? 1 : value;
    }

    public int PageSize
    {
        get => _pageSize;
        init => _pageSize = value switch
        {
            < 1 => 20,
            > MaxPageSize => MaxPageSize,
            _ => value
        };
    }
}
