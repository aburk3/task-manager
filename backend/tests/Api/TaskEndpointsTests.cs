using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using tests.Infrastructure;
using TodoApi.Application.Contracts;
using TodoApi.Domain.Entities;
using TodoApi.Domain.Enums;
using TodoApi.Infrastructure.Persistence;
using Xunit;
using DomainTaskStatus = TodoApi.Domain.Enums.TaskStatus;

namespace tests.Api;

public class TaskEndpointsTests : IClassFixture<CustomWebApplicationFactory>
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public TaskEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task CreateTask_ThenFetchById_ReturnsCreatedTask()
    {
        CreateTaskRequest request = new()
        {
            Title = "Integration test task",
            Description = "Created via API test",
            Priority = TaskPriority.High
        };

        HttpResponseMessage createResponse = await _client.PostAsJsonAsync("/api/tasks", request);
        createResponse.EnsureSuccessStatusCode();

        TaskItemDto? created = await ReadJsonAsync<TaskItemDto>(createResponse);
        Assert.NotNull(created);

        HttpResponseMessage getResponse = await _client.GetAsync($"/api/tasks/{created!.Id}");
        getResponse.EnsureSuccessStatusCode();
        TaskItemDto? fetched = await ReadJsonAsync<TaskItemDto>(getResponse);
        Assert.NotNull(fetched);
        Assert.Equal(request.Title, fetched!.Title);
    }

    [Fact]
    public async Task GetTasks_WithStatusFilter_ReturnsFilteredItems()
    {
        using IServiceScope scope = _factory.Services.CreateScope();
        AppDbContext dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        dbContext.Tasks.AddRange(
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "todo item",
                Status = DomainTaskStatus.Todo,
                Priority = TaskPriority.Medium,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "completed item",
                Status = DomainTaskStatus.Completed,
                Priority = TaskPriority.Medium,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow,
                CompletedAtUtc = DateTime.UtcNow
            });

        await dbContext.SaveChangesAsync();

        HttpResponseMessage responseMessage = await _client.GetAsync("/api/tasks?status=Completed");
        responseMessage.EnsureSuccessStatusCode();
        PagedResponse<TaskItemDto>? response = await ReadJsonAsync<PagedResponse<TaskItemDto>>(responseMessage);

        Assert.NotNull(response);
        Assert.All(response!.Items, item => Assert.Equal(DomainTaskStatus.Completed, item.Status));
    }

    [Fact]
    public async Task DeleteTask_RemovesTask()
    {
        CreateTaskRequest request = new()
        {
            Title = "Delete me",
            Priority = TaskPriority.Low
        };

        HttpResponseMessage createResponse = await _client.PostAsJsonAsync("/api/tasks", request);
        TaskItemDto? created = await ReadJsonAsync<TaskItemDto>(createResponse);
        Assert.NotNull(created);

        HttpResponseMessage deleteResponse = await _client.DeleteAsync($"/api/tasks/{created!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        HttpResponseMessage getResponse = await _client.GetAsync($"/api/tasks/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    private static async Task<T?> ReadJsonAsync<T>(HttpResponseMessage response)
    {
        string content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(content, SerializerOptions);
    }
}
