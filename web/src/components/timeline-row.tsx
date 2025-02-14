import React from "react"
import { cn } from "~/utils/cn";

interface TimelineViewProps {
    formattedData: (Record<string, number> & {
        itr: number;
        total: number;
    })[]
}

export const TimelineViewData = ({formattedData}: TimelineViewProps) => {
    return (
        <div 
        className={cn(
            'grid',
            'grid-flow-row',
            'gap-4',
            'grid-cols-[max-content,1fr]',
            'overflow-x-auto',
            'items-center',
            'py-8',
            'bg-card',
            'rounded-lg'
          )}
        >
        {
            formattedData.map((d, index) => (
            <React.Fragment key={`iteration-${index}`}>
              <div
                className={cn(
                  'bg-gradient-to-r',
                  'from-card',
                  'via-card',
                  'via-70%',
                  'to-transparent',
                  'flex',
                  'items-center',
                  'gap-2',
                  'pr-8',
                  'sticky',
                  'left-0',
                  'pl-4'
                )}
              >
                <span className="p-4 rounded-lg bg-background/25 justify-self-center">
                  {index + 1}
                </span>
                <div
                  className={cn(
                    'grid',
                    'grid-flow-row',
                    'gap-1',
                    'text-xs'
                  )}
                >
                  <span className="text-muted-foreground">Total:</span>
                  <span>{d.total.toFixed(2)}ms</span>
                </div>
              </div>
              <div className="flex items-center pr-4 flex-nowrap">
                {Object.entries(d)
                  .filter(([key]) => !['itr', 'total'].includes(key))
                  .map(([key, value], index) => (
                    <React.Fragment key={`event-itr-${index}`}>
                      {index > 0 && (
                        <span
                          className={cn(
                            'text-sm',
                            'text-muted-foreground',
                            'px-4',
                            'border-b',
                            'border-b-muted',
                            'h-max'
                          )}
                        >
                          {value.toFixed(2)}ms
                        </span>
                      )}
                      <span
                        className={cn(
                          'bg-background/25',
                          'rounded-lg',
                          'p-4',
                          'justify-self-center'
                        )}
                      >
                        {key}
                      </span>
                    </React.Fragment>
                  ))}
              </div>
            </React.Fragment>
          )
        )}
        </div>
    )
}