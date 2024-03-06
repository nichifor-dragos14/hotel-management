using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Core.Bookings;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class BookingEntityConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.StartOn).IsRequired();
        builder.Property(q => q.EndOn).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();

        builder.HasOne(q => q.Room)
            .WithMany(q => q.Bookings);

        builder.HasOne(q => q.User)
            .WithMany(q => q.Bookings);
    }
}