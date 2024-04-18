namespace HotelManagement.Core.EmailService;

public interface IEmailService
{
    Task ComposeBookingConfirmationEmail(string firstName, string lastName, string userEmailAddress, DateTime startDate, DateTime endDate, string host, int port);

    Task Send(Email emailMessage);
}
