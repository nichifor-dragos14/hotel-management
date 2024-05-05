using HotelManagement.Core.Discounts;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class DiscountEntityConfiguration : IEntityTypeConfiguration<Discount>
{
    public void Configure(EntityTypeBuilder<Discount> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.StartDate).IsRequired();
        builder.Property(q => q.EndDate).IsRequired();
        builder.Property(q => q.DiscountPercentage).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();

        builder.HasOne(q => q.Property)
            .WithMany(q => q.Discounts);

        builder.HasOne(q => q.User)
            .WithMany(q => q.Discounts);
    }
}