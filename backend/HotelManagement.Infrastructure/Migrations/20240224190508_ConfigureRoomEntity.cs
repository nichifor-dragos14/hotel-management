using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureRoomEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Room",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Number = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    HasPrivateBathroom = table.Column<bool>(type: "boolean", nullable: false),
                    HasTowels = table.Column<bool>(type: "boolean", nullable: false),
                    HasHairdryer = table.Column<bool>(type: "boolean", nullable: false),
                    HasAirConditioning = table.Column<bool>(type: "boolean", nullable: false),
                    HasBalcony = table.Column<bool>(type: "boolean", nullable: false),
                    HasKitchen = table.Column<bool>(type: "boolean", nullable: false),
                    HasRefrigerator = table.Column<bool>(type: "boolean", nullable: false),
                    HasSeaView = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_Room", x => x.Id); });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Room");
        }
    }
}