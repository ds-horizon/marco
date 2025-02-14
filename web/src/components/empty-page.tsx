import { cn } from "~/utils/cn"

export const EmptyPage = ({tags}: {tags: string[]}) => {
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
        Select at least {tags.length < 1 ? 'two tags' : 'one more tag'} to
        compare.
      </div>
    )
}