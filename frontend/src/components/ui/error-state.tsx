import { WifiOff } from 'lucide-react';

interface ErrorStateProps {
    message: string;
    className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, className }) => {
    return (
        <div className={`w-full rounded-md border bg-[hsl(var(--navbar))] h-64 flex flex-col items-center justify-center gap-4 ${className}`}>
            <WifiOff className="h-12 w-12 text-gray-400" />
            <span className="text-gray-400">{message}</span>
        </div>
    );
}; 