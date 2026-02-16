using System.ComponentModel.DataAnnotations;
using TodoApi.Domain.Enums;
using DomainTaskStatus = TodoApi.Domain.Enums.TaskStatus;

namespace TodoApi.Application.Contracts;

/// <summary>
/// Represents a task item returned by the API.
/// </summary>
public class TaskItemDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DomainTaskStatus Status { get; init; }
    public TaskPriority Priority { get; init; }
    public DateTime? DueDate { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
    public DateTime? CompletedAtUtc { get; init; }
}

/// <summary>
/// Request payload for creating a task.
/// </summary>
public class CreateTaskRequest
{
    [Required]
    [MaxLength(120)]
    public string Title { get; init; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; init; }

    public TaskPriority Priority { get; init; } = TaskPriority.Medium;
    public DateTime? DueDate { get; init; }
}

/// <summary>
/// Request payload for replacing an existing task.
/// </summary>
public class UpdateTaskRequest
{
    [Required]
    [MaxLength(120)]
    public string Title { get; init; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; init; }

    public DomainTaskStatus Status { get; init; } = DomainTaskStatus.Todo;
    public TaskPriority Priority { get; init; } = TaskPriority.Medium;
    public DateTime? DueDate { get; init; }
}

/// <summary>
/// Request payload for updating only task status.
/// </summary>
public class UpdateTaskStatusRequest
{
    [Required]
    public DomainTaskStatus? Status { get; init; }
}
