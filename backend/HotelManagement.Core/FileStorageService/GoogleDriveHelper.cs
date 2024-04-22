namespace HotelManagement.Core.FileStorageService;

public class GoogleDriveHelper
{
    public static ImageUrl GetImageUrl(string prefix, string id)
    {
        return new ImageUrl { Url = prefix + id + "&sz=w1000" };
    }
}
