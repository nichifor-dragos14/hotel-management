using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reports;

public record OpenReportCommand(Guid Id) : ICommand<Guid?>;

internal class OpenReportCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<OpenReportCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(OpenReportCommand command, CancellationToken cancellationToken)
    {
        var reports = unitOfWork.GetRepository<Report>();

        if (reports.TryGetById([command.Id], out var report))
        {
            report.Open();

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return report.Id;
        }

        return null;
    }
}