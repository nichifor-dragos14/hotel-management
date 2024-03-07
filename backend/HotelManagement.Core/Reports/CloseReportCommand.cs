using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reports;

public record CloseReportCommand(Guid Id) : ICommand<Guid?>;

internal class CloseReportCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<CloseReportCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(CloseReportCommand command, CancellationToken cancellationToken)
    {
        var reports = unitOfWork.GetRepository<Report>();

        if (reports.TryGetById([command.Id], out var report))
        {
            report.Close();

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return report.Id;
        }

        return null;
    }
}