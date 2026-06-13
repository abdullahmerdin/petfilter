import { useEffect, useMemo, useRef, useState } from "react";
import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData, useNavigation, useRouteError, useSearchParams } from "react-router";
import type { FilterRule } from "@prisma/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { listRulesPaginated, createRule, updateRule, deleteRule, batchDeleteRules } from "../modules/filter-rules";
import { RulesSkeleton } from "../shared/rules.skeleton";
import { Page, Card, Button, Text, Badge, BlockStack, InlineStack, TextField, Select, DataTable } from "@shopify/polaris";
import { InfoButton } from "../shared/info-button";
import { useContextualSaveBar, fieldChanged } from "../shared/use-contextual-save-bar";

const PAGE_SIZE = 20;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * PAGE_SIZE;
  return listRulesPaginated(session.shop, skip, PAGE_SIZE);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const fd = await request.formData();
  const intent = fd.get("intent") as string;
  const pick = (k: string) => { const v = fd.get(k); return v && v !== "" ? v : undefined; };
  const pickNum = (k: string) => { const v = fd.get(k); return v && v !== "" ? parseFloat(v as string) : undefined; };
  if (intent === "create") {
    await createRule(shop, { name: fd.get("name"), description: pick("description"), petType: pick("petType"),
      breedFilter: pick("breedFilter"), sizeFilter: pick("sizeFilter"), ageFilter: pick("ageFilter"),
      dietFilter: pick("dietFilter"), temperamentFilter: pick("temperamentFilter"), colorFilter: pick("colorFilter"),
      weightMin: pickNum("weightMin"), weightMax: pickNum("weightMax"),
      vaccinated: pick("vaccinated") === "true" ? true : pick("vaccinated") === "false" ? false : undefined,
      neutered: pick("neutered") === "true" ? true : pick("neutered") === "false" ? false : undefined,
      isActive: fd.get("isActive") !== "false" });
    return { success: true, intent: "create" };
  }
  if (intent === "update") {
    await updateRule(shop, fd.get("id") as string, { name: fd.get("name") as string, description: pick("description"),
      petType: pick("petType"), breedFilter: pick("breedFilter"), sizeFilter: pick("sizeFilter"),
      ageFilter: pick("ageFilter"), dietFilter: pick("dietFilter"), temperamentFilter: pick("temperamentFilter"),
      colorFilter: pick("colorFilter"), weightMin: pickNum("weightMin"), weightMax: pickNum("weightMax"),
      vaccinated: pick("vaccinated") === "true" ? true : pick("vaccinated") === "false" ? false : null,
      neutered: pick("neutered") === "true" ? true : pick("neutered") === "false" ? false : null,
      isActive: fd.get("isActive") !== "false" });
    return { success: true, intent: "update" };
  }
  if (intent === "delete") { await deleteRule(shop, fd.get("id") as string); return { success: true, intent: "delete" }; }
  if (intent === "batch-delete") { await batchDeleteRules(shop, JSON.parse(fd.get("ids") as string)); return { success: true, intent: "batch-delete" }; }
  return { success: false };
};

