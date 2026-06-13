import { useMemo, useState } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteError, useNavigation } from "react-router";
import type { PetProfile, FilterRule } from "@prisma/client";
import { MatchingSkeleton } from "../shared/matching.skeleton";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { listRules } from "../modules/filter-rules";
import { listPets } from "../modules/pets";
import { findCompatiblePets } from "../modules/matching/matching";
import { Page, Card, Button, Text, Select, Badge, BlockStack, InlineStack, DataTable, TextField } from "@shopify/polaris";
import { InfoButton } from "../shared/info-button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const [rules, petsData] = await Promise.all([listRules(session.shop), listPets(admin, session.shop)]);
  const { products, profiles } = petsData;
  return { rules, profiles, products };
};

export default function Matching() {
  const { rules, profiles, products } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  if (navigation.state === 'loading') {
    return <MatchingSkeleton />;
  }
  const [ruleId, setRuleId] = useState("");
  const [minScore, setMinScore] = useState(1);
  const [results, setResults] = useState<Array<{profile: PetProfile; score: number; matchedCriteria: string[]}>|null>(null);
  const rule = rules.find((r: FilterRule) => r.id === ruleId);

  const productTitleMap = new Map(
    ((products?.edges || []) as Array<{ node: { id: string; title: string } }>).map((e) => [e.node.id, e.node.title])
  );

  function run() {
    if (!rule) return;
    setResults(findCompatiblePets(profiles, rule, minScore));
  }

  const ruleOptions = [
    { label: "Select a rule...", value: "" },
    ...rules.map((r: any) => ({ label: r.name, value: r.id })),
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const resultRows = results?.map((r, idx) => [
    <span key={`title-${idx}`} style={{ fontWeight: 500 }}>{productTitleMap.get(r.profile.productId) || r.profile.productId.split("/").pop()}</span>,
    r.profile.petType || "-",
    r.profile.breed || "-",
    <Badge key={idx} tone="success">{r.score}</Badge>,
    <InlineStack key={`criteria-${idx}`} gap="100" wrap={true}>
      {r.matchedCriteria.map((c, ci) => (
        <Badge key={ci} tone="default">{c}</Badge>
      ))}
    </InlineStack>,
  ]) || [];

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return resultRows;
    const q = searchQuery.toLowerCase();
    return resultRows.filter((row: any) => {
      const product = row[0]?.props?.children || "";
      const petType = row[1] || "";
      const breed = row[2] || "";
      const score = row[3]?.props?.children || "";
      return (
        String(product).toLowerCase().includes(q) ||
        String(petType).toLowerCase().includes(q) ||
        String(breed).toLowerCase().includes(q) ||
        String(score).toLowerCase().includes(q)
      );
    });
  }, [resultRows, searchQuery]);

  return (
    <Page title="Matching">
      <BlockStack gap="400">
        <Card roundedAbove="sm">
          <InlineStack gap="100" blockAlign="center">
            <Text as="h2" variant="headingSm">Configure Matching</Text>
            <InfoButton content="Select a filter rule and minimum match count to find compatible pet products. Each matching attribute gives 1 point." />
          </InlineStack>
          <BlockStack gap="300">
            <Select
              label="Filter Rule"
              options={ruleOptions}
              value={ruleId}
              onChange={(v) => { setRuleId(v); setResults(null); }}
            />
            <div>
              <Text as="label" variant="bodyMd" fontWeight="medium">Minimum Score</Text>
              <input
                type="number"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value) || 10)}
                style={{
                  border: "1px solid var(--p-color-input-border)",
                  borderRadius: "var(--p-border-radius-200)",
                  padding: "0.5rem 0.75rem",
                  width: "100%",
                  boxSizing: "border-box",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              />
              <Text as="p" variant="bodySm" tone="subdued">Minimum number of matching attributes</Text>
            </div>
            <Button onClick={run} disabled={!rule}>
              Run Matching
            </Button>
          </BlockStack>
        </Card>

        <Card roundedAbove="sm">
          <InlineStack gap="100" blockAlign="center">
            <Text as="h2" variant="headingSm">Results ({results?.length || 0} compatible pets)</Text>
            <InfoButton content="Products that match the selected filter rule, sorted by match count. Each matching attribute earns 1 point." />
          </InlineStack>
          {results === null ? null : results.length === 0 ? (
            <BlockStack gap="200" inlineAlign="center" padding="400">
              <Text as="h3" variant="headingMd">No matches found</Text>
              <Text as="p" variant="bodyMd" tone="subdued">Try lowering the minimum score or adjusting filters.</Text>
            </BlockStack>
          ) : (
            <>
              <div style={{ paddingBottom: "0.75rem" }}>
                <TextField
                  label="Search results"
                  labelHidden
                  placeholder="Search by product, pet type, breed, or score…"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => setSearchQuery("")}
                />
              </div>
              <DataTable
              columnContentTypes={['text', 'text', 'text', 'text', 'text']}
              headings={['Product', 'Pet Type', 'Breed', 'Score', 'Matched Criteria']}
              rows={filteredRows}
            />
            </>
          )}
        </Card>
      </BlockStack>
    </Page>
  );
}

export function ErrorBoundary() { return boundary.error(useRouteError()); }
export const headers: HeadersFunction = (h) => boundary.headers(h);
