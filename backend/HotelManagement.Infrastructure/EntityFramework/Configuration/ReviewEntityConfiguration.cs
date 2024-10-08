﻿using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Core.Reviews;
using System.Reflection.Metadata;
using HotelManagement.Core.Bookings;

namespace HotelManagement.Infrastructure.EntityFramework.Configuration;

internal class ReviewEntityConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Title).IsRequired();
        builder.Property(q => q.Description).IsRequired();
        builder.Property(q => q.Rating).IsRequired();

        builder.Property(q => q.CreatedOn).IsRequired();
        builder.Property(q => q.UpdatedOn).IsRequired();

        builder.HasOne(q => q.Property)
           .WithMany(q => q.Reviews);

        builder.HasOne(q => q.User)
           .WithMany(q => q.Reviews);

        builder.HasOne(q => q.Booking)
            .WithOne(q => q.Review)
            .HasForeignKey<Review>(q => q.BookingId);
    }
}
