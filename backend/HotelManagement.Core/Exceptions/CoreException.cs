namespace HotelManagement.Core.Exceptions;

[Serializable]
public class CoreException(string message) : Exception(message)
{
}