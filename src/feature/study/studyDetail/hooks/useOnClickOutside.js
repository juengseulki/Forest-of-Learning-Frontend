import { useEffect } from 'react';

export function useOnClickOutside(ref, handler, isOpen) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const target = event.target;

      const isInsidePicker = target.closest('.emoji-picker-container');
      const isInsideMoreList = target.closest('.emoji-wrap');

      if (isInsidePicker || isInsideMoreList) {
        return;
      }

      setTimeout(() => {
        handler();
      }, 0);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, handler, isOpen]);
}
