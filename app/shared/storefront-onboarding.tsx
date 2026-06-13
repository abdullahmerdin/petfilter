import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  ProgressBar,
  Icon,
  Badge,
  List,
  Banner,
} from "@shopify/polaris";
import {
  MagicIcon,
  AppsIcon,
  SettingsIcon,
  PlusCircleIcon,
  CheckCircleIcon,
} from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";

interface StepData {
  step: number;
  title: string;
  description: string;
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
}

function StepCard({ step, title, description, IconComponent, children, isActive, isCompleted }: StepData) {
  return (
    <div
      style={{
        opacity: isActive ? 1 : isCompleted ? 0.7 : 0.4,
        transition: "opacity 0.3s ease",
      }}
    >
      <Card roundedAbove="sm" padding="400">
        <BlockStack gap="300">
          <InlineStack gap="200" blockAlign="center">
            <div
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--p-border-radius-200)",
                background: isCompleted
                  ? "var(--p-color-bg-fill-success)"
                  : isActive
                  ? "var(--p-color-bg-fill-brand)"
                  : "var(--p-color-bg-surface-secondary)",
                color: "var(--p-color-text-on-color)",
                flexShrink: 0,
              }}
            >
              {isCompleted ? (
                <CheckCircleIcon width={20} height={20} />
              ) : (
                <IconComponent width={20} height={20} />
              )}
            </div>
            <BlockStack gap="0">
              <InlineStack gap="200" blockAlign="center">
                {isActive ? (
                  <Badge tone="attention">{`Step ${String(step)}`}</Badge>
                ) : (
                  <Text as="span" variant="bodySm" tone="subdued">Step {String(step)}</Text>
                )}
                {isCompleted && (
                  <Badge tone="success">Done</Badge>
                )}
              </InlineStack>
              <Text as="h3" variant="headingSm" fontWeight="semibold">
                {title}
              </Text>
            </BlockStack>
          </InlineStack>

          <Text as="p" variant="bodyMd" tone="subdued">
            {description}
          </Text>

          {isActive && <div style={{ paddingTop: "0.5rem" }}>{children}</div>}
        </BlockStack>
      </Card>
    </div>
  );
}

interface StorefrontOnboardingProps {
  onComplete: () => void;
}

