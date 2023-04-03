import { useState, SyntheticEvent } from 'react';

export type MODAL<T> = {
    opened: T | string;
    toggle: (e: '' | T) => void;
    close: (e?: SyntheticEvent<HTMLButtonElement>) => void;
};

export const useModal = <T>(initialState: T | '' = ''): MODAL<T> => {
    const [toggleModal, setToggleModal] = useState<T | ''>(initialState);

    const modal: MODAL<T> = {
        opened: toggleModal,
        toggle: (e: '' | T) => setToggleModal(e),
        close: () => setToggleModal(''),
    };

    return modal;
};
