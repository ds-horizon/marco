import { TimelineViewData } from './timeline-row';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';

export function RawDataAccordion({
  formattedData,
}: {
  formattedData: (Record<string, number> & {
    itr: number;
    total: number;
  })[];
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl font-bold">
          {formattedData.length} Total iterations
        </AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-72 w-full rounded-md border">
            <TimelineViewData formattedData={formattedData} />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
