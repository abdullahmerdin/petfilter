import { useEffect, useRef, useState } from "react";
import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData, useNavigation, useRouteError } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { SettingsSkeleton } from "../shared/settings.skeleton";
import { getSettings, updateSettings } from "../modules/settings";
import { Card, Button, Text, BlockStack, TextField, Select, Checkbox, InlineStack, Icon, Page } from "@shopify/polaris";
import { ShippingLabelIcon, HeartIcon } from "@shopify/polaris-icons";
import { InfoButton } from "../shared/info-button";
import { useContextualSaveBar, fieldChanged } from "../shared/use-contextual-save-bar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return getSettings(session.shop);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const fd = await request.formData();
  await updateSettings(session.shop, {
    badgeEnabled: fd.get("badgeEnabled") === "true",
    badgeColor: fd.get("badgeColor") as string,
    badgeText: fd.get("badgeText") as string,
    buttonLabel: fd.get("buttonLabel") as string,
    petButtonEnabled: fd.get("petButtonEnabled") === "true",
    petButtonColor: fd.get("petButtonColor") as string,
    petButtonAnimation: fd.get("petButtonAnimation") as string,
    petButtonPosition: fd.get("petButtonPosition") as string,
    petButtonBottomOffset: parseInt(fd.get("petButtonBottomOffset") as string, 10) || 24,
  });
  return { success: true };
};

