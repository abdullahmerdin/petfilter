import { useCallback, useState } from "react";
import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useNavigation, useRouteError } from "react-router";
import type { PetProfile, FilterRule } from "@prisma/client";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getDashboardStats, getRecentPets, getRecentRules } from "../modules/dashboard";
import { updateSettings } from "../modules/settings";
import { DashboardSkeleton } from "../shared/dashboard.skeleton";
import WelcomeModal from "../shared/welcome-modal";
import {
  Page, Card, Text, Badge, BlockStack, InlineStack, DataTable, Button, Icon,
} from "@shopify/polaris";
import {
  CollectionIcon,
  FilterIcon,
  StarFilledIcon,
  BillFilledIcon,
} from "@shopify/polaris-icons";
import { InfoButton } from "../shared/info-button";

function StatCard({ value, label, subtitle, icon }: {
  value: string | number;
  label: string;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: "var(--p-border-radius-300)",
        border: "1px solid var(--p-color-border-subdued)",
        padding: "1.25rem 1.5rem",
        background: "var(--p-color-bg-surface)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--p-shadow-400)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ width: 24, height: 24, marginBottom: "0.75rem" }}>
        <Icon source={icon} />
      </div>
      <Text as="p" variant="heading2xl" fontWeight="bold">
        {value}
      </Text>
      <BlockStack gap="0">
        <Text as="span" variant="bodyMd" fontWeight="medium">
          {label}
        </Text>
        {subtitle && (
          <Text as="span" variant="bodySm" tone="subdued">
            {subtitle}
          </Text>
        )}
      </BlockStack>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const fd = await request.formData();
  if (fd.get("intent") === "dismiss-welcome") {
    await updateSettings(session.shop, { hasSeenWelcome: true });
  }
  return { success: true };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const [stats, recentPets, recentRules] = await Promise.all([
    getDashboardStats(shop), getRecentPets(shop), getRecentRules(shop),
  ]);

  // Redirect to onboarding if storefront setup isn't complete yet
  // If settings don't exist yet (brand new shop), treat as incomplete
  if (!stats.settings || stats.settings.hasCompletedOnboarding === false) {
    return redirect("/app/onboarding");
  }

  return { stats, recentPets, recentRules };
};

export default function Dashboard() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { stats, recentPets, recentRules } = useLoaderData<typeof loader>();
  const [welcomeOpen, setWelcomeOpen] = useState(
    stats.settings?.hasSeenWelcome === false
  );

  if (navigation.state === 'loading') {
    return <DashboardSkeleton />;
  }

  const planLabel = stats.settings?.billingPlan === "pro" ? "Pro"
    : stats.settings?.billingPlan === "trial" ? "Trial" : "Free";

  const planStatus = stats.settings?.billingPlan === "pro" ? "Active" : "Upgrade available";

  const recentPetRows = recentPets.map((p: PetProfile) => [
    p.productTitle || p.productId.split("/").pop() || p.productId,
    p.petType ? p.petType.charAt(0).toUpperCase() + p.petType.slice(1) : "—",
    p.breed || "—",
    p.size || "—",
  ]);

  const recentRuleRows = recentRules.map((r: FilterRule) => [
    r.name,
    r.petType ? r.petType.charAt(0).toUpperCase() + r.petType.slice(1) : "Any",
    <Badge key={r.id} tone={r.isActive ? "success" : "default"}>
      {r.isActive ? "Active" : "Inactive"}
    </Badge>,
  ]);

  return (
    <Page title="Dashboard">
      <WelcomeModal open={welcomeOpen} onDismiss={() => setWelcomeOpen(false)} />
      <BlockStack gap="400">
        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <StatCard
            value={stats.totalPets}
            label="Products"
            subtitle="products registered"
            icon={CollectionIcon}
          />
          <StatCard
            value={stats.totalRules}
            label="Filter Rules"
            subtitle={`${stats.activeRules} active`}
            icon={FilterIcon}
          />
          <StatCard
            value={stats.totalMatches}
            label="Matches"
            subtitle="all time"
            icon={StarFilledIcon}
          />
          <StatCard
            value={planLabel}
            label="Plan"
            subtitle={planStatus}
            icon={BillFilledIcon}
          />
        </div>

        {/* Quick Actions */}
        <Card roundedAbove="sm">
          <BlockStack gap="300">
            <InlineStack gap="100" blockAlign="center">
              <Text as="h2" variant="headingMd" fontWeight="semibold">Quick Actions</Text>
              <InfoButton content="Shortcuts to the most common tasks in PetFilter." />
            </InlineStack>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Button onClick={() => navigate("/app/products")} variant="secondary">Add Pet Profile</Button>
              <Button onClick={() => navigate("/app/rules")} variant="secondary">Create Filter Rule</Button>
              <Button onClick={() => navigate("/app/matching")} variant="secondary">Run Matching</Button>
              <Button onClick={() => navigate("/app/onboarding")} variant="primary">Storefront Setup Guide</Button>
              <Button onClick={() => setWelcomeOpen(true)} variant="secondary">Welcome Guide</Button>
            </div>
          </BlockStack>
        </Card>

        {/* Recent Pets */}
        <Card roundedAbove="sm">
          <InlineStack gap="200" blockAlign="center">
            <Text as="h2" variant="headingSm">Recent Profiles</Text>
            <InfoButton content="The most recently created pet profiles on your products. Click Products to manage them." />
          </InlineStack>
          {recentPets.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <Text as="p" variant="bodyMd" tone="subdued">
                No pets yet. Start by adding pet profiles to your products.
              </Text>
            </div>
          ) : (
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['Product', 'Type', 'Breed', 'Size']}
              rows={recentPetRows}
            />
          )}
        </Card>

        {/* Recent Rules */}
        <Card roundedAbove="sm">
          <InlineStack gap="200" blockAlign="center">
            <Text as="h2" variant="headingSm">Recent Rules</Text>
            <InfoButton content="Your most recently created or updated filter rules. Click Filter Rules to manage them." />
          </InlineStack>
          {recentRules.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <Text as="p" variant="bodyMd" tone="subdued">
                No rules yet. Create filter rules to start matching pets.
              </Text>
            </div>
          ) : (
            <DataTable
              columnContentTypes={['text', 'text', 'text']}
              headings={['Name', 'Pet Type', 'Status']}
              rows={recentRuleRows}
            />
          )}
        </Card>

        {/* Plan Status */}
        {stats.settings?.billingPlan !== "pro" && (
          <Card roundedAbove="sm">
            <InlineStack gap="300" blockAlign="center">
              <BlockStack gap="100">
                <Text as="h3" variant="headingSm">Upgrade to Pro</Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Unlock unlimited filter rules, advanced matching, and priority support.
                </Text>
              </BlockStack>
              <div style={{ marginLeft: "auto" }}>
                <Button onClick={() => navigate("/app/billing")} variant="primary">
                  Upgrade Now
                </Button>
              </div>
            </InlineStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}

export function ErrorBoundary() { return boundary.error(useRouteError()); }
export const headers: HeadersFunction = (h) => boundary.headers(h);
