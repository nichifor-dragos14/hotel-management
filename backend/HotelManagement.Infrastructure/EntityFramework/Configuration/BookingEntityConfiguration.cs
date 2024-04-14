using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Core.Bookings;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class BookingEntityConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.StartDate).IsRequired();
        builder.Property(q => q.EndDate).IsRequired();

        builder.Property(q => q.TotalPrice).IsRequired();
        builder.Property(q => q.FirstNameOnBooking).IsRequired();
        builder.Property(q => q.LastNameOnBooking).IsRequired();
        builder.Property(q => q.EmailOnBooking).IsRequired();
        builder.Property(q => q.PhoneNumberOnBooking).IsRequired();
        builder.Property(q => q.CountryOnBooking).IsRequired();
        builder.Property(q => q.SpecialMentions).IsRequired();
        builder.Property(q => q.ExpectedArrival).IsRequired();
     
        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();

        builder.HasOne(q => q.Room)
            .WithMany(q => q.Bookings);

        builder.HasOne(q => q.User)
            .WithMany(q => q.Bookings);
    }
}