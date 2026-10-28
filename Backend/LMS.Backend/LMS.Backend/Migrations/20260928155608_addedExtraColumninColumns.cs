using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class addedExtraColumninColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Credits",
                table: "courses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EnrollmentLimit",
                table: "courses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LearningObjectives",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prerequisites",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetAudience",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "courses",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Visibility",
                table: "courses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "Credits",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "EnrollmentLimit",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "LearningObjectives",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "Prerequisites",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "TargetAudience",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "Visibility",
                table: "courses");
        }
    }
}
