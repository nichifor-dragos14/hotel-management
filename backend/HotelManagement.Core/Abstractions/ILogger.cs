namespace HotelManagement.Core.Abstractions;

public interface ILogger<T>
{
    public void LogInformation(string template);
}