export default function StorefrontOnboarding({ onComplete }: StorefrontOnboardingProps) {
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = 4;
  const progress = (completedSteps.size / totalSteps) * 100;

  const markStepComplete = useCallback(
    (step: number) => {
      const next = new Set(completedSteps);
      next.add(step);
      setCompletedSteps(next);

      if (step < totalSteps - 1) {
        setCurrentStep(step + 1);
      } else {
        // All done — trigger completion
        onComplete();
      }
    },
    [completedSteps, onComplete]
  );

  const handleGoToSettings = useCallback(() => {
    shopify.toast.show("Configure your badge colors, then come back to continue.");
    navigate("/app/settings");
  }, [navigate, shopify]);

  const handleGoToProducts = useCallback(() => {
    shopify.toast.show("Add a pet profile to a product, then come back to continue.");
    navigate("/app/products");
  }, [navigate, shopify]);

  const steps: Omit<StepData, "isActive" | "isCompleted" | "children" | "step">[] = [
    {
      IconComponent: MagicIcon,
      title: "Install Theme Extension",
      description:
        "Install the pet-filter-theme extension so compatibility badges appear on your product pages.",
    },
    {
      IconComponent: AppsIcon,
      title: "Enable App Embed",
      description:
        "Turn on the Pet Creation app embed so customers can add their own pet profiles on the storefront.",
    },
    {
      IconComponent: SettingsIcon,
      title: "Configure Badge & Button Colors",
      description:
        "Choose badge and button colors that match your store's branding. Deep link to Settings to customize.",
    },
    {
      IconComponent: PlusCircleIcon,
      title: "Add Your First Pet Profile",
      description:
        "Add a pet profile to one of your products and test the compatibility badge on your storefront.",
    },
  ];

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      <BlockStack gap="500">
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <Text as="h1" variant="headingXl" fontWeight="bold">
            🐾 Welcome to PetFilter!
          </Text>
          <div style={{ marginTop: "0.5rem" }}>
            <Text as="p" variant="bodyLg" tone="subdued">
              Let's get your storefront set up in {String(totalSteps)} quick steps.
            </Text>
          </div>
        </div>

        {/* Progress */}
        <Card roundedAbove="sm" padding="300">
          <BlockStack gap="200">
            <InlineStack gap="200" blockAlign="center" align="space-between">
              <Text as="span" variant="bodySm" fontWeight="medium">
                Setup Progress
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                {String(completedSteps.size)} of {String(totalSteps)} steps done
              </Text>
            </InlineStack>
            <ProgressBar
              progress={progress}
              size="small"
              tone={progress === 100 ? "success" : "primary"}
            />
          </BlockStack>
        </Card>

        {/* Steps */}
        {steps.map((step, i) => (
          <StepCard
            key={i}
            step={i + 1}
            title={step.title}
            description={step.description}
            IconComponent={step.IconComponent}
            isActive={currentStep === i && !completedSteps.has(i)}
            isCompleted={completedSteps.has(i)}
          >
            {i === 0 && (
              <BlockStack gap="300">
                <Banner tone="info">
                  <BlockStack gap="200">
                    <Text as="p" variant="bodyMd">
                      To install the theme extension:
                    </Text>
                    <List type="number">
                      <List.Item>
                        Go to <strong>Shopify Admin {"→"} Online Store {"→"} Themes</strong>
                      </List.Item>
                      <List.Item>
                        Click <strong>Customize</strong> on your current theme
                      </List.Item>
                      <List.Item>
                        In the Theme Editor sidebar, click <strong>App Embeds</strong>
                      </List.Item>
                      <List.Item>
                        Find <strong>pet-filter-theme</strong> and click <strong>Install</strong>
                      </List.Item>
                    </List>
                  </BlockStack>
                </Banner>
                <Button
                  variant="primary"
                  onClick={() => markStepComplete(0)}
                >
                  I've Installed It {"—"} Continue
                </Button>
              </BlockStack>
            )}

            {i === 1 && (
              <BlockStack gap="300">
                <Banner tone="info">
                  <BlockStack gap="200">
                    <Text as="p" variant="bodyMd">
                      To enable the app embed on your storefront:
                    </Text>
                    <List type="number">
                      <List.Item>
                        Stay in the <strong>Theme Editor</strong> (Customize)
                      </List.Item>
                      <List.Item>
                        Click <strong>App Embeds</strong> in the sidebar
                      </List.Item>
                      <List.Item>
                        Find <strong>Pet Creation</strong> and toggle it <strong>On</strong>
                      </List.Item>
                      <List.Item>
                        Click <strong>Save</strong> at the top of the editor
                      </List.Item>
                    </List>
                  </BlockStack>
                </Banner>
                <Button
                  variant="primary"
                  onClick={() => markStepComplete(1)}
                >
                  I've Enabled It {"—"} Continue
                </Button>
              </BlockStack>
            )}

            {i === 2 && (
              <BlockStack gap="300">
                <Banner tone="info">
                  <Text as="p" variant="bodyMd">
                    Head to the Settings page to pick your badge color, badge text,
                    and button label. You can also configure the floating pet creation
                    button color and animation.
                  </Text>
                </Banner>
                <InlineStack gap="200">
                  <Button
                    variant="primary"
                    onClick={handleGoToSettings}
                  >
                    Go to Settings
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => markStepComplete(2)}
                  >
                    I've Configured It {"—"} Continue
                  </Button>
                </InlineStack>
              </BlockStack>
            )}

            {i === 3 && (
              <BlockStack gap="300">
                <Banner tone="info">
                  <Text as="p" variant="bodyMd">
                    Go to Products and add a pet profile to any product in your store.
                    Set pet type, breed, size, and more. Then visit your storefront to
                    see the compatibility badge in action!
                  </Text>
                </Banner>
                <InlineStack gap="200">
                  <Button
                    variant="primary"
                    onClick={handleGoToProducts}
                  >
                    Go to Products
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => markStepComplete(3)}
                  >
                    I've Added a Pet {"—"} Finish
                  </Button>
                </InlineStack>
              </BlockStack>
            )}
          </StepCard>
        ))}

        {/* Completion banner */}
        {progress === 100 && (
          <Banner tone="success">
            <Text as="p" variant="bodyMd" fontWeight="medium">
              🎉 All done! Redirecting to your dashboard{"…"}
            </Text>
          </Banner>
        )}
      </BlockStack>
    </div>
  );
}
