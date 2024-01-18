import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib';
import { Icons } from './icons';

const spinnerVariants = cva('mr-2 animate-spin', {
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: 'h-4 w-4',
      lg: 'h-8 w-8',
      sm: 'h-2 w-4',
      xl: 'h-16 w-16',
    },
  },
});

interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size }: SpinnerProps) {
  return (
    <>
      <Icons.spinner className={cn(spinnerVariants({ className, size }))} />
      <span className="sr-only">loading</span>
    </>
  );
}

export { Spinner, type SpinnerProps, spinnerVariants };
