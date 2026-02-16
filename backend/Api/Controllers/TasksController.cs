using Microsoft.AspNetCore.Mvc;
using TodoApi.Application.Contracts;
using TodoApi.Application.Interfaces;

namespace TodoApi.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <summary>
    /// Returns a paged list of tasks using optional filters and sorting.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<TaskItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public Task<PagedResponse<TaskItemDto>> GetTasks([FromQuery] TaskQueryParameters query, CancellationToken cancellationToken)
    {
        return _taskService.GetTasksAsync(query, cancellationToken);
    }

    /// <summary>
    /// Returns a task by identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public Task<TaskItemDto> GetTaskById(Guid id, CancellationToken cancellationToken)
    {
        return _taskService.GetTaskByIdAsync(id, cancellationToken);
    }

    /// <summary>
    /// Creates a new task.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request, CancellationToken cancellationToken)
    {
        TaskItemDto created = await _taskService.CreateTaskAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetTaskById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Replaces an existing task.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public Task<TaskItemDto> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        return _taskService.UpdateTaskAsync(id, request, cancellationToken);
    }

    /// <summary>
    /// Updates only the status field for an existing task.
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public Task<TaskItemDto> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusRequest request, CancellationToken cancellationToken)
    {
        return _taskService.UpdateTaskStatusAsync(id, request.Status!.Value, cancellationToken);
    }

    /// <summary>
    /// Deletes a task by identifier.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTask(Guid id, CancellationToken cancellationToken)
    {
        await _taskService.DeleteTaskAsync(id, cancellationToken);
        return NoContent();
    }
}
