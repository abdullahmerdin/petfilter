import { useEffect } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useNavigation, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <AppProvider embedded apiKey={apiKey}>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--p-color-bg-fill-brand)",
              width: "30%",
              animation: "pf-slide 1s ease-in-out infinite",
            }}
          />
        </div>
      )}
      <ui-nav-menu>
        <a href="/app" rel="home" style={{ fontWeight: 600 }}>PetFilter</a>
        <a href="/app">Dashboard</a>
        <a href="/app/products">Products</a>
        <a href="/app/rules">Filter Rules</a>
        <a href="/app/matching">Matching</a>
        <a href="/app/settings">Settings</a>
        <a href="/app/billing">Billing</a>
      </ui-nav-menu>
      <ui-page full-width>
        <Outlet />
      </ui-page>
      <style>{`
        @keyframes pf-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        ui-page { --top-bar-height: 0px !important; }
      `}</style>
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
