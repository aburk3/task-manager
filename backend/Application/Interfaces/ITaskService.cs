using TodoApi.Application.Contracts;
using TodoApi.Domain.Enums;
using DomainTaskStatus = TodoApi.Domain.Enums.TaskStatus;

namespace TodoApi.Application.Interfaces;

public interface ITaskService
{
    Task<PagedResponse<TaskItemDto>> GetTasksAsync(TaskQueryParameters query, CancellationToken cancellationToken);
    Task<TaskItemDto> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<TaskItemDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken);
    Task<TaskItemDto> UpdateTaskAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken);
    Task<TaskItemDto> UpdateTaskStatusAsync(Guid id, DomainTaskStatus status, CancellationToken cancellationToken);
    Task DeleteTaskAsync(Guid id, CancellationToken cancellationToken);
}