export default function Settings() {
  const settings = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  if (navigation.state === 'loading') {
    return <SettingsSkeleton />;
  }
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { if (fetcher.data?.success) shopify.toast.show("Settings saved"); }, [fetcher.data, shopify]);

  // Badge settings
  const [badgeEnabled, setBadgeEnabled] = useState(settings.badgeEnabled);
  const [badgeColor, setBadgeColor] = useState(settings.badgeColor);
  const [badgeText, setBadgeText] = useState(settings.badgeText || "");
  const [buttonLabel, setButtonLabel] = useState(settings.buttonLabel || "");

  // Pet button settings
  const [petButtonEnabled, setPetButtonEnabled] = useState(settings.petButtonEnabled);
  const [petButtonColor, setPetButtonColor] = useState(settings.petButtonColor);
  const [petButtonAnimation, setPetButtonAnimation] = useState(settings.petButtonAnimation);
  const [petButtonPosition, setPetButtonPosition] = useState(settings.petButtonPosition);
  const [petButtonBottomOffset, setPetButtonBottomOffset] = useState(settings.petButtonBottomOffset);

  // Dirty detection — compare all fields to loader data
  const isDirty =
    fieldChanged(badgeEnabled, settings.badgeEnabled) ||
    fieldChanged(badgeColor, settings.badgeColor) ||
    fieldChanged(badgeText, settings.badgeText) ||
    fieldChanged(buttonLabel, settings.buttonLabel) ||
    fieldChanged(petButtonEnabled, settings.petButtonEnabled) ||
    fieldChanged(petButtonColor, settings.petButtonColor) ||
    fieldChanged(petButtonAnimation, settings.petButtonAnimation) ||
    fieldChanged(petButtonPosition, settings.petButtonPosition) ||
    fieldChanged(petButtonBottomOffset, settings.petButtonBottomOffset);

  function handleSave() {
    formRef.current?.requestSubmit();
  }

  function handleDiscard() {
    setBadgeEnabled(settings.badgeEnabled);
    setBadgeColor(settings.badgeColor);
    setBadgeText(settings.badgeText || "");
    setButtonLabel(settings.buttonLabel || "");
    setPetButtonEnabled(settings.petButtonEnabled);
    setPetButtonColor(settings.petButtonColor);
    setPetButtonAnimation(settings.petButtonAnimation);
    setPetButtonPosition(settings.petButtonPosition);
    setPetButtonBottomOffset(settings.petButtonBottomOffset);
  }

  useContextualSaveBar(shopify, isDirty, handleSave, handleDiscard);

  return (
    <Page title="Settings">
      <fetcher.Form method="POST" ref={formRef}>
        <BlockStack gap="400">
          {/* Storefront Badge */}
          <Card roundedAbove="sm">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon source={ShippingLabelIcon} tone="base" />
              <div style={{ flex: 1, textAlign: "center" }}>
                <Text as="h2" variant="headingSm">Storefront Badge</Text>
              </div>
              <InfoButton content="Configure the pet compatibility badge shown on your storefront product pages." />
            </div>

            <BlockStack gap="300">
              <Checkbox
                label="Show pet badge on product pages"
                checked={badgeEnabled}
                onChange={(v) => setBadgeEnabled(v)}
                name="badgeEnabled"
                value="true"
              />

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Text as="label" variant="bodyMd" fontWeight="medium">Badge Color</Text>
                <input
                  type="color"
                  name="badgeColor"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  style={{
                    width: '40px', height: '32px', padding: 0,
                    border: '1px solid var(--p-color-input-border)',
                    borderRadius: 'var(--p-border-radius-200)',
                    cursor: 'pointer',
                  }}
                />
                <Text as="span" variant="bodySm" tone="subdued">{badgeColor}</Text>
              </div>

              <TextField
                label="Badge Text"
                name="badgeText"
                value={badgeText}
                onChange={(v) => setBadgeText(v)}
                helpText="Text displayed on the badge"
                autoComplete="off"
              />

              <TextField
                label="Button Label"
                name="buttonLabel"
                value={buttonLabel}
                onChange={(v) => setButtonLabel(v)}
                helpText="'Find Compatible Friends' button text"
                autoComplete="off"
              />
            </BlockStack>
          </Card>

          {/* Pet Creation Button */}
          <Card roundedAbove="sm">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon source={HeartIcon} tone="base" />
              <div style={{ flex: 1, textAlign: "center" }}>
                <Text as="h2" variant="headingSm">Pet Creation Button</Text>
              </div>
              <InfoButton content="Configure the floating pet creation button on your storefront. Customers can add and manage pet profiles." />
            </div>

            <BlockStack gap="300">
              <Checkbox
                label="Show floating pet creation button"
                checked={petButtonEnabled}
                onChange={(v) => setPetButtonEnabled(v)}
                name="petButtonEnabled"
                value="true"
              />

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Text as="label" variant="bodyMd" fontWeight="medium">Button Color</Text>
                <input
                  type="color"
                  name="petButtonColor"
                  value={petButtonColor}
                  onChange={(e) => setPetButtonColor(e.target.value)}
                  style={{
                    width: '40px', height: '32px', padding: 0,
                    border: '1px solid var(--p-color-input-border)',
                    borderRadius: 'var(--p-border-radius-200)',
                    cursor: 'pointer',
                  }}
                />
                <Text as="span" variant="bodySm" tone="subdued">{petButtonColor}</Text>
              </div>

              <Select
                label="Animation"
                name="petButtonAnimation"
                value={petButtonAnimation}
                onChange={(v) => setPetButtonAnimation(v)}
                options={[
                  { label: 'Pulse (default)', value: 'pulse' },
                  { label: 'Bounce', value: 'bounce' },
                  { label: 'Glow', value: 'glow' },
                  { label: 'None', value: 'none' },
                ]}
              />

              <Select
                label="Position"
                name="petButtonPosition"
                value={petButtonPosition}
                onChange={(v) => setPetButtonPosition(v)}
                options={[
                  { label: 'Bottom Right', value: 'right' },
                  { label: 'Bottom Left', value: 'left' },
                ]}
              />

              <TextField
                label="Bottom Offset (px)"
                name="petButtonBottomOffset"
                value={String(petButtonBottomOffset)}
                onChange={(v) => setPetButtonBottomOffset(parseInt(v, 10) || 24)}
                type="number"
                helpText="Distance from the bottom of the screen"
                autoComplete="off"
              />
            </BlockStack>
          </Card>
        </BlockStack>
      </fetcher.Form>
    </Page>
  );
}

export function ErrorBoundary() { return boundary.error(useRouteError()); }
export const headers: HeadersFunction = (h) => boundary.headers(h);
