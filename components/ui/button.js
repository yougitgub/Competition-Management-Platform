import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, children, ...props }) {
    return (
        <button
            className={twMerge(
                clsx(
                    'flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:scale-95 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600',
                    className
                )
            )}
            {...props}
        >
            {children}
        </button>
    );
}
