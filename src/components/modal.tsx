
import type { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-colors 
            ${isOpen ? 'visible bg-black/20' : 'invisible'}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-xl shadow p-6 transition-all
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
            >
                {children}
            </div>
        </div>
    )
}
