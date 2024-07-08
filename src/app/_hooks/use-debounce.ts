import { debounce } from "lodash";
import { useCallback, useEffect } from "react";

type UseDebounceProps<T extends (...args: any) => any> = {
  callback: T;
  delay?: number;
};

function useDebounce<T extends (...args: any) => any>({ callback, delay = 1000 }: UseDebounceProps<T>) {
  // debounce the callback
  const debouncedCallback = useCallback(debounce(callback, delay), [delay]); // with the delay

  // clean up on unmount or dependency change
  useEffect(() => {
    return () => {
      debouncedCallback.cancel(); // cancel any pending calls
    };
  }, [delay, debouncedCallback]);

  // return the debounce function so we can use it
  return debouncedCallback;
}

export default useDebounce;
