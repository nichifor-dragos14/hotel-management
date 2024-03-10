using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class RoomEntityConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Number).IsRequired();
        builder.Property(q => q.Type).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();

        builder.Property(q => q.HasPrivateBathroom).IsRequired();
        builder.Property(q => q.HasTowels).IsRequired();
        builder.Property(q => q.HasRefrigerator).IsRequired();
        builder.Property(q => q.HasBalcony).IsRequired();
        builder.Property(q => q.HasHairdryer).IsRequired();
        builder.Property(q => q.HasSeaView).IsRequired();

        builder.HasOne(c => c.Property)
            .WithMany(c => c.Rooms);
    }
}