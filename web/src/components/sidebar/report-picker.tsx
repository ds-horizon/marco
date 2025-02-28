import { ReportType } from '~/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const ReportPicker = ({
  items,
  currentReportId,
  setCurrentReport,
  selectedReportsOrder,
}: {
  items: ReportType[];
  currentReportId: number;
  selectedReportsOrder: number[];
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
            <SelectItem value={index.toString()}>
              <div className="flex items-center">
                {`${item.reportName}`}
                {selectedReportsOrder.includes(index) ? (
                  <div className="w-2 h-2 ml-2 rounded-full bg-green-500 mr-2" />
                ) : null}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
