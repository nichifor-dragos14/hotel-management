using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameFitnessCenterOnPropertyAndRedesignPropertyTypeEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HasFitnessCentre",
                table: "Property",
                newName: "HasFitnessCenter");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HasFitnessCenter",
                table: "Property",
                newName: "HasFitnessCentre");
        }
    }
}
