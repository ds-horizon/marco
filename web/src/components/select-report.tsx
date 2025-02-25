import { ReportType } from '~/data-multiple';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const SelectReport = ({
  items,
  currentReportId,
  setCurrentReport,
}: {
  items: ReportType[];
  currentReportId: number;
  setCurrentReport: React.Dispatch<React.SetStateAction<number>>;
}) => {
  if (items.length < 1) {
    return;
  }

  return (
    <Select
      onValueChange={(v) => {
        setCurrentReport(Number(v));
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={items[currentReportId].reportName} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item, index) => {
          return (
            <SelectItem value={index.toString()}>{item.reportName}</SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
