using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Discounts;
using HotelManagement.Core.EmailService;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace HotelManagement.Infrastructure.ExtensionMethods;

public class DiscountJob(IQueryFacade queryFacade, IUnitOfWork unitOfWork, IEmailService emailService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var users = await queryFacade.Of<User>().Where(u => u.Role == Role.Client).ToListAsync();
        var properties = await queryFacade.Of<Property>().Include(p => p.Discounts).ToListAsync();

        var randomDiscountPercentage = new Random();

        var discounts = unitOfWork.GetRepository<Discount>();

        var startDate = DateTime.UtcNow;
        var endDate = DateTime.UtcNow.AddDays(14);

        int numberOfDiscounts = 0;
        int discountRangeLow = 0;
        int discountRangeHigh = 0;

        foreach (var user in users)
        {
            if (user.GeniusLevel == GeniusLevel.Level1)
            {
                numberOfDiscounts = 3;
                discountRangeLow = 5;
                discountRangeHigh = 10;
            }
            else if (user.GeniusLevel == GeniusLevel.Level2)
            {
                numberOfDiscounts = 5;
                discountRangeLow = 10;
                discountRangeHigh = 15;
            }
            else if (user.GeniusLevel == GeniusLevel.Level3)
            {
                numberOfDiscounts = 7;
                discountRangeLow = 10;
                discountRangeHigh = 20;
            }

            var randomProperties = properties
               .OrderBy(p => Guid.NewGuid())
               .Take(numberOfDiscounts)
               .ToList();

            foreach(var property in randomProperties)
            {
                var discount = property.Discounts.Find(d => d.UserId == user.Id);

                if (discount != null)
                {
                    discounts.Remove(discount);
                }

                var newDiscount = Discount.Create(
                    startDate,
                    endDate,
                    randomDiscountPercentage.Next(discountRangeLow, discountRangeHigh),
                    user,
                    property
                );

                discounts.Add(newDiscount);
            }


            await unitOfWork.SaveChangesAsync(CancellationToken.None);

            if(user.SendOffersOnEmail)
            {
                await emailService.SendDiscountsNotificationOnEmail(user.FirstName, user.LastName, user.Email, startDate, endDate);
            }
        }
    }
}