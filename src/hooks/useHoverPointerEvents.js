import { useEffect, useRef } from 'react';

// Attaches window pointer listeners (e.g. mousemove, mouseover) only on
// devices that actually have a hover-capable pointer, and cleans them up on
// unmount. `handlers` is a map of event type -> listener.
export default function useHoverPointerEvents(handlers) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const listeners = Object.keys(handlersRef.current).map((type) => {
      const listener = (event) => {
        const handler = handlersRef.current[type];
        if (handler) handler(event);
      };
      window.addEventListener(type, listener);
      return [type, listener];
    });

    return () => {
      listeners.forEach(([type, listener]) => {
        window.removeEventListener(type, listener);
      });
    };
  }, []);
}
