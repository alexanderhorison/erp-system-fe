import { useEffect } from 'react';

const useDisableNumberInputScroll = () => {
  useEffect(() => {
    const handleScroll = (event) => {
      const inputElement = event.target;
      if (inputElement.tagName.toLowerCase() === 'input' && inputElement.type.toLowerCase() === 'number') {
        inputElement.blur();
      }
    };

    document.addEventListener('mousewheel', handleScroll);
    document.addEventListener('wheel', handleScroll);

    return () => {
      document.removeEventListener('mousewheel', handleScroll);
      document.removeEventListener('wheel', handleScroll);
    };
  }, []);
};

export default useDisableNumberInputScroll;