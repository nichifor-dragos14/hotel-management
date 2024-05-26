using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;
using Microsoft.Extensions.Options;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace HotelManagement.Core.EmailService;

public class EmailService(IOptions<EmailOptions> _options, IQueryFacade _queryFacade) : IEmailService
{
    public async Task ComposeBookingConfirmationEmail(string firstName, string lastName, string userEmailAddress, DateTime startDate, DateTime endDate, string host, int port)
    {
        var gmailAddress = _options.Value.GmailAddress;

        var htmlBody = $"""
            <html>
            <head>
            </head>
            <body>
                <h1> This email was sent to confirm your reservation! </h1>
                <h2>{lastName} {firstName}, thank you for choosing us!</h2>
                <p>Your booking for {startDate.ToShortDateString()} - {endDate.ToShortDateString()} is now confirmed. We are looking forward to meeting you!</p>
                <p>Log into your account and check the Upcoming Bookings section for additional information.</p>

                <p style="margin-top: 0px">Best wishes, <br> HotelManagement team</p>
            </body>
            </html>
            """;

        var emailMessage = new Email();

        emailMessage.From = new Email.MailboxAddress
        {
            Name = "HotelManagement",
            Address = gmailAddress
        };

        emailMessage.To = new Email.MailboxAddress
        {
            Name = $"{lastName} {firstName}",
            Address = userEmailAddress
        };

        emailMessage.Subject = "Booking Confirmation";
        emailMessage.Body = htmlBody;

        await Send(emailMessage);
    }

    public async Task Send(Email emailMessage)
    {
        var gmailAddress = _options.Value.GmailAddress;
        var password = _options.Value.Password;
        var host = _options.Value.Host;
        var port = _options.Value.Port;

        using var client = new SmtpClient();

        try
        {
            await client.ConnectAsync(host, port, false);
            await client.AuthenticateAsync(gmailAddress, password);
            await client.SendAsync(EmailToMimeMessage.ConvertedEmail(emailMessage));
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
        }

    }

    public async Task<string> SendAccountValidationEmail(string userEmailAddress, string firstName, string lastName, string host, int port)
    {
        var user = _queryFacade.Of<User>().FirstOrDefault(u => u.Email == userEmailAddress);

        if (user != null)
        {
            return null;
        }

        var gmailAddress = _options.Value.GmailAddress;

        var activationToken = Guid.NewGuid().ToString();
        var activationLink = $"{host}/auth/activate-account?token={activationToken}&email={userEmailAddress}";

        var htmlBody = $"""
            <html>
            <head>
            </head>
            <body>
                <h1>Thank you for choosing us! Please, confirm your email.</h1>
                <h2>In order to have access to our website you need to confirm your email.</h2>
                <a href='{activationLink}'>Activate your account here.</a>

                <p style="margin-top: 50px">Best wishes, <br> HotelManagement team</p>
            </body>
            </html>
            """;

        var emailMessage = new Email();

        emailMessage.From = new Email.MailboxAddress
        {
            Name = "HotelManagement",
            Address = gmailAddress
        };

        emailMessage.To = new Email.MailboxAddress
        {
            Name = $"{lastName} {firstName}",
            Address = userEmailAddress
        };

        emailMessage.Subject = "Account confirmation";
        emailMessage.Body = htmlBody;

        await Send(emailMessage);

        return activationToken;
    }


    public async Task SendDiscountsNotificationOnEmail(string firstName, string lastName, string userEmailAddress, DateTime startDate, DateTime endDate)
    {
        var gmailAddress = _options.Value.GmailAddress;

        var htmlBody = $"""
            <html>
            <head>
            </head>
            <body>
                <h1> You have new discounts! </h1>
                <h2>{lastName} {firstName}, we created a new list of discounts for you!</h2>
                <p>The discounts are available from {startDate.ToShortDateString()} to {endDate.ToShortDateString()}!</p>
                <p>Visit our site for more details!</p>

                <p style="margin-top: 50px">Best wishes, <br> HotelManagement team</p>
            </body>
            </html>
            """;

        var emailMessage = new Email();

        emailMessage.From = new Email.MailboxAddress
        {
            Name = "HotelManagement",
            Address = gmailAddress
        };

        emailMessage.To = new Email.MailboxAddress
        {
            Name = $"{lastName} {firstName}",
            Address = userEmailAddress
        };

        emailMessage.Subject = "New property discounts";
        emailMessage.Body = htmlBody;

        await Send(emailMessage);
    }
}
