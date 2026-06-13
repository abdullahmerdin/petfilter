import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getSettings } from "../modules/settings";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const settings = await getSettings(session.shop);

  return new Response(JSON.stringify({
    petButtonEnabled: settings.petButtonEnabled,
    petButtonColor: settings.petButtonColor,
    petButtonAnimation: settings.petButtonAnimation,
    petButtonPosition: settings.petButtonPosition,
    petButtonBottomOffset: settings.petButtonBottomOffset,
  }), {
    headers: { "Content-Type": "application/json" },
  });
};
