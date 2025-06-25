import { Logo } from '~/components/logo';
import { cn } from '~/utils/cn';
import { PoweredBy } from './components/powered-by';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import Icon from '~/components/icon.tsx';
import favicon from '../src/assets/dream11-logo.svg';

export function Header({
  currentTab,
  onTabChange,
  isMobile,
}: {
  currentTab: 'reports' | 'comparison';
  onTabChange: (tab: 'reports' | 'comparison') => void;
  isMobile?: boolean;
}) {
  return (
    <header
      className={cn(
        'p-4 md:p-6',
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
      <nav className="w-full flex items-center justify-between pl-12 md:pl-0">
        {isMobile ? <Icon /> : <Logo />}

        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            onTabChange(value as 'reports' | 'comparison')
          }
          className="w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports" className="text-xs md:text-sm">
              <span className="hidden sm:inline">Individual Report</span>
              <span className="sm:hidden">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs md:text-sm">
              <span className="hidden sm:inline">Compare Reports</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isMobile ? (
          <a
            href={`https://github.com/dream-sports-labs/marco`}
            target="_blank"
          >
            <img src={favicon} alt={'Dream11 Logo'} width={24} height={24} />
          </a>
        ) : (
          <PoweredBy repo="marco" />
        )}
      </nav>
    </header>
  );
}
