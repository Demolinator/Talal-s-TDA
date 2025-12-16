'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * HydrationSafetyWrapper Component
 *
 * This component provides a safe wrapper for hydration that detects
 * browser extension interference and gracefully handles hydration
 * mismatches by disabling SSR for problematic content.
 *
 * Features:
 * - Detects browser extension attributes before hydration
 * - Falls back to client-only rendering when extensions detected
 * - Provides loading states during hydration safety checks
 * - Suppresses hydration warnings for known extension conflicts
 */

interface HydrationSafetyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  enableFallback?: boolean;
}

export function HydrationSafetyWrapper({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />,
  enableFallback = true,
}: HydrationSafetyWrapperProps) {
  const [isSafeToHydrate, setIsSafeToHydrate] = useState(false);
  const [extensionsDetected, setExtensionsDetected] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Extension attributes that commonly cause hydration issues
    const PROBLEMATIC_ATTRIBUTES = [
      'bis_skin_checked',
      'bis_register',
      '__processed_3156a7e1-e5c3-47de-ae90-2e1521714a72__',
      'data-adblock-key',
      'data-extension-id',
      'data-lastpass-icon-added',
      'data-1p-ignore',
      'data-bitwarden-watching',
      'grammarly-extension',
      'data-darkreader-inline-bgcolor',
      'data-darkreader-inline-color',
    ];

    // Check if any extension attributes are present
    const detectExtensions = () => {
      let detected = false;

      PROBLEMATIC_ATTRIBUTES.forEach(attr => {
        const elements = document.querySelectorAll(`[${attr}]`);
        if (elements.length > 0) {
          detected = true;
        }
      });

      return detected;
    };

    // Clean up extension attributes
    const cleanupExtensionAttributes = () => {
      let cleaned = false;

      PROBLEMATIC_ATTRIBUTES.forEach(attr => {
        const elements = document.querySelectorAll(`[${attr}]`);
        elements.forEach(el => {
          try {
            el.removeAttribute(attr);
            cleaned = true;
          } catch (e) {
            // Some attributes might be read-only
          }
        });
      });

      return cleaned;
    };

    // Initial detection and cleanup
    const initialExtensionsDetected = detectExtensions();
    setExtensionsDetected(initialExtensionsDetected);

    if (initialExtensionsDetected) {
      // Attempt cleanup
      const wasCleanedUp = cleanupExtensionAttributes();

      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[HydrationSafetyWrapper] Browser extensions detected that may cause hydration issues. ' +
          (wasCleanedUp ? 'Cleanup attempted.' : 'Cleanup failed.')
        );
      }
    }

    // Set up MutationObserver to handle dynamic extension injections
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        let extensionsFound = false;

        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const attrName = mutation.attributeName;
            if (attrName && PROBLEMATIC_ATTRIBUTES.includes(attrName)) {
              extensionsFound = true;
              // Remove the attribute immediately
              const target = mutation.target as Element;
              try {
                target.removeAttribute(attrName);
              } catch (e) {
                // Attribute might be read-only
              }
            }
          } else if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                PROBLEMATIC_ATTRIBUTES.forEach(attr => {
                  if (element.hasAttribute && element.hasAttribute(attr)) {
                    extensionsFound = true;
                    try {
                      element.removeAttribute(attr);
                    } catch (e) {
                      // Attribute might be read-only
                    }
                  }
                });
              }
            });
          }
        });

        if (extensionsFound && !extensionsDetected) {
          setExtensionsDetected(true);
        }
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: PROBLEMATIC_ATTRIBUTES,
      });

      cleanupRef.current = () => observer.disconnect();
    }

    // Override console.error to suppress hydration warnings during development
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        const message = args[0]?.toString() || '';

        // Suppress hydration errors related to extension attributes
        if (message.includes('hydrat') &&
            PROBLEMATIC_ATTRIBUTES.some(attr => message.includes(attr))) {
          // Log a more helpful message instead
          console.warn(
            '[HydrationSafetyWrapper] Suppressed hydration warning caused by browser extension attributes'
          );
          return;
        }

        // Allow other errors through
        return originalError.apply(console, args);
      };

      const originalConsoleErrorCleanup = cleanupRef.current;
      cleanupRef.current = () => {
        console.error = originalError;
        originalConsoleErrorCleanup?.();
      };
    }

    // Delay hydration safety check to allow extensions to inject their content
    const timeoutId = setTimeout(() => {
      setIsSafeToHydrate(true);
    }, extensionsDetected ? 100 : 0);

    return () => {
      clearTimeout(timeoutId);
      cleanupRef.current?.();
    };
  }, [extensionsDetected]);

  // Server-side rendering - always render children
  if (!isClient) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  // Client-side: Check if it's safe to hydrate
  if (!isSafeToHydrate && enableFallback) {
    return <div suppressHydrationWarning>{fallback}</div>;
  }

  // Safe to render children
  return (
    <div suppressHydrationWarning={extensionsDetected}>
      {children}
    </div>
  );
}

/**
 * Hook for detecting browser extensions in components
 * Returns whether extensions are detected and a cleanup function
 */
export function useExtensionDetection() {
  const [extensionsDetected, setExtensionsDetected] = useState(false);

  useEffect(() => {
    const EXTENSION_ATTRIBUTES = [
      'bis_skin_checked',
      'bis_register',
      '__processed_3156a7e1-e5c3-47de-ae90-2e1521714a72__',
    ];

    const checkExtensions = () => {
      return EXTENSION_ATTRIBUTES.some(attr =>
        document.querySelectorAll(`[${attr}]`).length > 0
      );
    };

    const detected = checkExtensions();
    setExtensionsDetected(detected);

    if (detected && process.env.NODE_ENV === 'development') {
      console.info('[Extension Detection] Browser extensions detected');
    }
  }, []);

  const cleanup = () => {
    const EXTENSION_ATTRIBUTES = [
      'bis_skin_checked',
      'bis_register',
      '__processed_3156a7e1-e5c3-47de-ae90-2e1521714a72__',
    ];

    EXTENSION_ATTRIBUTES.forEach(attr => {
      document.querySelectorAll(`[${attr}]`).forEach(el => {
        try {
          el.removeAttribute(attr);
        } catch (e) {
          // Ignore read-only attribute errors
        }
      });
    });
  };

  return { extensionsDetected, cleanup };
}

/**
 * Simple wrapper that disables SSR for problematic components
 * Use this for components that frequently have hydration issues
 */
export function NoSSRWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
