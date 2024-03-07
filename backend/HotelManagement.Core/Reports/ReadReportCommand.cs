using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reports;

public record ReadReportCommand(Guid Id) : ICommand<Guid?>;

internal class ReadReportCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<ReadReportCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(ReadReportCommand command, CancellationToken cancellationToken)
    {
        var reports = unitOfWork.GetRepository<Report>();

        if (reports.TryGetById([command.Id], out var report))
        {
            report.Read();

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return report.Id;
        }

        return null;
    }
}