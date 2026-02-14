using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoApi.Domain.Entities;

namespace TodoApi.Infrastructure.Persistence.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("Tasks");

        builder.HasKey(task => task.Id);

        builder.Property(task => task.Title)
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(task => task.Description)
            .HasMaxLength(1000);

        builder.Property(task => task.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(task => task.Priority)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(task => task.CreatedAtUtc).IsRequired();
        builder.Property(task => task.UpdatedAtUtc).IsRequired();

        builder.HasIndex(task => task.Status);
        builder.HasIndex(task => task.Priority);
        builder.HasIndex(task => task.DueDate);
        builder.HasIndex(task => task.CreatedAtUtc);
    }
}
