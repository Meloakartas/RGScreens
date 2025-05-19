import { useCallback, useRef, useState } from 'react';

interface UseLoadingStateReturn {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

export const useLoadingState = (defaultLoading: boolean = true, minLoadingTime: number = 0): UseLoadingStateReturn => {
    const [isLoading, setIsLoading] = useState(defaultLoading);
    const startTimeRef = useRef<number | null>(null);

    const startLoading = useCallback(() => {
        startTimeRef.current = Date.now();
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        if (!startTimeRef.current) {
            setIsLoading(false);
            return;
        }

        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        if (remainingTime > 0) {
            setTimeout(() => {
                setIsLoading(false);
                startTimeRef.current = null;
            }, remainingTime);
        } else {
            setIsLoading(false);
            startTimeRef.current = null;
        }
    }, [minLoadingTime]);

    return { isLoading, startLoading, stopLoading };
}; 