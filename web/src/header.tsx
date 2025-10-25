import { Logo } from '~/components/logo';
import { cn } from '~/utils/cn';
import { PoweredBy } from './components/powered-by';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import Icon from '~/components/icon.tsx';
import favicon from '../src/assets/dream11-logo.svg';
import { Button } from './components/ui/button';
import { Menu } from 'lucide-react';

export function Header({
  currentTab,
  onTabChange,
  isMobile,
  onOpenSidebar,
}: {
  currentTab: 'reports' | 'comparison';
  onTabChange: (tab: 'reports' | 'comparison') => void;
  isMobile?: boolean;
  onOpenSidebar?: () => void; // ⬅️ optional handler for menu
}) {
  return (
    <header
      className={cn(
        'p-2 md:p-6',
        'px-4',
        'backdrop-blur',
        'bg-background/80',
        'fixed',
        'right-0',
        'top-0',
        'left-0',
        'z-50',
        'border-b',
        'h-auto',
        'flex',
        'flex-col',
        'gap-2'
      )}
    >
      {isMobile ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={onOpenSidebar}
              className="shadow"
              size="icon"
              variant="outline"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Icon />
          </div>
          <a href="https://github.com/ds-horizon/marco" target="_blank">
            <img src={favicon} alt="Dream11 Logo" width={24} height={24} />
          </a>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between">
          <Logo />
          <Tabs
            value={currentTab}
            onValueChange={(value) =>
              onTabChange(value as 'reports' | 'comparison')
            }
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports" className="text-xs md:text-sm">
                Individual Report
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-xs md:text-sm">
                Compare Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <PoweredBy repo="marco" />
        </div>
      )}

      {isMobile && (
        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            onTabChange(value as 'reports' | 'comparison')
          }
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="reports" className="text-s">
              Individual Report
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-s">
              Compare Report
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </header>
  );
}
