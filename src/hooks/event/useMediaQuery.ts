import { useState, useEffect } from 'react';
import { useEventListener } from './useEventListener';

type SCREEN_MATCHES = {
    maxSm: boolean;
    maxMd: boolean;
    maxLg: boolean;
    maxXl: boolean;
    maxXxl: boolean;
    minSm: boolean;
    minMd: boolean;
    minLg: boolean;
    minXl: boolean;
    minXxl: boolean;
};

const themeScreen = {
    maxSm: '(max-width: 640px)',
    maxMd: '(max-width: 769px)',
    maxLg: '(max-width: 1025px)',
    maxXl: '(max-width: 1280px)',
    maxXxl: '(max-width: 1535px)',
    minSm: '(min-width: 640px)',
    minMd: '(min-width: 769px)',
    minLg: '(min-width: 1025px)',
    minXl: '(min-width: 1280px)',
    minXxl: '(min-width: 1535px)',
};
export const useMediaQuery = (
    customMediaQuery?: string
): SCREEN_MATCHES & { customMatch: boolean } => {
    const [isCustomMediaQueryMatchMatch, setIsCustomMediaQueryMatch] =
        useState(false);
    const [themeMediaQuery, setThemeMediaQuery] = useState({});

    const [mediaQueryList, setMediaQueryList] = useState<
        MediaQueryList | Window | HTMLElement | undefined
    >();

    useEffect(() => {
        const list: MediaQueryList | Window | HTMLElement | undefined =
            customMediaQuery && typeof customMediaQuery === 'string'
                ? window.matchMedia(customMediaQuery)
                : undefined;
        const screenList = {
            //* max
            maxSm: window.matchMedia(themeScreen.maxSm).matches,
            maxMd: window.matchMedia(themeScreen.maxMd).matches,
            maxLg: window.matchMedia(themeScreen.maxLg).matches,
            maxXl: window.matchMedia(themeScreen.maxXl).matches,
            maxXxl: window.matchMedia(themeScreen.maxXxl).matches,
            //* min
            minSm: window.matchMedia(themeScreen.minSm).matches,
            minMd: window.matchMedia(themeScreen.minMd).matches,
            minLg: window.matchMedia(themeScreen.minLg).matches,
            minXl: window.matchMedia(themeScreen.minXl).matches,
            minXxl: window.matchMedia(themeScreen.minXxl).matches,
        };
        setThemeMediaQuery(screenList);
        setMediaQueryList(list);
        setIsCustomMediaQueryMatch(list?.matches ?? false);
    }, [customMediaQuery]);

    useEventListener(
        'change',
        () =>
            setIsCustomMediaQueryMatch(
                (mediaQueryList as MediaQueryList).matches
            ),
        mediaQueryList as Window | HTMLElement | undefined
    );

    const obj: SCREEN_MATCHES & { customMatch: boolean } = {
        customMatch: isCustomMediaQueryMatchMatch,
        ...(themeMediaQuery as SCREEN_MATCHES),
    };

    return obj;
};
