using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Core.Users;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.FirstName).IsRequired();
        builder.Property(q => q.LastName).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();
    }
}