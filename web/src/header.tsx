import { Logo } from '~/components/logo';
import { cn } from '~/utils/cn';
import { PoweredBy } from './components/powered-by';

export function Header() {
  return (
    <header
      className={cn(
        'p-6',
        'backdrop-blur',
        'bg-background/80',
        'absolute',
        'right-0',
        'top-0',
        'left-0',
        'col-span-2',
        'z-50',
        'border-b',
        'h-20',
        'flex',
        'items-center'
      )}
    >
      <nav className={cn('w-full', 'flex', 'items-center', 'justify-between')}>
        <Logo />
        <PoweredBy repo="marco" />
      </nav>
    </header>
  );
}
