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

    [HttpGet]
    public Task<PagedResponse<TaskItemDto>> GetTasks([FromQuery] TaskQueryParameters query, CancellationToken cancellationToken)
    {
        return _taskService.GetTasksAsync(query, cancellationToken);
    }

    [HttpGet("{id:guid}")]
    public Task<TaskItemDto> GetTaskById(Guid id, CancellationToken cancellationToken)
    {
        return _taskService.GetTaskByIdAsync(id, cancellationToken);
    }

    [HttpPost]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request, CancellationToken cancellationToken)
    {
        TaskItemDto created = await _taskService.CreateTaskAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetTaskById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public Task<TaskItemDto> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        return _taskService.UpdateTaskAsync(id, request, cancellationToken);
    }

    [HttpPatch("{id:guid}/status")]
    public Task<TaskItemDto> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusRequest request, CancellationToken cancellationToken)
    {
        return _taskService.UpdateTaskStatusAsync(id, request.Status, cancellationToken);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteTask(Guid id, CancellationToken cancellationToken)
    {
        await _taskService.DeleteTaskAsync(id, cancellationToken);
        return NoContent();
    }
}
