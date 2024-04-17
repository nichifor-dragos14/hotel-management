﻿using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record PropertyReview(
    Guid Id,
    string Title,
    string Description,
    double Rating,
    DateTime CreatedOn,
    DateTime UpdatedOn,
    string UserFirstName,
    string UserLastName,
    string UserNationality,
    int RowNumber
);

public record AllPropertyReviewsQuery(int From, int To, Guid Id) : IQuery<IPaginatedResult<PropertyReview>>;