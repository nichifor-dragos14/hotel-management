using Microsoft.Extensions.Options;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace HotelManagement.Core.EmailService;

public class EmailService(IOptions<EmailOptions> _options) : IEmailService
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
                <p>Your booking for {startDate.Date} - {endDate.Date} is now confirmed. We are looking forward to meeting you!</p>
                <p>Log into your account and check the Upcoming Bookings section for additional information.</p>

                <p style="margin-top: 100px">Best wishes, <br> HotelManagement team</p>
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
            Console.WriteLine(ex);
        }

    }
}
