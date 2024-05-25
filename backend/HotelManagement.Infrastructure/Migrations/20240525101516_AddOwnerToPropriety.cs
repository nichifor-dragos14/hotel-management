using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerToPropriety : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Property",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Property_UserId",
                table: "Property",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Property_User_UserId",
                table: "Property",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Property_User_UserId",
                table: "Property");

            migrationBuilder.DropIndex(
                name: "IX_Property_UserId",
                table: "Property");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Property");
        }
    }
}
