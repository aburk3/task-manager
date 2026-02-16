using Microsoft.AspNetCore.Mvc;

namespace TodoApi.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Get()
    {
        return Ok(new { status = "ok", timestampUtc = DateTime.UtcNow });
    }
}
