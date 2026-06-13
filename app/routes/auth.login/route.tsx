import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isEmbedded = url.searchParams.get("embedded") === "1";

  try {
    const result = await login(request);
    return { errors: loginErrorMessage(result), isEmbedded };
  } catch (error) {
    if (error instanceof Response && error.status >= 300 && error.status < 400 && isEmbedded) {
      const location = error.headers.get("Location");
      if (location && (location.includes("accounts.shopify.com") || location.includes("/admin/oauth/install"))) {
        return new Response(
          `<html><body><script type="text/javascript">window.top.location.href = ${JSON.stringify(location)};</script></body></html>`,
          { headers: { "Content-Type": "text/html" } }
        );
      }
    }
    throw error;
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const isEmbedded = url.searchParams.get("embedded") === "1";

  try {
    const result = await login(request);
    return { errors: loginErrorMessage(result), isEmbedded };
  } catch (error) {
    if (error instanceof Response && error.status >= 300 && error.status < 400 && isEmbedded) {
      const location = error.headers.get("Location");
      if (location && (location.includes("accounts.shopify.com") || location.includes("/admin/oauth/install"))) {
        return new Response(
          `<html><body><script type="text/javascript">window.top.location.href = ${JSON.stringify(location)};</script></body></html>`,
          { headers: { "Content-Type": "text/html" } }
        );
      }
    }
    throw error;
  }
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");
  const { errors, isEmbedded } = (actionData || loaderData) as any;

  return (
    <AppProvider embedded={false}>
      <s-page>
        <Form method="post" action={isEmbedded ? "?embedded=1" : ""}>
          <s-section heading="Log in">
            <s-text-field
              name="shop"
              label="Shop domain"
              details="example.myshopify.com"
              value={shop}
              onChange={(e: any) => setShop(e.currentTarget.value)}
              autocomplete="on"
              error={errors?.shop}
            ></s-text-field>
            <s-button type="submit">Log in</s-button>
          </s-section>
        </Form>
      </s-page>
    </AppProvider>
  );
}
