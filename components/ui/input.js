import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function Input({ className, ...props }) {
    return (
        <input
            className={twMerge(clsx(
                "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400",
                className
            ))}
            {...props}
        />
    )
}
