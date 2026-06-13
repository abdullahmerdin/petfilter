import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import {
  getCustomerPets,
  getActivePet,
  createPet,
  updatePet,
  deletePet,
  setActivePet,
  hasAgreed,
  agreeToTerms,
} from "../modules/storefront/pets.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "list";
  const customerId = url.searchParams.get("customerId") || "";
  const petId = url.searchParams.get("petId") || "";

  if (!customerId) {
    return json({ error: "Missing customerId" }, { status: 400 });
  }

  switch (action) {
    case "list":
      const pets = await getCustomerPets(session.shop, customerId);
      return json({ pets });

    case "active":
      const active = await getActivePet(session.shop, customerId);
      return json({ pet: active });

    case "check-agreement":
      const agreed = await hasAgreed(session.shop, customerId);
      return json({ agreed });

    default:
      return json({ error: "Unknown action" }, { status: 400 });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const fd = await request.formData();
  const actionType = fd.get("action") as string;
  const customerId = fd.get("customerId") as string;

  if (!customerId) {
    return json({ error: "Missing customerId" }, { status: 400 });
  }

  switch (actionType) {
    case "create": {
      const pet = await createPet(session.shop, customerId, {
        name: fd.get("name") as string,
        petType: fd.get("petType") as string,
        breed: fd.get("breed") as string || undefined,
        age: fd.get("age") as string || undefined,
        weight: fd.get("weight") as string || undefined,
        color: fd.get("color") as string || undefined,
        vaccinated: fd.get("vaccinated") === "true",
        neutered: fd.get("neutered") === "true",
        setActive: fd.get("setActive") === "true",
      });
      return json({ success: true, pet });
    }

    case "update": {
      const petId = fd.get("petId") as string;
      if (!petId) return json({ error: "Missing petId" }, { status: 400 });

      const pet = await updatePet(session.shop, customerId, petId, {
        name: fd.get("name") as string,
        petType: fd.get("petType") as string,
        breed: fd.get("breed") as string || undefined,
        age: fd.get("age") as string || undefined,
        weight: fd.get("weight") as string || undefined,
        color: fd.get("color") as string || undefined,
        vaccinated: fd.get("vaccinated") === "true",
        neutered: fd.get("neutered") === "true",
        setActive: fd.get("setActive") === "true",
      });
      return json({ success: true, pet });
    }

    case "delete": {
      const petId = fd.get("petId") as string;
      if (!petId) return json({ error: "Missing petId" }, { status: 400 });

      await deletePet(session.shop, customerId, petId);
      return json({ success: true });
    }

    case "set-active": {
      const petId = fd.get("petId") as string;
      if (!petId) return json({ error: "Missing petId" }, { status: 400 });

      const pet = await setActivePet(session.shop, customerId, petId);
      return json({ success: true, pet });
    }

    case "agree-terms": {
      const agreement = await agreeToTerms(session.shop, customerId);
      return json({ success: true, agreement });
    }

    default:
      return json({ error: "Unknown action" }, { status: 400 });
  }
};

function json(data: any, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}
