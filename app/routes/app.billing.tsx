import { useEffect } from "react";
import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData, useNavigation, useRouteError } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { checkSubscription, startTrial, getBillingUrl } from "../modules/billing";
import {
  Page, Card, Button, Text, Badge, ProgressBar, BlockStack, InlineStack,
  Layout, List, Spinner, Icon,
} from "@shopify/polaris";
import {
  StarFilledIcon,
  BillFilledIcon,
  GiftCardIcon,
} from "@shopify/polaris-icons";
import { InfoButton } from "../shared/info-button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const success = url.searchParams.get("success");
  const error = url.searchParams.get("error");
  return { subscription: await checkSubscription(session.shop), success, error };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const intent = (await request.formData()).get("intent") as string;
  if (intent === "start-trial") { await startTrial(session.shop); return { success: true, intent: "trial" }; }
  if (intent === "upgrade") { const confirmationUrl = await getBillingUrl(admin, session.shop, new URL(request.url).origin); return { success: true, intent: "redirect", confirmationUrl }; }
  return { success: false };
};

export default function Billing() {
  const { subscription, success, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  if (navigation.state === 'loading') {
    return (
      <Page title="Billing & Plan">
        <BlockStack gap="400">
          <Card roundedAbove="sm">
            <BlockStack gap="300">
              <Spinner size="large" />
            </BlockStack>
          </Card>
        </BlockStack>
      </Page>
    );
  }
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  useEffect(() => {
    if (success === "pro_activated") { shopify.toast.show("Welcome to PetFilter Pro! 🎉"); window.history.replaceState(null, "", "/app/billing"); }
  }, [success, shopify]);
  useEffect(() => { if (error) shopify.toast.show(`Error: ${error}`); }, [error, shopify]);
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.intent === "trial") shopify.toast.show("14-day trial started!");
  }, [fetcher.data, shopify]);
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.intent === "redirect" && fetcher.data.confirmationUrl)
      window.top.location.href = fetcher.data.confirmationUrl;
  }, [fetcher.data]);

  const trialProgress = subscription?.isTrialing
    ? Math.max(0, Math.min(100, ((14 - (subscription.daysLeft || 14)) / 14) * 100))
    : 0;

  const isSubmitting = fetcher.state !== "idle";

  return (
    <Page title="Billing & Plan">
      <Layout>
        <Layout.Section>
          <Card roundedAbove="sm">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <Icon source={subscription.isSubscribed ? StarFilledIcon : BillFilledIcon} tone="base" />
              <div style={{ flex: 1, textAlign: "center" }}>
                <Text as="h2" variant="headingSm">Current Plan</Text>
              </div>
              <InfoButton content="Your current subscription plan and status. Upgrade to Pro for unlimited features." />
            </div>
            <div style={{ marginTop: "1rem" }}>
              {subscription.isSubscribed ? (
                <BlockStack gap="200">
                  <Text as="h3" variant="headingLg">PetFilter Pro</Text>
                  <Text as="p" variant="bodyMd">You are on the Pro plan with full access to all features.</Text>
                  <Badge tone="success">Active</Badge>
                </BlockStack>
              ) : subscription.isTrialing ? (
                <BlockStack gap="200">
                  <Text as="h3" variant="headingLg">Trial — {subscription.daysLeft} days left</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Your 14-day free trial ends soon. Upgrade to keep access.
                  </Text>
                  <ProgressBar progress={trialProgress} tone="highlight" />
                  <div style={{ paddingTop: '0.5rem' }} />
                  <fetcher.Form method="POST">
                    <input type="hidden" name="intent" value="upgrade" />
                    <Button submit variant="primary" disabled={isSubmitting} loading={isSubmitting}>
                      Upgrade to Pro — $9.99/mo
                    </Button>
                  </fetcher.Form>
                </BlockStack>
              ) : (
                <BlockStack gap="300" inlineAlign="center" padding="400">
                  <Text as="h3" variant="headingLg">Free Plan</Text>
                  <Text as="p" variant="bodyMd" tone="subdued" style={{ textAlign: "center" }}>
                    Start your 14-day free trial to explore all features.
                  </Text>
                  <InlineStack gap="300">
                    <fetcher.Form method="POST">
                      <input type="hidden" name="intent" value="start-trial" />
                      <Button submit variant="primary" disabled={isSubmitting} loading={isSubmitting}>
                        Start Free Trial
                      </Button>
                    </fetcher.Form>
                    <fetcher.Form method="POST">
                      <input type="hidden" name="intent" value="upgrade" />
                      <Button submit disabled={isSubmitting} loading={isSubmitting}>
                        Upgrade to Pro
                      </Button>
                    </fetcher.Form>
                  </InlineStack>
                </BlockStack>
              )}
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Card roundedAbove="sm">
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ color: "var(--p-color-icon-subdued)", marginBottom: "0.5rem" }}>
                  <Icon source={GiftCardIcon} tone="subdued" />
                </div>
                <Text as="h3" variant="headingSm" fontWeight="semibold">Free / Trial</Text>
              </div>
              <List type="bullet">
                <List.Item>Up to 50 pet profiles</List.Item>
                <List.Item>Basic filter rules (5 max)</List.Item>
                <List.Item>Storefront pet badges</List.Item>
              </List>
            </Card>
            <Card roundedAbove="sm" style={{ border: "2px solid var(--p-color-bg-fill-brand)" }}>
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ color: "var(--p-color-icon-brand)", marginBottom: "0.5rem" }}>
                  <Icon source={StarFilledIcon} tone="base" />
                </div>
                <Text as="h3" variant="headingSm" fontWeight="semibold">Pro — $9.99/mo</Text>
                <Badge tone="info">Recommended</Badge>
              </div>
              <List type="bullet">
                <List.Item>Unlimited pet profiles</List.Item>
                <List.Item>Unlimited filter rules</List.Item>
                <List.Item>Advanced matching engine</List.Item>
                <List.Item>Custom badge/button styling</List.Item>
                <List.Item>Batch operations</List.Item>
              </List>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() { return boundary.error(useRouteError()); }
export const headers: HeadersFunction = (h) => boundary.headers(h);
