using Microsoft.EntityFrameworkCore;
using TodoApi.Application.Contracts;
using TodoApi.Application.Interfaces;
using TodoApi.Domain.Entities;

namespace TodoApi.Infrastructure.Persistence;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _dbContext;

    public TaskRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetTasksAsync(TaskQueryParameters query, CancellationToken cancellationToken)
    {
        IQueryable<TaskItem> taskQuery = _dbContext.Tasks.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            string pattern = $"%{query.Search.Trim()}%";
            taskQuery = taskQuery.Where(task =>
                EF.Functions.Like(task.Title, pattern) ||
                (task.Description != null && EF.Functions.Like(task.Description, pattern)));
        }

        if (query.Status.HasValue)
        {
            taskQuery = taskQuery.Where(task => task.Status == query.Status.Value);
        }

        if (query.Priority.HasValue)
        {
            taskQuery = taskQuery.Where(task => task.Priority == query.Priority.Value);
        }

        taskQuery = ApplySorting(taskQuery, query.SortBy, query.SortDirection);
        int totalCount = await taskQuery.CountAsync(cancellationToken);

        List<TaskItem> items = await taskQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return _dbContext.Tasks.AsNoTracking().FirstOrDefaultAsync(task => task.Id == id, cancellationToken);
    }

    public Task<TaskItem?> GetTrackedByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return _dbContext.Tasks.FirstOrDefaultAsync(task => task.Id == id, cancellationToken);
    }

    public Task AddAsync(TaskItem task, CancellationToken cancellationToken)
    {
        return _dbContext.Tasks.AddAsync(task, cancellationToken).AsTask();
    }

    public void Remove(TaskItem task)
    {
        _dbContext.Tasks.Remove(task);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static IQueryable<TaskItem> ApplySorting(IQueryable<TaskItem> query, string sortBy, string sortDirection)
    {
        bool ascending = string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase);
        string normalizedSortBy = sortBy.ToLowerInvariant();

        return normalizedSortBy switch
        {
            "title" => ascending ? query.OrderBy(task => task.Title) : query.OrderByDescending(task => task.Title),
            "priority" => ascending ? query.OrderBy(task => task.Priority) : query.OrderByDescending(task => task.Priority),
            "status" => ascending ? query.OrderBy(task => task.Status) : query.OrderByDescending(task => task.Status),
            "duedate" => ascending ? query.OrderBy(task => task.DueDate) : query.OrderByDescending(task => task.DueDate),
            "createdat" => ascending ? query.OrderBy(task => task.CreatedAtUtc) : query.OrderByDescending(task => task.CreatedAtUtc),
            _ => ascending ? query.OrderBy(task => task.CreatedAtUtc) : query.OrderByDescending(task => task.CreatedAtUtc)
        };
    }
}
