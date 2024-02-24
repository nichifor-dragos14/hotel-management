using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOneToManyBetweenPropertyAndRooms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PropertyId",
                table: "Room",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Room_PropertyId",
                table: "Room",
                column: "PropertyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Property_PropertyId",
                table: "Room",
                column: "PropertyId",
                principalTable: "Property",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Room_Property_PropertyId",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Room_PropertyId",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "PropertyId",
                table: "Room");
        }
    }
}