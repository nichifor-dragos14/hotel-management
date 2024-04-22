namespace HotelManagement.Core.FileStorageService;

public class GoogleDriveOptions
{
    public const string Options = "Drive";

    public string FolderId { get; set; }

    public string DrivePrefix { get; set; }

    public string DefaultProfilePicture { get; set; }

    public string DefaultPropertyPicture { get; set; }
}
