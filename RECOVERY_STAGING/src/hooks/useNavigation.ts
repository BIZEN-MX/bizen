import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useNavigatingLoading() {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const pushWithLoading = (path: string) => {
    setIsNavigating(true);
    router.push(path);
  };

  useEffect(() => {
    // Clear loading state after navigation completes
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isNavigating]);

  return { isNavigating, setIsNavigating, pushWithLoading };
}


