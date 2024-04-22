using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Core.Users;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Email).IsRequired();
        builder.Property(q => q.Password).IsRequired();

        builder.Property(q => q.FirstName).IsRequired();
        builder.Property(q => q.LastName).IsRequired();
        builder.Property(q => q.PhoneNumber).IsRequired();
        builder.Property(q => q.Nationality).IsRequired();
        builder.Property(q => q.Gender).IsRequired();
        builder.Property(q => q.Address).IsRequired();
        builder.Property(q => q.DateOfBirth).IsRequired();
        builder.Property(q => q.ProfilePicture);

        builder.Property(q => q.RetainSearchHistory).IsRequired();
        builder.Property(q => q.SendOffersOnEmail).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();

        builder.HasIndex(q => q.Email).IsUnique();
    }
}