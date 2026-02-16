using TodoApi.Application.Contracts;
using TodoApi.Application.Exceptions;
using TodoApi.Application.Interfaces;
using TodoApi.Domain.Entities;
using TodoApi.Domain.Enums;
using DomainTaskStatus = TodoApi.Domain.Enums.TaskStatus;

namespace TodoApi.Application.Services;

public class TaskService : ITaskService
{
    private static readonly HashSet<string> AllowedSortBy = new(StringComparer.OrdinalIgnoreCase)
    {
        "createdAt",
        "dueDate",
        "priority",
        "status",
        "title"
    };

    private static readonly HashSet<string> AllowedSortDirection = new(StringComparer.OrdinalIgnoreCase)
    {
        "asc",
        "desc"
    };

    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<PagedResponse<TaskItemDto>> GetTasksAsync(TaskQueryParameters query, CancellationToken cancellationToken)
    {
        ValidateSorting(query);
        (IReadOnlyList<TaskItem> tasks, int totalCount) = await _taskRepository.GetTasksAsync(query, cancellationToken);
        List<TaskItemDto> items = tasks.Select(MapToDto).ToList();

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
        TaskItem? task = await _taskRepository.GetByIdAsync(id, cancellationToken);
        return task is null
            ? throw new NotFoundException("Task not found.")
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

        await _taskRepository.AddAsync(task, cancellationToken);
        await _taskRepository.SaveChangesAsync(cancellationToken);
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

        await _taskRepository.SaveChangesAsync(cancellationToken);
        return MapToDto(task);
    }

    public async Task<TaskItemDto> UpdateTaskStatusAsync(Guid id, DomainTaskStatus status, CancellationToken cancellationToken)
    {
        TaskItem task = await GetTrackedTaskByIdAsync(id, cancellationToken);

        task.Status = status;
        task.UpdatedAtUtc = DateTime.UtcNow;
        task.CompletedAtUtc = status == DomainTaskStatus.Completed ? DateTime.UtcNow : null;

        await _taskRepository.SaveChangesAsync(cancellationToken);
        return MapToDto(task);
    }

    public async Task DeleteTaskAsync(Guid id, CancellationToken cancellationToken)
    {
        TaskItem task = await GetTrackedTaskByIdAsync(id, cancellationToken);
        _taskRepository.Remove(task);
        await _taskRepository.SaveChangesAsync(cancellationToken);
    }

    private async Task<TaskItem> GetTrackedTaskByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        TaskItem? task = await _taskRepository.GetTrackedByIdAsync(id, cancellationToken);
        if (task is null)
        {
            throw new NotFoundException("Task not found.");
        }

        return task;
    }

    private static void ValidateSorting(TaskQueryParameters query)
    {
        if (!AllowedSortBy.Contains(query.SortBy))
        {
            throw new AppValidationException($"SortBy must be one of: {string.Join(", ", AllowedSortBy)}.");
        }

        if (!AllowedSortDirection.Contains(query.SortDirection))
        {
            throw new AppValidationException("SortDirection must be one of: asc, desc.");
        }
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
