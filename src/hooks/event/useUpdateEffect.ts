import { useEffect, useRef } from 'react';

export const useUpdateEffect = (
    callback: () => void,
    dependencies: unknown[]
): void => {
    const firstRenderRef = useRef<boolean>(true);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        return callback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};
