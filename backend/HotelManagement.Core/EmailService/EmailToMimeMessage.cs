using MimeKit;

namespace HotelManagement.Core.EmailService;

public static class EmailToMimeMessage
{
    public static MimeMessage ConvertedEmail(Email email)
    {
        if (email == null)
        {
            return null;
        }

        MimeMessage message = new();

        message.Subject = email.Subject;
        message.From.Add(new MailboxAddress(email.From.Name, email.From.Address));
        message.To.Add(new MailboxAddress(email.To.Name, email.To.Address));

        var textPart = new TextPart("plain")
        {
            Text = "Please enable HTML in your email client to view this message."
        };

        var htmlPart = new TextPart("html")
        {
            Text = email.Body
        };

        var body = new Multipart
        {
            textPart,
            htmlPart
        };

        message.Body = body;

        return message;
    }
}
