using Google.Apis.Drive.v3;
using Microsoft.Extensions.Options;

namespace HotelManagement.Core.FileStorageService;

public class GoogleDriveImageUploaderService(DriveService _driveService, IOptions<GoogleDriveOptions> _options) : IFileStorageService
{
    public async Task<ImageUrl> UploadImage(Stream fileContent)
    {
        var folderId = _options.Value.FolderId;

        var fileMetaData = new Google.Apis.Drive.v3.Data.File()
        {
            Parents = [folderId],
        };

        FilesResource.CreateMediaUpload request;

        request = _driveService.Files.Create(fileMetaData, fileContent, "");
        request.Fields = "id";

        try
        {
            request.Upload();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        var uploadedFile = request.ResponseBody;

        return GoogleDriveHelper.GetImageUrl(_options.Value.DrivePrefix, uploadedFile.Id);
    }
}
