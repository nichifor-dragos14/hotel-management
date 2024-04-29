using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reports;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class OneReportQueryHandler(
IQueryFacade facade
) : IQueryHandler<OneReportQuery, ReportDetails>
{
    public async Task<ReportDetails> ExecuteAsync(
        OneReportQuery query,
        CancellationToken cancellationToken
    )
    {
        var reportDetails = (from report in facade.Of<Report>()
                             .Include(r => r.Property).Include(r => r.Booking)
                             where report.Id == query.Id
                             select new ReportDetails(
                                 report.Id,
                                 report.Title,
                                 report.Description,
                                 report.IsRead,
                                 report.IsClosed,
                                 report.CreatedOn,
                                 new ReportPropertyDetails(
                                     report.Property.Name,
                                     report.Property.Type,
                                     report.Property.Location,
                                     report.Property.Email,
                                     report.Property.PhoneNumber,
                                     report.Property.Rating
                                 ),
                                 new ReportUserDetails(
                                     report.User.FirstName,
                                     report.User.LastName,
                                     report.User.Email,
                                     report.User.PhoneNumber,
                                     report.User.ProfilePicture
                                 )
                             )
                            ).FirstOrDefault();

        return reportDetails;
    }
}