export default function FilterRules() {
  const navigation = useNavigation();
  if (navigation.state === 'loading') {
    return <RulesSkeleton />;
  }
  const { rules, total, hasNext, skip } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [selIds, setSelIds] = useState<string[]>([]);
  const [openField, setOpenField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fieldInfo: Record<string, string> = {
    name: "A descriptive name for this filter rule (e.g. 'Small Apartment Dogs').",
    description: "Optional notes about what this rule matches.",
    petType: "Filter products by pet type — Dog, Cat, Bird, Fish, or Small Pet.",
    breedFilter: "Filter by a specific breed name (e.g. Labrador, Persian).",
    sizeFilter: "Filter by pet size — Small, Medium, or Large.",
    ageFilter: "Filter by age group — Baby, Adult, or Senior.",
    dietFilter: "Filter by dietary needs keywords (e.g. grain-free).",
    temperamentFilter: "Filter by temperament — Calm, Friendly, or Energetic.",
    colorFilter: "Filter by coat/fur color (e.g. golden, black, white).",
    weightMin: "Minimum weight in kg for this filter.",
    weightMax: "Maximum weight in kg for this filter.",
    vaccinated: "Filter by vaccination status.",
    neutered: "Filter by neuter status.",
    isActive: "Toggle this rule on or off without deleting it.",
  };

  const currentPage = Math.floor(skip / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    if (!fetcher.data?.success) return;
    if (fetcher.data.intent === "create") { setShowCreate(false); shopify.toast.show("Rule created"); }
    else if (fetcher.data.intent === "update") { setEditId(null); shopify.toast.show("Rule updated"); }
    else if (fetcher.data.intent === "delete") { shopify.toast.show("Rule deleted"); }
    else if (fetcher.data.intent === "batch-delete") { setSelIds([]); shopify.toast.show("Rules deleted"); }
  }, [fetcher.data, shopify]);

  const editRule = editId ? rules.find(r => r.id === editId) : null;

  const ruleRows = rules.map((r: FilterRule) => [
    <input
      key={`cb-${r.id}`}
      type='checkbox'
      checked={selIds.includes(r.id)}
      onChange={(e) => {
        if (e.target.checked) setSelIds([...selIds, r.id]);
        else setSelIds(selIds.filter(i => i !== r.id));
      }}
      style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
    />,
    <span
      key={`name-${r.id}`}
      onClick={() => { setEditId(r.id); setShowCreate(false); }}
      style={{ color: 'var(--p-color-text-brand)', cursor: 'pointer', fontWeight: 500 }}
    >
      {r.name}
    </span>,
    r.petType || "Any",
    r.sizeFilter || "Any",
    r.isActive ? (
      <Badge key={`status-${r.id}`} tone="success">Active</Badge>
    ) : (
      <Badge key={`status-${r.id}`} tone="default">Inactive</Badge>
    ),
  ]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return ruleRows;
    const q = searchQuery.toLowerCase();
    return ruleRows.filter((row: any) => {
      const name = row[1]?.props?.children || "";
      const petType = row[2] || "";
      const size = row[3] || "";
      const status = row[4]?.props?.children || "";
      return (
        String(name).toLowerCase().includes(q) ||
        String(petType).toLowerCase().includes(q) ||
        String(size).toLowerCase().includes(q) ||
        String(status).toLowerCase().includes(q)
      );
    });
  }, [ruleRows, searchQuery]);

  function goPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setSearchParams({ page: String(page) });
    setEditId(null);
    setShowCreate(false);
  }

  function RuleForm({rule}: {rule?: FilterRule}) {
    const shopify = useAppBridge();
    const formRef = useRef<HTMLFormElement>(null);

    const [formName, setFormName] = useState(rule?.name || "");
    const [formDesc, setFormDesc] = useState(rule?.description || "");
    const [formPetType, setFormPetType] = useState(rule?.petType || "");
    const [formBreed, setFormBreed] = useState(rule?.breedFilter || "");
    const [formSize, setFormSize] = useState(rule?.sizeFilter || "");
    const [formAge, setFormAge] = useState(rule?.ageFilter || "");
    const [formDiet, setFormDiet] = useState(rule?.dietFilter || "");
    const [formTemp, setFormTemp] = useState(rule?.temperamentFilter || "");
    const [formColor, setFormColor] = useState(rule?.colorFilter || "");
    const [formWeightMin, setFormWeightMin] = useState(rule?.weightMin?.toString() || "");
    const [formWeightMax, setFormWeightMax] = useState(rule?.weightMax?.toString() || "");
    const [formVax, setFormVax] = useState(rule?.vaccinated === true);
    const [formNeut, setFormNeut] = useState(rule?.neutered === true);
    const [formActive, setFormActive] = useState(rule?.isActive !== false);

    const petTypeOptions = [
      {label: 'Any', value: ''},
      {label: 'Dog', value: 'dog'},
      {label: 'Cat', value: 'cat'},
      {label: 'Bird', value: 'bird'},
      {label: 'Fish', value: 'fish'},
      {label: 'Small Pet', value: 'small_pet'},
    ];
    const sizeOptions = [
      {label: 'Any', value: ''},
      {label: 'Small', value: 'small'},
      {label: 'Medium', value: 'medium'},
      {label: 'Large', value: 'large'},
    ];
    const ageOptions = [
      {label: 'Any', value: ''},
      {label: 'Baby', value: 'baby'},
      {label: 'Adult', value: 'adult'},
      {label: 'Senior', value: 'senior'},
    ];

    // Dirty detection
    const isDirty = rule
      ? (
          fieldChanged(formName, rule.name) ||
          fieldChanged(formDesc, rule.description) ||
          fieldChanged(formPetType, rule.petType) ||
          fieldChanged(formBreed, rule.breedFilter) ||
          fieldChanged(formSize, rule.sizeFilter) ||
          fieldChanged(formAge, rule.ageFilter) ||
          fieldChanged(formDiet, rule.dietFilter) ||
          fieldChanged(formTemp, rule.temperamentFilter) ||
          fieldChanged(formColor, rule.colorFilter) ||
          fieldChanged(formWeightMin, rule.weightMin?.toString()) ||
          fieldChanged(formWeightMax, rule.weightMax?.toString()) ||
          fieldChanged(formVax, rule.vaccinated) ||
          fieldChanged(formNeut, rule.neutered) ||
          fieldChanged(formActive, rule.isActive)
        )
      : (
          // Create mode: dirty when any field has a meaningful value
          formName !== "" ||
          formDesc !== "" ||
          formPetType !== "" ||
          formBreed !== "" ||
          formSize !== "" ||
          formAge !== "" ||
          formDiet !== "" ||
          formTemp !== "" ||
          formColor !== "" ||
          formWeightMin !== "" ||
          formWeightMax !== "" ||
          formVax !== false ||
          formNeut !== false
        );

    function handleSave() {
      formRef.current?.requestSubmit();
    }

    function handleDiscard() {
      if (rule) {
        setFormName(rule.name || "");
        setFormDesc(rule.description || "");
        setFormPetType(rule.petType || "");
        setFormBreed(rule.breedFilter || "");
        setFormSize(rule.sizeFilter || "");
        setFormAge(rule.ageFilter || "");
        setFormDiet(rule.dietFilter || "");
        setFormTemp(rule.temperamentFilter || "");
        setFormColor(rule.colorFilter || "");
        setFormWeightMin(rule.weightMin?.toString() || "");
        setFormWeightMax(rule.weightMax?.toString() || "");
        setFormVax(rule.vaccinated === true);
        setFormNeut(rule.neutered === true);
        setFormActive(rule.isActive !== false);
      } else {
        setFormName("");
        setFormDesc("");
        setFormPetType("");
        setFormBreed("");
        setFormSize("");
        setFormAge("");
        setFormDiet("");
        setFormTemp("");
        setFormColor("");
        setFormWeightMin("");
        setFormWeightMax("");
        setFormVax(false);
        setFormNeut(false);
        setFormActive(true); // default
      }
    }

    useContextualSaveBar(shopify, isDirty, handleSave, handleDiscard);

    return (
      <fetcher.Form method="POST" ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
        <input type="hidden" name="intent" value={rule?"update":"create"} />
        {rule && <input type="hidden" name="id" value={rule.id} />}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Rule Name</span>
            <InfoButton content={fieldInfo.name} />
          </div>
          <TextField label="Rule Name" labelHidden name="name" value={formName} onChange={setFormName} required autoComplete="off" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Description</span>
            <InfoButton content={fieldInfo.description} />
          </div>
          <TextField label="Description" labelHidden name="description" value={formDesc} onChange={setFormDesc} multiline={3} autoComplete="off" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Pet Type</span>
            <InfoButton content={fieldInfo.petType} />
          </div>
          <Select label="Pet Type" labelHidden name="petType" value={formPetType} onChange={setFormPetType} options={petTypeOptions} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Breed Filter</span>
            <InfoButton content={fieldInfo.breedFilter} />
          </div>
          <TextField label="Breed Filter" labelHidden name="breedFilter" value={formBreed} onChange={setFormBreed} autoComplete="off" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Size</span>
            <InfoButton content={fieldInfo.sizeFilter} />
          </div>
          <Select label="Size" labelHidden name="sizeFilter" value={formSize} onChange={setFormSize} options={sizeOptions} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Age</span>
            <InfoButton content={fieldInfo.ageFilter} />
          </div>
          <Select label="Age" labelHidden name="ageFilter" value={formAge} onChange={setFormAge} options={ageOptions} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Diet Filter</span>
            <InfoButton content={fieldInfo.dietFilter} />
          </div>
          <TextField label="Diet Filter" labelHidden name="dietFilter" value={formDiet} onChange={setFormDiet} autoComplete="off" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Temperament</span>
            <InfoButton content={fieldInfo.temperamentFilter} />
          </div>
          <TextField label="Temperament" labelHidden name="temperamentFilter" value={formTemp} onChange={setFormTemp} autoComplete="off" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Color</span>
            <InfoButton content={fieldInfo.colorFilter} />
          </div>
          <TextField label="Color" labelHidden name="colorFilter" value={formColor} onChange={setFormColor} autoComplete="off" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Min Weight (kg)</span>
            <InfoButton content={fieldInfo.weightMin} />
          </div>
          <TextField label="Min Weight" labelHidden name="weightMin" type="number" value={formWeightMin} onChange={setFormWeightMin} autoComplete="off" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Max Weight (kg)</span>
            <InfoButton content={fieldInfo.weightMax} />
          </div>
          <TextField label="Max Weight" labelHidden name="weightMax" type="number" value={formWeightMax} onChange={setFormWeightMax} autoComplete="off" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Vaccinated</span>
            <InfoButton content={fieldInfo.vaccinated} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type='checkbox' name="vaccinated" value="true" checked={formVax} onChange={(e) => setFormVax(e.target.checked)} />
            Vaccinated
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Neutered</span>
            <InfoButton content={fieldInfo.neutered} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type='checkbox' name="neutered" value="true" checked={formNeut} onChange={(e) => setFormNeut(e.target.checked)} />
            Neutered
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem" }}>
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Active</span>
            <InfoButton content={fieldInfo.isActive} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type='checkbox' name="isActive" value="true" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
            Active
          </label>
        </div>
      </fetcher.Form>
    );
  }

  return (
    <Page title="Filter Rules">
      <BlockStack gap="400">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={()=>{setShowCreate(!showCreate);setEditId(null)}}>
            {showCreate ? "Cancel" : "New Rule"}
          </Button>
        </div>

        {selIds.length>0 && (
          <div>
            <fetcher.Form method="POST" style={{ display: 'inline' }}>
              <input type="hidden" name="intent" value="batch-delete" />
              <input type="hidden" name="ids" value={JSON.stringify(selIds)} />
              <Button submit variant="primary" tone="critical" disabled={fetcher.state==="submitting"} loading={fetcher.state==="submitting"}>
                {fetcher.state==="submitting" ? "Deleting..." : `Delete Selected (${selIds.length})`}
              </Button>
            </fetcher.Form>
          </div>
        )}

        {showCreate && (
          <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">New Filter Rule</Text>
            <RuleForm />
          </Card>
        )}

        {editId && editRule && (
          <Card roundedAbove="sm">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingSm">Edit: {editRule.name}</Text>
              <Button onClick={()=>setEditId(null)}>Back</Button>
            </InlineStack>
            <RuleForm rule={editRule} />
            <div style={{ marginTop: '1rem' }}>
              <fetcher.Form method="POST">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={editId} />
                <Button submit variant="primary" tone="critical">Delete Rule</Button>
              </fetcher.Form>
            </div>
          </Card>
        )}

        <div>
          <InlineStack gap="100" blockAlign="center">
                      <Text as="h3" variant="headingSm">All Rules</Text>
              <InfoButton content="All filter rules you've created. Rules define criteria for matching pet products. Click a rule name to edit, or use checkboxes for batch operations." />
          </InlineStack>
          <Card roundedAbove="sm">
            {rules.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--p-color-text-subdued)' }}>
                No rules found. Click "New Rule" to create one.
              </div>
            ) : (
              <>
                <div style={{ paddingBottom: "0.75rem" }}>
                  <TextField
                    label="Search rules"
                    labelHidden
                    placeholder="Search by name, pet type, size, or status…"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    autoComplete="off"
                    clearButton
                    onClearButtonClick={() => setSearchQuery("")}
                  />
                </div>
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text', 'text']}
                  headings={['', 'Name', 'Pet Type', 'Size', 'Status']}
                  rows={filteredRows}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem" }}>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Page {currentPage} of {totalPages} ({total} total)
                  </Text>
                  <InlineStack gap="200">
                    <Button onClick={() => goPage(currentPage - 1)} disabled={currentPage <= 1}>Previous</Button>
                    <Button onClick={() => goPage(currentPage + 1)} disabled={!hasNext}>Next</Button>
                  </InlineStack>
                </div>
              </>
            )}
          </Card>
        </div>
      </BlockStack>
    </Page>
  );
}
export function ErrorBoundary() { return boundary.error(useRouteError()); }
export const headers: HeadersFunction = (h) => boundary.headers(h);
