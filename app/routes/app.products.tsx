import { useEffect, useRef, useMemo, useState } from "react";
import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData, useNavigation, useRouteError, useSearchParams } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { listPets, updatePetMetafields, savePetProfile, deletePetProfile } from "../modules/pets";
import { ProductsSkeleton } from "../shared/products.skeleton";
import { Page, Card, Button, Text, Badge, BlockStack, InlineStack, DataTable, TextField, Select, Banner } from "@shopify/polaris";
import { InfoButton } from "../shared/info-button";
import { EditProfileForm } from "../shared/edit-profile-form";
import { FREE_PET_LIMIT } from "../lib/plan-limits";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  return listPets(admin, session.shop, cursor);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "delete") {
    const pid = fd.get("productId") as string;
    await deletePetProfile(pid);
    return { success: true, intent: "delete" };
  }

  const pid = fd.get("productId") as string;
  const keys = ["petType","breed","size","ageGroup","dietaryNeeds","temperament","color","weight"];
  const data: any = {};
  for (const k of keys) data[k] = fd.get(k) as string;
  data.vaccinated = fd.get("vaccinated") === "true";
  data.neutered = fd.get("neutered") === "true";
  const mfs = [...keys.filter(k=>data[k]),"vaccinated","neutered"].filter(k=>data[k]!==undefined && data[k]!==null && data[k]!=="")
    .map(k => ({key: k.replace(/([A-Z])/g,"_$1").toLowerCase(), value: String(data[k])}));
  try {
    if (mfs.length > 0) await updatePetMetafields(admin, pid, mfs);
    await savePetProfile(shop, pid, data);
    return { success: true, intent: "save" };
  } catch (error: any) {
    if (error?.message?.includes("LIMIT_REACHED")) {
      return { error: "LIMIT_REACHED", message: "You have reached the free plan limit. Upgrade to Pro for unlimited pet profiles.", intent: "save" };
    }
    throw error;
  }
};

