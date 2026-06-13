import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getSettings, updateSettings } from "../modules/settings";
import StorefrontOnboarding from "../shared/storefront-onboarding";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getSettings(session.shop);

  // Already completed? Redirect to dashboard
  if (settings.hasCompletedOnboarding) {
    return redirect("/app");
  }

  return { onboarding: true };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const fd = await request.formData();

  if (fd.get("intent") === "complete-onboarding") {
    await updateSettings(session.shop, { hasCompletedOnboarding: true });
  }

  return { success: true };
};

export default function OnboardingRoute() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Loader redirects if already completed — data is always { onboarding: true } here
  if (!("onboarding" in data)) {
    return null;
  }

  const handleComplete = async () => {
    const formData = new FormData();
    formData.append("intent", "complete-onboarding");
    await fetch("/app/onboarding", {
      method: "POST",
      body: formData,
    });
    navigate("/app");
  };

  return <StorefrontOnboarding onComplete={handleComplete} />;
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (h) => boundary.headers(h);
