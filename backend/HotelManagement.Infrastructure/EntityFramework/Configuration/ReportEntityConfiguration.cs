using HotelManagement.Core.Reports;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class ReportEntityConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Title).IsRequired();
        builder.Property(q => q.Description).IsRequired();
        builder.Property(q => q.IsRead).IsRequired();
        builder.Property(q => q.IsClosed).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();

        builder.HasOne(q => q.Property)
           .WithMany(q => q.Reports);
    }
}