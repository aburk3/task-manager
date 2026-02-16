using Microsoft.EntityFrameworkCore;
using TodoApi.Application.Contracts;
using TodoApi.Application.Exceptions;
using TodoApi.Application.Interfaces;
using TodoApi.Application.Services;
using TodoApi.Domain.Entities;
using TodoApi.Domain.Enums;
using TodoApi.Infrastructure.Persistence;
using Xunit;
using DomainTaskStatus = TodoApi.Domain.Enums.TaskStatus;

namespace tests.Application;

public class TaskServiceTests
{
    [Fact]
    public async Task UpdateTaskStatusAsync_WhenStatusCompleted_SetsCompletionTimestamp()
    {
        AppDbContext dbContext = BuildDbContext();
        ITaskRepository taskRepository = new TaskRepository(dbContext);
        TaskItem task = new()
        {
            Id = Guid.NewGuid(),
            Title = "Write tests",
            Status = DomainTaskStatus.Todo,
            Priority = TaskPriority.Medium,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.Tasks.Add(task);
        await dbContext.SaveChangesAsync();

        TaskService service = new(taskRepository);
        TaskItemDto result = await service.UpdateTaskStatusAsync(task.Id, DomainTaskStatus.Completed, CancellationToken.None);

        Assert.Equal(DomainTaskStatus.Completed, result.Status);
        Assert.NotNull(result.CompletedAtUtc);
    }

    [Fact]
    public async Task GetTaskByIdAsync_WhenTaskMissing_ThrowsNotFoundException()
    {
        AppDbContext dbContext = BuildDbContext();
        ITaskRepository taskRepository = new TaskRepository(dbContext);
        TaskService service = new(taskRepository);

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            service.GetTaskByIdAsync(Guid.NewGuid(), CancellationToken.None));

        Assert.Equal("Task not found.", exception.Message);
    }

    [Fact]
    public async Task GetTasksAsync_AppliesStatusFilter()
    {
        AppDbContext dbContext = BuildDbContext();
        ITaskRepository taskRepository = new TaskRepository(dbContext);
        DateTime utcNow = DateTime.UtcNow;

        dbContext.Tasks.AddRange(
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "todo",
                Status = DomainTaskStatus.Todo,
                Priority = TaskPriority.Low,
                CreatedAtUtc = utcNow,
                UpdatedAtUtc = utcNow
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "done",
                Status = DomainTaskStatus.Completed,
                Priority = TaskPriority.High,
                CreatedAtUtc = utcNow,
                UpdatedAtUtc = utcNow,
                CompletedAtUtc = utcNow
            });

        await dbContext.SaveChangesAsync();

        TaskService service = new(taskRepository);
        PagedResponse<TaskItemDto> response = await service.GetTasksAsync(
            new TaskQueryParameters { Status = DomainTaskStatus.Completed },
            CancellationToken.None);

        Assert.Single(response.Items);
        Assert.Equal("done", response.Items[0].Title);
    }

    private static AppDbContext BuildDbContext()
    {
        DbContextOptions<AppDbContext> options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new AppDbContext(options);
    }
}
