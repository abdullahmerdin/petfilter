import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from 'react-router';
import type { LinksFunction, LoaderFunctionArgs } from 'react-router';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from '@shopify/polaris';
import polarisTranslations from '@shopify/polaris/locales/en.json';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    polarisTranslations,
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { polarisTranslations } = useLoaderData<typeof loader>();

  return (
    <AppProvider i18n={polarisTranslations}>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    );
  }

  const err = error as Error;
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Unexpected Server Error</h1>
      <p>{err?.message || 'Unknown error'}</p>
    </div>
  );
}
