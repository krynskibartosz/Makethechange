import { useEffect, useRef } from 'react';

export const useEventListener = (
    eventType: string,
    callback: (event: Event) => void,
    element: HTMLElement | Window = window
) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (element == null) return;
        const handler = (event: Event) => callbackRef.current(event);
        element.addEventListener(eventType, handler);

        return () => element.removeEventListener(eventType, handler);
    }, [element, eventType]);
};
