import { cn } from "~/utils/cn"

export const EmptyPage = () => {
    return (
        <div
        className={cn(
          'bg-card/20',
          'p-4',
          'text-center',
          'rounded-lg',
          'mt-4',
          'min-h-full',
          'flex',
          'items-center',
          'justify-center',
          'text-2xl'
        )}
      >
        Select at least two tags to
        compare.
      </div>
    )
}