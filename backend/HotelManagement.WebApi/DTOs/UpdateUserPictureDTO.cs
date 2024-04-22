namespace HotelManagement.WebApi.DTOs;

public class UpdateUserPictureDTO
{
    public Guid UserId { get; set; }
    public IFormFile File { get; set; }
}