export default function Products() {
  const { products, profiles, hasNext, endCursor } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  if (navigation.state === 'loading') {
    return <ProductsSkeleton />;
  }
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const [selected, setSelected] = useState<string|null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const cursorStackRef = useRef<string[]>([]);
  const cursor = searchParams.get("cursor") || "";
  const [searchQuery, setSearchQuery] = useState("");

  const fieldInfo: Record<string, string> = {
    petType: "The type of pet this product is suitable for. Options: dog, cat, bird, fish, small_pet.",
    breed: "The specific breed this product is recommended for (e.g. Labrador, Persian, Beagle).",
    size: "What size category this product fits best — Small, Medium, or Large.",
    ageGroup: "Which life stage this product is designed for — Baby, Adult, or Senior.",
    dietaryNeeds: "Any specific dietary requirements this product addresses (e.g. grain-free, senior formula).",
    temperament: "The temperament this product works best with — Calm, Friendly, or Energetic.",
    color: "The coat/fur color this product matches (e.g. golden, black, white).",
    weight: "The recommended weight in kg for this product.",
    vaccinated: "Whether this product is specifically suitable for vaccinated pets.",
    neutered: "Whether this product is specifically suitable for neutered pets.",
  };

  // Track cursor history for back navigation
  useEffect(() => {
    if (cursor) {
      cursorStackRef.current.push(cursor);
    }
  }, []);

  useEffect(() => {
    if (fetcher.data?.error === "LIMIT_REACHED") {
      shopify.toast.show(fetcher.data.message || "Plan limit reached");
      return;
    }
    if (fetcher.data?.success && fetcher.data.intent === "save") {
      shopify.toast.show("Pet profile updated");
    }
    if (fetcher.data?.success && fetcher.data.intent === "delete") {
      shopify.toast.show("Pet profile deleted");
      setSelected(null);
    }
  }, [fetcher.data, shopify]);

  const profileMap = new Map(profiles.map(p => [p.productId, p]));
  const selProfile = selected ? profileMap.get(selected) : null;
  const selProduct = selected ? products?.edges?.find((e:any)=>e.node.id===selected)?.node : null;

  const productRows = (products?.edges || []).map((e: any) => {
    const p = e.node;
    const pr = profileMap.get(p.id);
    return [
      <button
        key={`title-${p.id}`}
        type="button"
        onClick={() => setSelected(p.id)}
        style={{
          background: "none",
          border: "none",
          color: "var(--p-color-text-brand)",
          textDecoration: "underline",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          padding: 0,
        }}
      >
        {p.title}
      </button>,
      pr?.petType ? (
        <Badge key={`type-${p.id}`} tone="default">{pr.petType}</Badge>
      ) : (
        <Text key={`no-type-${p.id}`} as="span" tone="subdued">-</Text>
      ),
      p.status === "ACTIVE" ? (
        <Badge key={`status-${p.id}`} tone="success">Active</Badge>
      ) : (
        <Badge key={`status-${p.id}`} tone="default">{p.status}</Badge>
      ),
    ];
  });

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return productRows;
    const q = searchQuery.toLowerCase();
    return productRows.filter((row: any) => {
      // row[0] = title button, row[1] = pet type badge, row[2] = status badge
      const title = row[0]?.props?.children || "";
      const petType = row[1]?.props?.children || "";
      const status = row[2]?.props?.children || "";
      return (
        String(title).toLowerCase().includes(q) ||
        String(petType).toLowerCase().includes(q) ||
        String(status).toLowerCase().includes(q)
      );
    });
  }, [productRows, searchQuery]);

  function goNext() {
    if (!endCursor) return;
    setSearchParams({ cursor: endCursor });
    setSelected(null);
  }

  function goPrev() {
    cursorStackRef.current.pop(); // Remove current
    const prev = cursorStackRef.current.pop() || ""; // Get previous
    if (prev) {
      setSearchParams({ cursor: prev });
    } else {
      setSearchParams({});
    }
    setSelected(null);
  }

  const pageNum = cursorStackRef.current.length || 1;
  const hasPrev = cursorStackRef.current.length > 0;

  return (
    <Page title="Pet Products">
      <BlockStack gap="400">
        <Card roundedAbove="sm">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="100" blockAlign="center">
                          <Text as="h2" variant="headingSm">All Products</Text>
              <InfoButton content="All products from your Shopify store. Click a product name to edit its pet profile. Products without a profile show '-' in the Pet Type column." />
            </InlineStack>
            <InlineStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">Page {pageNum}</Text>
            </InlineStack>
          </InlineStack>
          <div style={{ paddingBottom: "0.75rem" }}>
            <TextField
              label="Search products"
              labelHidden
              placeholder="Search by title, pet type, or status…"
              value={searchQuery}
              onChange={setSearchQuery}
              autoComplete="off"
              clearButton
              onClearButtonClick={() => setSearchQuery("")}
            />
          </div>
          <DataTable
            columnContentTypes={['text', 'text', 'text']}
            headings={['Title', 'Pet Type', 'Status']}
            rows={filteredRows}
          />
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem" }}>
            <Button onClick={goPrev} disabled={!hasPrev}>Previous</Button>
            <Button onClick={goNext} disabled={!hasNext}>Next</Button>
          </div>
        </Card>

        {profileMap.size > 40 && (
          <Banner tone="warning">
            <Text as="p">You have {profileMap.size} of {FREE_PET_LIMIT} pet profiles used. Upgrade to Pro for unlimited.</Text>
          </Banner>
        )}

        {selected && selProduct && (
          <EditProfileForm
            product={selProduct}
            profile={selProfile}
            fieldInfo={fieldInfo}
            fetcher={fetcher}
            onDelete={() => {
              const form = new FormData();
              form.append("intent", "delete");
              form.append("productId", selected);
              fetcher.submit(form, { method: "POST" });
            }}
          />
        )}
      </BlockStack>
    </Page>
  );
}
export function ErrorBoundary() { return boundary.error(useRouteError()); }
export const headers: HeadersFunction = (h) => boundary.headers(h);
