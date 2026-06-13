import { useCallback } from "react";
import { Modal, Text, BlockStack } from "@shopify/polaris";
import { useFetcher } from "react-router";
import {
  CollectionIcon,
  FilterIcon,
  StarFilledIcon,
  SettingsIcon,
  BillFilledIcon,
} from "@shopify/polaris-icons";

interface WelcomeModalProps {
  open: boolean;
  onDismiss: () => void;
}

const steps = [
  {
    icon: CollectionIcon,
    title: "Products",
    description:
      "Add pet profiles to your products. Set pet type, breed, size, temperament, and more. Each product can have detailed pet information for accurate matching.",
  },
  {
    icon: FilterIcon,
    title: "Filter Rules",
    description:
      "Create rules to define which pets are compatible. Filter by species, size, age, temperament, dietary needs, and health status. Rules run automatically on your storefront.",
  },
  {
    icon: StarFilledIcon,
    title: "Matching Engine",
    description:
      "Test your rules against your pet profiles. See compatibility scores and which criteria matched. Perfect your filters before they go live on your store.",
  },
  {
    icon: SettingsIcon,
    title: "Settings",
    description:
      "Customize the 'Pet Friendly' badge and button that appears on your product pages. Choose colors and text that match your store's branding.",
  },
  {
    icon: BillFilledIcon,
    title: "Billing & Plans",
    description:
      "Start with a 14-day free trial. Upgrade to Pro for unlimited profiles, rules, and advanced matching features.",
  },
];

export default function WelcomeModal({ open, onDismiss }: WelcomeModalProps) {
  const fetcher = useFetcher();

  const handleDismiss = useCallback(() => {
    fetcher.submit({ intent: "dismiss-welcome" }, { method: "POST" });
    onDismiss();
  }, [fetcher, onDismiss]);

  return (
    <Modal
      open={open}
      onClose={handleDismiss}
      title="Welcome to PetFilter! 🐾"
      primaryAction={{
        content: "Let's Get Started",
        onAction: handleDismiss,
      }}
      large
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd" tone="subdued">
            PetFilter helps your customers find the perfect pet match. Here's a
            quick tour of what you can do:
          </Text>

          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem",
                borderRadius: "var(--p-border-radius-200)",
                background:
                  i % 2 === 0
                    ? "var(--p-color-bg-surface-secondary)"
                    : "transparent",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--p-border-radius-200)",
                  background: "var(--p-color-bg-fill-brand)",
                  color: "var(--p-color-text-on-color)",
                  flexShrink: 0,
                }}
              >
                <step.icon width={20} height={20} fill="white" />
              </div>
              <BlockStack gap="100">
                <Text as="h3" variant="headingSm" fontWeight="semibold">
                  {i + 1}. {step.title}
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  {step.description}
                </Text>
              </BlockStack>
            </div>
          ))}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
