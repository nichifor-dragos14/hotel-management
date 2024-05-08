using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;

namespace HotelManagement.Core.Reports;

public record ReportDetails(
    Guid Id,
    string Title,
    string Description,
    bool IsRead,
    bool IsClosed,
    DateTime CreatedOn,
    ReportPropertyDetails PropertyDetails,
    ReportUserDetails UserDetails
);

public record ReportPropertyDetails(
    string Name,
    PropertyType Type,
    string Location,
    string Email ,
    string PhoneNumber,
    int Rating 
);

public record ReportUserDetails(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string ProfilePicture
);

public record OneReportQuery(
    Guid? Id
) : IQuery<ReportDetails>;
