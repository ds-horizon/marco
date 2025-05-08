import { Logo } from '~/components/logo';
import { cn } from '~/utils/cn';
import { PoweredBy } from './components/powered-by';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

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

        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            onTabChange(value as 'reports' | 'comparison')
          }
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="reports">Individual Report</TabsTrigger>
            <TabsTrigger value="comparison">Compare Reports</TabsTrigger>
          </TabsList>
        </Tabs>

        <PoweredBy repo="marco" />
      </nav>
    </header>
  );
}
