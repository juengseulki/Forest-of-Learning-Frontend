import { useState, useEffect } from 'react';

export const usePickerTheme = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const themeOnHtml = document.documentElement.getAttribute('data-theme');
      if (themeOnHtml) setTheme(themeOnHtml);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};
