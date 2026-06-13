import { useEffect, useRef } from "react";

/**
 * Manages the Shopify Admin ContextualSaveBar lifecycle.
 *
 * Shows the save bar when `isDirty` is true, hides it when false.
 * `onSave` is called when the user clicks "Save" in the admin chrome.
 * `onDiscard` is called when the user clicks "Discard".
 *
 * The save bar is automatically hidden on unmount (cleanup effect).
 * Callbacks use refs internally so they are stable across renders.
 */
export function useContextualSaveBar(
  shopify: any,
  isDirty: boolean,
  onSave: () => void,
  onDiscard: () => void,
) {
  const saveRef = useRef(onSave);
  const discardRef = useRef(onDiscard);
  saveRef.current = onSave;
  discardRef.current = onDiscard;

  useEffect(() => {
    if (isDirty) {
      shopify.saveBar.show({
        saveAction: () => saveRef.current(),
        discardAction: () => discardRef.current(),
      });
    } else {
      shopify.saveBar.hide();
    }

    return () => {
      shopify.saveBar.hide();
    };
    // shopify is stable across renders for a given app instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);
}

/**
 * Helper: returns true if two values differ (simple deep equality for strings/booleans).
 * Treats null/undefined as equal to empty string for form-field ergonomics.
 */
export function fieldChanged(
  current: string | boolean | number | null | undefined,
  original: string | boolean | number | null | undefined,
): boolean {
  const a = current ?? "";
  const b = original ?? "";
  return String(a) !== String(b);
}
