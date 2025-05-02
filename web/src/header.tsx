import { Logo } from '~/components/logo';
import { cn } from '~/utils/cn';
import { PoweredBy } from './components/powered-by';

export function Header({
  currentTab,
  onTabChange,
}: {
  currentTab: 'reports' | 'comparison';
  onTabChange: (tab: 'reports' | 'comparison') => void;
}) {
  return (
    <header
      className={cn(
        'p-6',
        'backdrop-blur',
        'bg-background/80',
        'fixed',
        'right-0',
        'top-0',
        'left-0',
        'z-50',
        'border-b',
        'h-20',
        'flex',
        'items-center'
      )}
    >
      <nav className="w-full flex items-center justify-between">
        <Logo />

        <div className="flex space-x-6">
          <button
            onClick={() => onTabChange('reports')}
            className={cn(
              'font-medium',
              'transition-colors',
              'hover:text-primary',
              currentTab === 'reports' && 'text-primary underline'
            )}
          >
            Individual Reports
          </button>
          <button
            onClick={() => onTabChange('comparison')}
            className={cn(
              'font-medium',
              'transition-colors',
              'hover:text-primary',
              currentTab === 'comparison' && 'text-primary underline'
            )}
          >
            Comparison Panel
          </button>
        </div>

        <PoweredBy repo="marco" />
      </nav>
    </header>
  );
}
