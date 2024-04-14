using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedBookingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartOn",
                table: "Booking",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "EndOn",
                table: "Booking",
                newName: "EndDate");

            migrationBuilder.AddColumn<string>(
                name: "CountryOnBooking",
                table: "Booking",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmailOnBooking",
                table: "Booking",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExpectedArrival",
                table: "Booking",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstNameOnBooking",
                table: "Booking",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastNameOnBooking",
                table: "Booking",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumberOnBooking",
                table: "Booking",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SpecialMentions",
                table: "Booking",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TotalPrice",
                table: "Booking",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountryOnBooking",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "EmailOnBooking",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "ExpectedArrival",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "FirstNameOnBooking",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "LastNameOnBooking",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "PhoneNumberOnBooking",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "SpecialMentions",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Booking");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Booking",
                newName: "StartOn");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "Booking",
                newName: "EndOn");
        }
    }
}
