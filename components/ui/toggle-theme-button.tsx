'use client'

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './button'
import { Moon, Sun } from 'lucide-react';

export const ToggleThemeButton = () => {
    const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // While not ideal, we need to wait for render cycle before setting
    // mounted to avoid hydration issues with the theme.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, [])

  return isMounted && (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-foreground hover:bg-muted"
    > {isMounted ? (
        theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )
      ) : (
        // A placeholder of same size as the icons for when the component
        // isn't yet mounted.
        <div className="h-5 w-5" >{" "}</div>
      )}

    </Button>
  )
}
