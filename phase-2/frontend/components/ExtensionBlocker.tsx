'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * ExtensionBlocker Component
 *
 * Aggressively prevents browser extensions from injecting attributes
 * that cause React hydration errors. This component uses multiple
 * strategies to ensure a clean DOM for React hydration.
 *
 * Handles extensions like:
 * - BitDefender (bis_skin_checked, bis_register)
 * - AdBlock extensions
 * - Password managers
 * - Security extensions
 */
export function ExtensionBlocker() {
  // Use useLayoutEffect to run before paint, closest to hydration timing
  useLayoutEffect(() => {
    // Extension attributes that cause hydration mismatches
    const EXTENSION_ATTRIBUTES = [
      'bis_skin_checked',
      'bis_register',
      '__processed_3156a7e1-e5c3-47de-ae90-2e1521714a72__',
      'data-adblock-key',
      'data-extension-id',
      'data-lastpass-icon-added',
      'data-1p-ignore',
      'data-bitwarden-watching',
      'grammarly-extension',
      '__processed__',
      'bis_id',
      'bis_size'
    ];

    // Aggressive cleanup function
    const cleanupExtensionAttributes = () => {
      EXTENSION_ATTRIBUTES.forEach(attr => {
        try {
          // Query all elements with the attribute
          const elements = document.querySelectorAll(`[${attr}]`);
          elements.forEach(el => {
            try {
              el.removeAttribute(attr);
            } catch (e) {
              // Silently handle read-only attributes
            }
          });
        } catch (e) {
          // Silently handle any query errors
        }
      });
    };

    // Override setAttribute globally to prevent future injections
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
      if (EXTENSION_ATTRIBUTES.includes(name)) {
        // Silently ignore extension attributes
        return;
      }
      return originalSetAttribute.call(this, name, value);
    };

    // Set up MutationObserver for dynamic content
    let observer: MutationObserver | null = null;

    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver((mutations) => {
        let needsCleanup = false;

        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' &&
              EXTENSION_ATTRIBUTES.includes(mutation.attributeName || '')) {
            needsCleanup = true;
          } else if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const hasExtensionAttr = EXTENSION_ATTRIBUTES.some(attr =>
                  element.hasAttribute && element.hasAttribute(attr)
                );
                if (hasExtensionAttr) {
                  needsCleanup = true;
                }
              }
            });
          }
        });

        if (needsCleanup) {
          // Debounced cleanup
          setTimeout(cleanupExtensionAttributes, 0);
        }
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: EXTENSION_ATTRIBUTES
      });
    }

    // Multiple cleanup attempts at different timing intervals
    cleanupExtensionAttributes(); // Immediate
    setTimeout(cleanupExtensionAttributes, 0); // Next tick
    setTimeout(cleanupExtensionAttributes, 1); // Very soon
    setTimeout(cleanupExtensionAttributes, 10); // After extensions likely inject
    setTimeout(cleanupExtensionAttributes, 50); // Safety net
    setTimeout(cleanupExtensionAttributes, 100); // Final cleanup

    // Cleanup function for component unmount
    return () => {
      if (observer) {
        observer.disconnect();
      }
      // Restore original setAttribute (though this may not be needed)
      Element.prototype.setAttribute = originalSetAttribute;
    };
  }, []);

  // Additional useEffect for post-hydration cleanup
  useEffect(() => {
    // Suppress hydration warnings in console during development
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = function(...args) {
        const message = args[0]?.toString() || '';

        // Filter out hydration errors related to extension attributes
        if (message.includes('hydrat') && (
          message.includes('bis_skin_checked') ||
          message.includes('bis_register') ||
          message.includes('__processed_') ||
          message.includes('data-adblock') ||
          message.includes('data-extension')
        )) {
          // Silently ignore these specific hydration errors
          return;
        }

        // Allow all other errors through
        return originalError.apply(console, args);
      };

      // Cleanup on unmount
      return () => {
        console.error = originalError;
      };
    }
  }, []);

  // This component renders nothing - it's purely for side effects
  return null;
}

/**
 * Higher-order component that wraps children with extension blocking
 * Use this to protect specific parts of your app from extension interference
 */
export function withExtensionBlocking<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ExtensionBlockedComponent(props: P) {
    return (
      <>
        <ExtensionBlocker />
        <Component {...props} />
      </>
    );
  };
}

/**
 * Hook for manual extension cleanup in components
 * Returns a cleanup function that can be called on demand
 */
export function useExtensionCleanup() {
  const cleanup = () => {
    const EXTENSION_ATTRIBUTES = [
      'bis_skin_checked',
      'bis_register',
      '__processed_3156a7e1-e5c3-47de-ae90-2e1521714a72__',
      'data-adblock-key',
      'data-extension-id'
    ];

    EXTENSION_ATTRIBUTES.forEach(attr => {
      document.querySelectorAll(`[${attr}]`).forEach(el => {
        try {
          el.removeAttribute(attr);
        } catch (e) {
          // Ignore errors
        }
      });
    });
  };

  return cleanup;
}
