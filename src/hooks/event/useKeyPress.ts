import { useState, useEffect } from 'react';

// CHECK: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
export const useKeyPress = (targetKeyCode: string | number): boolean => {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        let prevKeyCode: string | number = '';

        const downHandler = ({ keyCode }: { keyCode: number }) => {
            if (prevKeyCode === targetKeyCode) return;

            if (keyCode === targetKeyCode) {
                setKeyPressed(true);
                prevKeyCode = keyCode;
            }
        };

        const upHandler = ({ keyCode }: { keyCode: number }) => {
            if (keyCode === targetKeyCode) {
                setKeyPressed(false);
                prevKeyCode = '';
            }
        };

        window.addEventListener('keydown', downHandler);

        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [targetKeyCode]);

    return keyPressed;
};
