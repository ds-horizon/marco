import { Logo } from '~/components/logo';
import { cn } from '~/utils/cn';

export function Header() {
  return (
    <header
      className={cn(
        'p-6',
        'backdrop-blur',
        'bg-background/50',
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
      <nav className="container">
        <Logo />
      </nav>
    </header>
  );
}
