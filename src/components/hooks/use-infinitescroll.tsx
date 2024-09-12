import { useEffect, useRef } from "react";

/**
 * @description A hook that detects when a user scrolls to the bottom of a list and fetches the next page.
 * @param fetchNextPage - A function that fetches the next page.
 * @returns A ref to the element that is used to detect the scroll.
 */

export const useInfiniteScroll = <T extends HTMLElement>(fetchNextPage?: () => void) => {
  const optionsRef = useRef<T>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!optionsRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = optionsRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        fetchNextPage?.();
      }
    };

    const optionsElement = optionsRef.current;
    if (optionsElement) {
      optionsElement.addEventListener("scroll", handleScroll);
    }

    // Robustly detect changes in the options element
    const observer = new MutationObserver(() => {
      const newOptionsElement = optionsRef.current;
      if (newOptionsElement && newOptionsElement !== optionsElement) {
        newOptionsElement.addEventListener("scroll", handleScroll);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (optionsElement) {
        optionsElement.removeEventListener("scroll", handleScroll);
      }
      observer.disconnect();
    };
  }, [fetchNextPage]);

  return optionsRef;
};
