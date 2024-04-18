namespace HotelManagement.Core.EmailService;

public class Email
{
    public struct MailboxAddress
    {
        public string Name;
        public string Address;
    }

    public MailboxAddress From { get; set; }

    public MailboxAddress To { get; set; }

    public string Subject { get; set; }

    public string Body {  get; set; }
}
