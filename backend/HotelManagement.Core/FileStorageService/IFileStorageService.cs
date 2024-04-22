namespace HotelManagement.Core.FileStorageService;

public interface IFileStorageService
{
    public Task<ImageUrl> UploadImage(Stream fileContent);
}
