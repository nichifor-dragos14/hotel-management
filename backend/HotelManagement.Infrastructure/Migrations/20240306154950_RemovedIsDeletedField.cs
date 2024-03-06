using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedIsDeletedField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "User");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Property");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Booking");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "User",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Room",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Property",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Booking",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
