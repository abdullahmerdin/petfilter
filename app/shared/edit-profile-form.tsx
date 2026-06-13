import { useEffect, useRef, useState } from "react";
import type { PetProfile } from "@prisma/client";
import type { FetcherWithComponents } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Card, Button, Text, BlockStack, InlineStack, TextField, Select } from "@shopify/polaris";
import { InfoButton } from "./info-button";
import { useContextualSaveBar, fieldChanged } from "./use-contextual-save-bar";

interface EditProfileFormProps {
  product: any;
  profile: PetProfile | null | undefined;
  fieldInfo: Record<string, string>;
  fetcher: FetcherWithComponents<any>;
  onDelete: () => void;
}

export function EditProfileForm({ product, profile, fieldInfo, fetcher, onDelete }: EditProfileFormProps) {
  const shopify = useAppBridge();
  const formRef = useRef<HTMLFormElement>(null);

  const [formPetType, setFormPetType] = useState(profile?.petType || "");
  const [formBreed, setFormBreed] = useState(profile?.breed || "");
  const [formSize, setFormSize] = useState(profile?.size || "");
  const [formAge, setFormAge] = useState(profile?.ageGroup || "");
  const [formDiet, setFormDiet] = useState(profile?.dietaryNeeds || "");
  const [formTemp, setFormTemp] = useState(profile?.temperament || "");
  const [formColor, setFormColor] = useState(profile?.color || "");
  const [formWeight, setFormWeight] = useState(profile?.weight || "");
  const [formVax, setFormVax] = useState(profile?.vaccinated === true);
  const [formNeut, setFormNeut] = useState(profile?.neutered === true);

  // Sync state when profile prop changes
  useEffect(() => {
    if (profile) {
      setFormPetType(profile.petType || "");
      setFormBreed(profile.breed || "");
      setFormSize(profile.size || "");
      setFormAge(profile.ageGroup || "");
      setFormDiet(profile.dietaryNeeds || "");
      setFormTemp(profile.temperament || "");
      setFormColor(profile.color || "");
      setFormWeight(profile.weight || "");
      setFormVax(profile.vaccinated === true);
      setFormNeut(profile.neutered === true);
    }
  }, [profile]);

  // Dirty detection — compare each field to the original profile
  const isDirty = profile
    ? (
        fieldChanged(formPetType, profile.petType) ||
        fieldChanged(formBreed, profile.breed) ||
        fieldChanged(formSize, profile.size) ||
        fieldChanged(formAge, profile.ageGroup) ||
        fieldChanged(formDiet, profile.dietaryNeeds) ||
        fieldChanged(formTemp, profile.temperament) ||
        fieldChanged(formColor, profile.color) ||
        fieldChanged(formWeight, profile.weight) ||
        fieldChanged(formVax, profile.vaccinated) ||
        fieldChanged(formNeut, profile.neutered)
      )
    : (
        // New profile: dirty if any field has a value
        formPetType !== "" ||
        formBreed !== "" ||
        formSize !== "" ||
        formAge !== "" ||
        formDiet !== "" ||
        formTemp !== "" ||
        formColor !== "" ||
        formWeight !== "" ||
        formVax !== false ||
        formNeut !== false
      );

  // Save action: submit the form via fetcher
  function handleSave() {
    formRef.current?.requestSubmit();
  }

  // Discard action: reset all fields to original profile values
  function handleDiscard() {
    if (profile) {
      setFormPetType(profile.petType || "");
      setFormBreed(profile.breed || "");
      setFormSize(profile.size || "");
      setFormAge(profile.ageGroup || "");
      setFormDiet(profile.dietaryNeeds || "");
      setFormTemp(profile.temperament || "");
      setFormColor(profile.color || "");
      setFormWeight(profile.weight || "");
      setFormVax(profile.vaccinated === true);
      setFormNeut(profile.neutered === true);
    } else {
      setFormPetType("");
      setFormBreed("");
      setFormSize("");
      setFormAge("");
      setFormDiet("");
      setFormTemp("");
      setFormColor("");
      setFormWeight("");
      setFormVax(false);
      setFormNeut(false);
    }
  }

  useContextualSaveBar(shopify, isDirty, handleSave, handleDiscard);

  return (
    <Card roundedAbove="sm">
      <InlineStack align="space-between" blockAlign="center">
        <Text as="h2" variant="headingSm">Edit: {product.title}</Text>
        <Button
          onClick={onDelete}
          variant="primary"
          tone="critical"
          disabled={fetcher.state === "submitting"}
          loading={fetcher.state === "submitting"}
        >
          {fetcher.state === "submitting" ? "Deleting..." : "Delete Profile"}
        </Button>
      </InlineStack>
      <fetcher.Form method="POST" ref={formRef}>
        <input type="hidden" name="intent" value="save" />
        <input type="hidden" name="productId" value={product.id} />
        <BlockStack gap="300">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Pet Type</span>
              <InfoButton content={fieldInfo.petType} />
            </div>
            <TextField
              label="Pet Type"
              labelHidden
              name="petType"
              value={formPetType}
              onChange={setFormPetType}
              placeholder="dog, cat, bird, fish, small_pet"
              autoComplete="off"
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Breed</span>
              <InfoButton content={fieldInfo.breed} />
            </div>
            <TextField
              label="Breed"
              labelHidden
              name="breed"
              value={formBreed}
              onChange={setFormBreed}
              autoComplete="off"
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Size</span>
              <InfoButton content={fieldInfo.size} />
            </div>
            <Select
              label="Size"
              labelHidden
              name="size"
              value={formSize}
              onChange={setFormSize}
              options={[
                {label: 'Select', value: ''},
                {label: 'Small', value: 'small'},
                {label: 'Medium', value: 'medium'},
                {label: 'Large', value: 'large'},
              ]}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Age Group</span>
              <InfoButton content={fieldInfo.ageGroup} />
            </div>
            <Select
              label="Age Group"
              labelHidden
              name="ageGroup"
              value={formAge}
              onChange={setFormAge}
              options={[
                {label: 'Select', value: ''},
                {label: 'Baby', value: 'baby'},
                {label: 'Adult', value: 'adult'},
                {label: 'Senior', value: 'senior'},
              ]}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Dietary Needs</span>
              <InfoButton content={fieldInfo.dietaryNeeds} />
            </div>
            <TextField
              label="Dietary Needs"
              labelHidden
              name="dietaryNeeds"
              value={formDiet}
              onChange={setFormDiet}
              autoComplete="off"
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Temperament</span>
              <InfoButton content={fieldInfo.temperament} />
            </div>
            <TextField
              label="Temperament"
              labelHidden
              name="temperament"
              value={formTemp}
              onChange={setFormTemp}
              placeholder="friendly, shy, energetic"
              autoComplete="off"
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Color</span>
              <InfoButton content={fieldInfo.color} />
            </div>
            <TextField
              label="Color"
              labelHidden
              name="color"
              value={formColor}
              onChange={setFormColor}
              autoComplete="off"
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Weight (kg)</span>
              <InfoButton content={fieldInfo.weight} />
            </div>
            <TextField
              label="Weight (kg)"
              labelHidden
              name="weight"
              type="number"
              value={formWeight}
              onChange={setFormWeight}
              autoComplete="off"
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Vaccinated</span>
              <InfoButton content={fieldInfo.vaccinated} />
            </div>
            <InlineStack gap="300">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="radio" name="vaccinated" value="true" checked={formVax === true} onChange={() => setFormVax(true)} /> Yes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="radio" name="vaccinated" value="false" checked={formVax === false} onChange={() => setFormVax(false)} /> No
              </label>
            </InlineStack>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Neutered</span>
              <InfoButton content={fieldInfo.neutered} />
            </div>
            <InlineStack gap="300">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="radio" name="neutered" value="true" checked={formNeut === true} onChange={() => setFormNeut(true)} /> Yes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="radio" name="neutered" value="false" checked={formNeut === false} onChange={() => setFormNeut(false)} /> No
              </label>
            </InlineStack>
          </div>
        </BlockStack>
      </fetcher.Form>
    </Card>
  );
}
