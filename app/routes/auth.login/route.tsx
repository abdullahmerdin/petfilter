import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

const breakoutResponse = (location: string) => new Response(
  `<html><body><script type="text/javascript">window.top.location.href = ${JSON.stringify(location)};</script></body></html>`,
  {
    headers: { "Content-Type": "text/html" },
  },
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isEmbedded = url.searchParams.get("embedded") === "1";

  try {
    const errors = loginErrorMessage(await login(request));
    return { errors, isEmbedded };
  } catch (response) {
    if (response instanceof Response && response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (location && isEmbedded) {
        return breakoutResponse(location);
      }
    }
    throw response;
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const isEmbedded = formData.get("isEmbedded") === "true";

  try {
    const errors = loginErrorMessage(await login(request));
    return {
      errors,
      isEmbedded
    };
  } catch (response) {
    if (response instanceof Response && response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (location && isEmbedded) {
        return breakoutResponse(location);
      }
    }
    throw response;
  }
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");

  // Use data from either action or loader, prioritizing action
  const errors = actionData?.errors || loaderData?.errors;
  const isEmbedded = actionData?.isEmbedded ?? loaderData?.isEmbedded;

  return (
    <AppProvider embedded={false}>
      <s-page>
        <Form method="post">
        <input type="hidden" name="isEmbedded" value={String(isEmbedded)} />
        <s-section heading="Log in">
          <s-text-field
            name="shop"
            label="Shop domain"
            details="example.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.currentTarget.value)}
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
