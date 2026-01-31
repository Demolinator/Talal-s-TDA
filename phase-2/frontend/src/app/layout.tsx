import { redirect } from 'next/navigation';

/**
 * Root Layout - Redirects to localized version
 *
 * This layout is only used for the root path redirect.
 * All actual pages are under [locale] directory.
 */
export default function RootLayout() {
  // Redirect to default locale
  redirect('/en');
}
