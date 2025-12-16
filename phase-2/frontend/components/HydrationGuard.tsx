"use client";

import { useEffect, useState } from "react";

/**
 * HydrationGuard Component
 *
 * Prevents hydration mismatches caused by browser extensions (BitDefender, AdBlock, etc.)
 * that inject attributes or modify DOM elements before React hydrates.
 *
 * This component ensures that children only render after hydration is complete,
 * eliminating server/client HTML differences.
 */
export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Clean up browser extension attributes that cause hydration mismatches
    const cleanupExtensionAttributes = () => {
      const extensionAttributes = [
        "bis_skin_checked",
        "bis_register",
        "__processed_3156a7e1-e5c3-47de-ae90-2e1521714a72__",
        "data-adblock-key",
        "data-extension-id",
      ];

      extensionAttributes.forEach((attr) => {
        const elements = document.querySelectorAll(`[${attr}]`);
        elements.forEach((el) => {
          el.removeAttribute(attr);
        });
      });
    };

    // Clean up immediately and after a short delay for dynamic injections
    cleanupExtensionAttributes();
    const timeoutId = setTimeout(cleanupExtensionAttributes, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Return null on server-side and first client render
  // This prevents hydration mismatches from browser extensions
  if (!hasMounted) {
    return null;
  }

  // Only render children after hydration is complete
  return <>{children}</>;
}

/**
 * NoSSR Component
 *
 * Alternative approach for components that should never be server-rendered
 * Use this for components that have dynamic content or interact with browser APIs
 */
export function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

/**
 * ClientOnly Component with Fallback
 *
 * Renders a fallback during SSR and hydration, then shows the actual content
 * Useful for components that need to show something during loading
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
