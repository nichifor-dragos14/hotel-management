using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class PropertyEntityConfiguration : IEntityTypeConfiguration<Property>
{
    public void Configure(EntityTypeBuilder<Property> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Name).IsRequired();
        builder.Property(q => q.Type).IsRequired();
        builder.Property(q => q.Description).IsRequired();
        builder.Property(q => q.Location).IsRequired();
        builder.Property(q => q.Email).IsRequired();
        builder.Property(q => q.PhoneNumber).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();
        builder.Property(q => q.IsDeleted).IsRequired();

        builder.Property(q => q.HasFreeWiFi).IsRequired();
        builder.Property(q => q.HasParking).IsRequired();
        builder.Property(q => q.HasPool).IsRequired();
        builder.Property(q => q.HasRestaurant).IsRequired();
        builder.Property(q => q.HasFitnessCentre).IsRequired();
        builder.Property(q => q.HasRoomService).IsRequired();
        builder.Property(q => q.HasBreakfast).IsRequired();
        builder.Property(q => q.HasPetFriendlyPolicy).IsRequired();
        builder.Property(q => q.HasFreeCancellation).IsRequired();

        //builder.HasMany(c => c.Questions)
        //    .WithOne(q => q.Category)
        //    .IsRequired()
        //    .OnDelete(DeleteBehavior.Cascade);
    }
}