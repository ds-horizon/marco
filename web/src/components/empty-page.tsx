import { cn } from '~/utils/cn';

export const EmptyPage = ({ content }: { content: string }) => {
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
      {content}
    </div>
  );
};
