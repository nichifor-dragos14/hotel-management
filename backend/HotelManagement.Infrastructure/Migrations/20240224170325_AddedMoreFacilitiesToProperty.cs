using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedMoreFacilitiesToProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasBreakfast",
                table: "Property",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasFitnessCentre",
                table: "Property",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasFreeCancellation",
                table: "Property",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasPetFriendlyPolicy",
                table: "Property",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasRoomService",
                table: "Property",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasBreakfast",
                table: "Property");

            migrationBuilder.DropColumn(
                name: "HasFitnessCentre",
                table: "Property");

            migrationBuilder.DropColumn(
                name: "HasFreeCancellation",
                table: "Property");

            migrationBuilder.DropColumn(
                name: "HasPetFriendlyPolicy",
                table: "Property");

            migrationBuilder.DropColumn(
                name: "HasRoomService",
                table: "Property");
        }
    }
}