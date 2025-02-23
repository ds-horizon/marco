import { TimelineViewData } from "./timeline-row";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "./ui/accordion"
  
  export function RawDataAccordion({formattedData}: {formattedData: (Record<string, number> & {
    itr: number;
    total: number;
})[]}) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-bold">{30} Total iterations</AccordionTrigger>
          <AccordionContent>
            <TimelineViewData formattedData={formattedData}/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  