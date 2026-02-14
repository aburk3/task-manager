using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TodoApi.Application.Contracts;
using TodoApi.Application.Exceptions;
using TodoApi.Application.Interfaces;
using TodoApi.Domain.Entities;
using TodoApi.Domain.Enums;
using TodoApi.Infrastructure.Persistence;
using DomainTaskStatus = TodoApi.Domain.Enums.TaskStatus;

namespace TodoApi.Application.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _dbContext;

    public TaskService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResponse<TaskItemDto>> GetTasksAsync(TaskQueryParameters query, CancellationToken cancellationToken)
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

        List<TaskItemDto> items = await taskQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(task => MapToDto(task))
            .ToListAsync(cancellationToken);

        return new PagedResponse<TaskItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<TaskItemDto> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        TaskItem? task = await _dbContext.Tasks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        return task is null
            ? throw new ApiException("Task not found.", StatusCodes.Status404NotFound)
            : MapToDto(task);
    }

    public async Task<TaskItemDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        DateTime utcNow = DateTime.UtcNow;

        TaskItem task = new()
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            Priority = request.Priority,
            DueDate = request.DueDate,
            CreatedAtUtc = utcNow,
            UpdatedAtUtc = utcNow
        };

        _dbContext.Tasks.Add(task);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return MapToDto(task);
    }

    public async Task<TaskItemDto> UpdateTaskAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        TaskItem task = await GetTrackedTaskByIdAsync(id, cancellationToken);
        task.Title = request.Title.Trim();
        task.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        task.Priority = request.Priority;
        task.DueDate = request.DueDate;
        task.Status = request.Status;
        task.UpdatedAtUtc = DateTime.UtcNow;
        task.CompletedAtUtc = request.Status == DomainTaskStatus.Completed
            ? task.CompletedAtUtc ?? DateTime.UtcNow
            : null;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return MapToDto(task);
    }

    public async Task<TaskItemDto> UpdateTaskStatusAsync(Guid id, DomainTaskStatus status, CancellationToken cancellationToken)
    {
        TaskItem task = await GetTrackedTaskByIdAsync(id, cancellationToken);

        task.Status = status;
        task.UpdatedAtUtc = DateTime.UtcNow;
        task.CompletedAtUtc = status == DomainTaskStatus.Completed ? DateTime.UtcNow : null;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return MapToDto(task);
    }

    public async Task DeleteTaskAsync(Guid id, CancellationToken cancellationToken)
    {
        TaskItem task = await GetTrackedTaskByIdAsync(id, cancellationToken);
        _dbContext.Tasks.Remove(task);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<TaskItem> GetTrackedTaskByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        TaskItem? task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (task is null)
        {
            throw new ApiException("Task not found.", StatusCodes.Status404NotFound);
        }

        return task;
    }

    private static IQueryable<TaskItem> ApplySorting(IQueryable<TaskItem> query, string sortBy, string sortDirection)
    {
        bool ascending = string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLowerInvariant() switch
        {
            "title" => ascending ? query.OrderBy(task => task.Title) : query.OrderByDescending(task => task.Title),
            "priority" => ascending ? query.OrderBy(task => task.Priority) : query.OrderByDescending(task => task.Priority),
            "status" => ascending ? query.OrderBy(task => task.Status) : query.OrderByDescending(task => task.Status),
            "duedate" => ascending ? query.OrderBy(task => task.DueDate) : query.OrderByDescending(task => task.DueDate),
            _ => ascending ? query.OrderBy(task => task.CreatedAtUtc) : query.OrderByDescending(task => task.CreatedAtUtc)
        };
    }

    private static TaskItemDto MapToDto(TaskItem task)
    {
        return new TaskItemDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            DueDate = task.DueDate,
            CreatedAtUtc = task.CreatedAtUtc,
            UpdatedAtUtc = task.UpdatedAtUtc,
            CompletedAtUtc = task.CompletedAtUtc
        };
    }
}
