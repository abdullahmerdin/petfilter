var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter, UNSAFE_withComponentProps, useLoaderData, Outlet, UNSAFE_withErrorBoundaryProps, useRouteError, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useActionData, Form, redirect, useNavigation, useNavigate, useFetcher, useSearchParams } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-react-router/adapters/node";
import { shopifyApp, AppDistribution, ApiVersion, LoginErrorType, boundary } from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";
import { AppProvider, BlockStack, Text, Card, InlineStack, ProgressBar, Banner, List, Button, Badge, Tooltip, Icon, Page, Select, TextField, DataTable, Checkbox, Spinner, Layout as Layout$1, Modal } from "@shopify/polaris";
import * as crypto from "crypto";
import crypto__default from "crypto";
import { AppProvider as AppProvider$1 } from "@shopify/shopify-app-react-router/react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { MagicIcon, AppsIcon, SettingsIcon, PlusCircleIcon, CheckCircleIcon, InfoIcon, ShippingLabelIcon, HeartIcon, StarFilledIcon, BillFilledIcon, GiftCardIcon, CollectionIcon, FilterIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";
if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}
const prisma = global.prismaGlobal ?? new PrismaClient();
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.April26,
  scopes: (_a = process.env.SCOPES) == null ? void 0 : _a.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true
  }
});
ApiVersion.January26;
const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
const unauthenticated = shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        ServerRouter,
        {
          context: reactRouterContext,
          url: request.url
        }
      ),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const Polaris = /* @__PURE__ */ JSON.parse('{"ActionMenu":{"Actions":{"moreActions":"More actions"},"RollupActions":{"rollupButton":"View actions"}},"ActionList":{"SearchField":{"clearButtonLabel":"Clear","search":"Search","placeholder":"Search actions"}},"Avatar":{"label":"Avatar","labelWithInitials":"Avatar with initials {initials}"},"Autocomplete":{"spinnerAccessibilityLabel":"Loading","ellipsis":"{content}…"},"Badge":{"PROGRESS_LABELS":{"incomplete":"Incomplete","partiallyComplete":"Partially complete","complete":"Complete"},"TONE_LABELS":{"info":"Info","success":"Success","warning":"Warning","critical":"Critical","attention":"Attention","new":"New","readOnly":"Read-only","enabled":"Enabled"},"progressAndTone":"{toneLabel} {progressLabel}"},"Banner":{"dismissButton":"Dismiss notification"},"Button":{"spinnerAccessibilityLabel":"Loading"},"Common":{"checkbox":"checkbox","undo":"Undo","cancel":"Cancel","clear":"Clear","close":"Close","submit":"Submit","more":"More"},"ContextualSaveBar":{"save":"Save","discard":"Discard"},"DataTable":{"sortAccessibilityLabel":"sort {direction} by","navAccessibilityLabel":"Scroll table {direction} one column","totalsRowHeading":"Totals","totalRowHeading":"Total"},"DatePicker":{"previousMonth":"Show previous month, {previousMonthName} {showPreviousYear}","nextMonth":"Show next month, {nextMonth} {nextYear}","today":"Today ","start":"Start of range","end":"End of range","months":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"days":{"monday":"Monday","tuesday":"Tuesday","wednesday":"Wednesday","thursday":"Thursday","friday":"Friday","saturday":"Saturday","sunday":"Sunday"},"daysAbbreviated":{"monday":"Mo","tuesday":"Tu","wednesday":"We","thursday":"Th","friday":"Fr","saturday":"Sa","sunday":"Su"}},"DiscardConfirmationModal":{"title":"Discard all unsaved changes","message":"If you discard changes, you’ll delete any edits you made since you last saved.","primaryAction":"Discard changes","secondaryAction":"Continue editing"},"DropZone":{"single":{"overlayTextFile":"Drop file to upload","overlayTextImage":"Drop image to upload","overlayTextVideo":"Drop video to upload","actionTitleFile":"Add file","actionTitleImage":"Add image","actionTitleVideo":"Add video","actionHintFile":"or drop file to upload","actionHintImage":"or drop image to upload","actionHintVideo":"or drop video to upload","labelFile":"Upload file","labelImage":"Upload image","labelVideo":"Upload video"},"allowMultiple":{"overlayTextFile":"Drop files to upload","overlayTextImage":"Drop images to upload","overlayTextVideo":"Drop videos to upload","actionTitleFile":"Add files","actionTitleImage":"Add images","actionTitleVideo":"Add videos","actionHintFile":"or drop files to upload","actionHintImage":"or drop images to upload","actionHintVideo":"or drop videos to upload","labelFile":"Upload files","labelImage":"Upload images","labelVideo":"Upload videos"},"errorOverlayTextFile":"File type is not valid","errorOverlayTextImage":"Image type is not valid","errorOverlayTextVideo":"Video type is not valid"},"EmptySearchResult":{"altText":"Empty search results"},"Frame":{"skipToContent":"Skip to content","navigationLabel":"Navigation","Navigation":{"closeMobileNavigationLabel":"Close navigation"}},"FullscreenBar":{"back":"Back","accessibilityLabel":"Exit fullscreen mode"},"Filters":{"moreFilters":"More filters","moreFiltersWithCount":"More filters ({count})","filter":"Filter {resourceName}","noFiltersApplied":"No filters applied","cancel":"Cancel","done":"Done","clearAllFilters":"Clear all filters","clear":"Clear","clearLabel":"Clear {filterName}","addFilter":"Add filter","clearFilters":"Clear all","searchInView":"in:{viewName}"},"FilterPill":{"clear":"Clear","unsavedChanges":"Unsaved changes - {label}"},"IndexFilters":{"searchFilterTooltip":"Search and filter","searchFilterTooltipWithShortcut":"Search and filter (F)","searchFilterAccessibilityLabel":"Search and filter results","sort":"Sort your results","addView":"Add a new view","newView":"Custom search","SortButton":{"ariaLabel":"Sort the results","tooltip":"Sort","title":"Sort by","sorting":{"asc":"Ascending","desc":"Descending","az":"A-Z","za":"Z-A"}},"EditColumnsButton":{"tooltip":"Edit columns","accessibilityLabel":"Customize table column order and visibility"},"UpdateButtons":{"cancel":"Cancel","update":"Update","save":"Save","saveAs":"Save as","modal":{"title":"Save view as","label":"Name","sameName":"A view with this name already exists. Please choose a different name.","save":"Save","cancel":"Cancel"}}},"IndexProvider":{"defaultItemSingular":"Item","defaultItemPlural":"Items","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} are selected","selected":"{selectedItemsCount} selected","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}"},"IndexTable":{"emptySearchTitle":"No {resourceNamePlural} found","emptySearchDescription":"Try changing the filters or search term","onboardingBadgeText":"New","resourceLoadingAccessibilityLabel":"Loading {resourceNamePlural}…","selectAllLabel":"Select all {resourceNamePlural}","selected":"{selectedItemsCount} selected","undo":"Undo","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural}","selectItem":"Select {resourceName}","selectButtonText":"Select","sortAccessibilityLabel":"sort {direction} by"},"Loading":{"label":"Page loading bar"},"Modal":{"iFrameTitle":"body markup","modalWarning":"These required properties are missing from Modal: {missingProps}"},"Page":{"Header":{"rollupActionsLabel":"View actions for {title}","pageReadyAccessibilityLabel":"{title}. This page is ready"}},"Pagination":{"previous":"Previous","next":"Next","pagination":"Pagination"},"ProgressBar":{"negativeWarningMessage":"Values passed to the progress prop shouldn’t be negative. Resetting {progress} to 0.","exceedWarningMessage":"Values passed to the progress prop shouldn’t exceed 100. Setting {progress} to 100."},"ResourceList":{"sortingLabel":"Sort by","defaultItemSingular":"item","defaultItemPlural":"items","showing":"Showing {itemsCount} {resource}","showingTotalCount":"Showing {itemsCount} of {totalItemsCount} {resource}","loading":"Loading {resource}","selected":"{selectedItemsCount} selected","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} in your store are selected","allFilteredItemsSelected":"All {itemsLength}+ {resourceNamePlural} in this filter are selected","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural} in your store","selectAllFilteredItems":"Select all {itemsLength}+ {resourceNamePlural} in this filter","emptySearchResultTitle":"No {resourceNamePlural} found","emptySearchResultDescription":"Try changing the filters or search term","selectButtonText":"Select","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}","Item":{"actionsDropdownLabel":"Actions for {accessibilityLabel}","actionsDropdown":"Actions dropdown","viewItem":"View details for {itemName}"},"BulkActions":{"actionsActivatorLabel":"Actions","moreActionsActivatorLabel":"More actions"}},"SkeletonPage":{"loadingLabel":"Page loading"},"Tabs":{"newViewAccessibilityLabel":"Create new view","newViewTooltip":"Create view","toggleTabsLabel":"More views","Tab":{"rename":"Rename view","duplicate":"Duplicate view","edit":"Edit view","editColumns":"Edit columns","delete":"Delete view","copy":"Copy of {name}","deleteModal":{"title":"Delete view?","description":"This can’t be undone. {viewName} view will no longer be available in your admin.","cancel":"Cancel","delete":"Delete view"}},"RenameModal":{"title":"Rename view","label":"Name","cancel":"Cancel","create":"Save","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"DuplicateModal":{"title":"Duplicate view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"CreateViewModal":{"title":"Create new view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}}},"Tag":{"ariaLabel":"Remove {children}"},"TextField":{"characterCount":"{count} characters","characterCountWithMaxLength":"{count} of {limit} characters used"},"TooltipOverlay":{"accessibilityLabel":"Tooltip: {label}"},"TopBar":{"toggleMenuLabel":"Toggle menu","SearchField":{"clearButtonLabel":"Clear","search":"Search"}},"MediaCard":{"dismissButton":"Dismiss","popoverButton":"Actions"},"VideoThumbnail":{"playButtonA11yLabel":{"default":"Play video","defaultWithDuration":"Play video of length {duration}","duration":{"hours":{"other":{"only":"{hourCount} hours","andMinutes":"{hourCount} hours and {minuteCount} minutes","andMinute":"{hourCount} hours and {minuteCount} minute","minutesAndSeconds":"{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hours, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hours, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hours, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hours and {secondCount} seconds","andSecond":"{hourCount} hours and {secondCount} second"},"one":{"only":"{hourCount} hour","andMinutes":"{hourCount} hour and {minuteCount} minutes","andMinute":"{hourCount} hour and {minuteCount} minute","minutesAndSeconds":"{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hour, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hour, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hour, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hour and {secondCount} seconds","andSecond":"{hourCount} hour and {secondCount} second"}},"minutes":{"other":{"only":"{minuteCount} minutes","andSeconds":"{minuteCount} minutes and {secondCount} seconds","andSecond":"{minuteCount} minutes and {secondCount} second"},"one":{"only":"{minuteCount} minute","andSeconds":"{minuteCount} minute and {secondCount} seconds","andSecond":"{minuteCount} minute and {secondCount} second"}},"seconds":{"other":"{secondCount} seconds","one":"{secondCount} second"}}}}}');
const polarisTranslations = {
  Polaris
};
const loader$h = async ({
  request
}) => {
  return {
    polarisTranslations
  };
};
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const {
    polarisTranslations: polarisTranslations2
  } = useLoaderData();
  return /* @__PURE__ */ jsx(AppProvider, {
    i18n: polarisTranslations2,
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
});
const ErrorBoundary$9 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
  var _a2;
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        padding: "2rem"
      },
      children: [/* @__PURE__ */ jsx("h1", {
        children: error.status
      }), /* @__PURE__ */ jsx("p", {
        children: error.statusText
      }), ((_a2 = error.data) == null ? void 0 : _a2.message) && /* @__PURE__ */ jsx("p", {
        children: error.data.message
      })]
    });
  }
  const err = error;
  return /* @__PURE__ */ jsxs("div", {
    style: {
      padding: "2rem"
    },
    children: [/* @__PURE__ */ jsx("h1", {
      children: "Unexpected Server Error"
    }), /* @__PURE__ */ jsx("p", {
      children: (err == null ? void 0 : err.message) || "Unknown error"
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$9,
  Layout,
  default: root,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
class WebhookProfiler {
  constructor(name, tags) {
    /** Human-readable webhook name/source (e.g. "uninstalled", "gdpr") */
    __publicField(this, "name");
    /** Arbitrary tags for structured logging / metrics aggregation */
    __publicField(this, "tags");
    __publicField(this, "marks", []);
    __publicField(this, "startTs");
    this.name = name;
    this.startTs = performance.now();
    this.tags = { ...tags };
  }
  /**
   * Record a named timing mark since the profile start.
   * Call after each significant phase of webhook processing.
   */
  mark(label) {
    const elapsed = performance.now() - this.startTs;
    this.marks.push({ label, elapsed });
    return elapsed;
  }
  /**
   * Emit a structured console log with all timing data.
   * Format: [WEBHOOK PROFILE] <name> (<total>ms) <phase>:<ms> <phase>:<ms> ...
   *
   * Safe to call in production — single line, no PII in the timing data.
   */
  report() {
    if (this.marks.length === 0) return;
    const total = this.marks[this.marks.length - 1].elapsed;
    const phaseTimings = this.marks.reduce((acc, m, i) => {
      const prev = i === 0 ? 0 : this.marks[i - 1].elapsed;
      acc.push({
        phase: m.label,
        dur: Math.round((m.elapsed - prev) * 100) / 100,
        cum: Math.round(m.elapsed * 100) / 100
      });
      return acc;
    }, []).map((p) => `${p.phase}=${p.dur}ms`).join(" ");
    const tagStr = Object.keys(this.tags).length > 0 ? ` tags=${JSON.stringify(this.tags)}` : "";
    console.log(
      `[WEBHOOK PROFILE] ${this.name} total=${Math.round(total * 100) / 100}ms ${phaseTimings}${tagStr}`
    );
  }
  /**
   * Reset all timestamps. Useful if reusing a profiler instance.
   */
  reset(name) {
    if (name) this.name = name;
    this.marks = [];
    this.startTs = performance.now();
  }
}
class ValidationResultCache {
  /**
   * @param maxSize  Max entries before LRU eviction (default: 100)
   * @param ttlMs    Time-to-live in ms (default: 300_000 = 5 min)
   */
  constructor(maxSize = 100, ttlMs = 3e5) {
    __publicField(this, "maxSize");
    __publicField(this, "ttlMs");
    __publicField(this, "cache", /* @__PURE__ */ new Map());
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }
  /** Lookup cached result. Returns undefined if not found or expired. */
  get(key) {
    const entry2 = this.cache.get(key);
    if (!entry2) return void 0;
    if (Date.now() > entry2.expiresAt) {
      this.cache.delete(key);
      return void 0;
    }
    this.cache.delete(key);
    this.cache.set(key, entry2);
    return entry2.result;
  }
  /** Store a validation result. */
  set(key, result) {
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next();
      if (!oldest.done) this.cache.delete(oldest.value);
    }
    this.cache.set(key, {
      result,
      expiresAt: Date.now() + this.ttlMs
    });
  }
  /** Current number of cached entries (for monitoring). */
  get size() {
    const now = Date.now();
    this.cache.forEach((entry2, key) => {
      if (now > entry2.expiresAt) this.cache.delete(key);
    });
    return this.cache.size;
  }
  /** Clear all entries. */
  clear() {
    this.cache.clear();
  }
}
const webhookValidationCache = new ValidationResultCache();
const HMAC_HEADER = "x-shopify-hmac-sha256";
class WebhookSignatureValidator {
  /**
   * Verify the HMAC-SHA256 signature on a Shopify webhook request.
   *
   * @param rawBody - The raw request body as a string (get from request.clone().text())
   * @param headers - The request headers (Request.headers or a Headers instance)
   * @param apiSecret - The Shopify API secret key (defaults to SHOPIFY_API_SECRET env var)
   * @returns true if the signature is valid, false otherwise
   */
  static verify(rawBody, headers2, apiSecret = process.env.SHOPIFY_API_SECRET || "") {
    if (!apiSecret) {
      console.error("[HMAC FAIL] SHOPIFY_API_SECRET is not configured");
      return false;
    }
    const providedHmac = headers2.get(HMAC_HEADER);
    if (!providedHmac) {
      console.error("[HMAC FAIL] Missing X-Shopify-Hmac-SHA256 header");
      return false;
    }
    const cacheKey2 = providedHmac;
    const cached = webhookValidationCache.get(cacheKey2);
    if (cached !== void 0) {
      return cached;
    }
    const computedHmac = crypto.createHmac("sha256", apiSecret).update(rawBody, "utf8").digest("base64");
    if (computedHmac.length !== providedHmac.length) {
      console.error(
        `[HMAC FAIL] Length mismatch: expected ${computedHmac.length}, got ${providedHmac.length}`
      );
      webhookValidationCache.set(cacheKey2, false);
      return false;
    }
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computedHmac, "utf8"),
      Buffer.from(providedHmac, "utf8")
    );
    if (!isValid) {
      console.error("[HMAC FAIL] Signature mismatch");
    }
    webhookValidationCache.set(cacheKey2, isValid);
    return isValid;
  }
}
async function validateWebhookRequest(request, profiler2) {
  const rawBody = await request.clone().text();
  if (profiler2) profiler2.mark("validate-hmac");
  if (!WebhookSignatureValidator.verify(rawBody, request.headers)) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "HMAC signature verification failed"
    });
  }
  return null;
}
const action$a = async ({
  request
}) => {
  const profiler2 = new WebhookProfiler("scopes_update");
  const hmacError = await validateWebhookRequest(request, profiler2);
  if (hmacError) return hmacError;
  profiler2.mark("authenticate");
  const {
    payload,
    session,
    topic,
    shop
  } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  profiler2.mark("handler");
  const current = payload.current;
  if (session) {
    await prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        scope: current.toString()
      }
    });
  }
  profiler2.mark("done");
  profiler2.report();
  return new Response();
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a
}, Symbol.toStringTag, { value: "Module" }));
const action$9 = async ({
  request
}) => {
  const profiler2 = new WebhookProfiler("uninstalled");
  const hmacError = await validateWebhookRequest(request, profiler2);
  if (hmacError) return hmacError;
  profiler2.mark("authenticate");
  const {
    shop,
    session,
    topic
  } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  profiler2.mark("handler");
  if (session) {
    await prisma.session.deleteMany({
      where: {
        shop
      }
    });
  }
  profiler2.mark("done");
  profiler2.report();
  return new Response();
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9
}, Symbol.toStringTag, { value: "Module" }));
const CRITERION_LABELS = {
  pet_type: "Pet Type",
  breed: "Breed",
  size: "Size",
  age: "Age Group",
  diet: "Diet",
  temperament: "Temperament",
  color: "Color",
  weight_min: "Min Weight",
  weight_max: "Max Weight",
  vaccinated: "Vaccinated",
  neutered: "Neutered"
};
function evaluatePetAgainstRule(pet, rule) {
  var _a2, _b;
  const matchedCriteria = [];
  let score = 0;
  if (rule.petType && pet.petType === rule.petType) {
    score += 1;
    matchedCriteria.push("pet_type");
  }
  if (rule.breedFilter && ((_a2 = pet.breed) == null ? void 0 : _a2.toLowerCase().includes(rule.breedFilter.toLowerCase()))) {
    score += 1;
    matchedCriteria.push("breed");
  }
  if (rule.sizeFilter && pet.size === rule.sizeFilter) {
    score += 1;
    matchedCriteria.push("size");
  }
  if (rule.ageFilter && pet.ageGroup === rule.ageFilter) {
    score += 1;
    matchedCriteria.push("age");
  }
  if (rule.dietFilter && ((_b = pet.dietaryNeeds) == null ? void 0 : _b.toLowerCase().includes(rule.dietFilter.toLowerCase()))) {
    score += 1;
    matchedCriteria.push("diet");
  }
  if (rule.temperamentFilter && pet.temperament === rule.temperamentFilter) {
    score += 1;
    matchedCriteria.push("temperament");
  }
  if (rule.colorFilter && pet.color === rule.colorFilter) {
    score += 1;
    matchedCriteria.push("color");
  }
  if (rule.weightMin != null && pet.weight) {
    const w = parseFloat(pet.weight);
    if (!isNaN(w) && w >= rule.weightMin) {
      score += 1;
      matchedCriteria.push("weight_min");
    }
  }
  if (rule.weightMax != null && pet.weight) {
    const w = parseFloat(pet.weight);
    if (!isNaN(w) && w <= rule.weightMax) {
      score += 1;
      matchedCriteria.push("weight_max");
    }
  }
  if (rule.vaccinated != null && pet.vaccinated === rule.vaccinated) {
    score += 1;
    matchedCriteria.push("vaccinated");
  }
  if (rule.neutered != null && pet.neutered === rule.neutered) {
    score += 1;
    matchedCriteria.push("neutered");
  }
  const cleanCriteria = matchedCriteria.map((k) => CRITERION_LABELS[k] || k);
  return { profile: pet, score, matchedCriteria: cleanCriteria };
}
function findCompatiblePets(pets, rule, minScore = 1) {
  return pets.map((p) => evaluatePetAgainstRule(p, rule)).filter((r) => r.score >= minScore).sort((a, b) => b.score - a.score);
}
var CacheTier = /* @__PURE__ */ ((CacheTier2) => {
  CacheTier2[CacheTier2["SHORT"] = 5e3] = "SHORT";
  CacheTier2[CacheTier2["MEDIUM"] = 6e4] = "MEDIUM";
  CacheTier2[CacheTier2["LONG"] = 3e5] = "LONG";
  CacheTier2[CacheTier2["STALE"] = 9e5] = "STALE";
  return CacheTier2;
})(CacheTier || {});
class ResponseCache {
  constructor(maxSize = 500) {
    __publicField(this, "store", /* @__PURE__ */ new Map());
    __publicField(this, "maxSize");
    __publicField(this, "hits", 0);
    __publicField(this, "misses", 0);
    __publicField(this, "evictions", 0);
    this.maxSize = maxSize;
  }
  /** Get or compute a cached value. Supports stale-while-revalidate. */
  async getOrCompute(key, fetcher, tier = 6e4, options) {
    const now = Date.now();
    const entry2 = this.store.get(key);
    if (entry2 && now < entry2.expiresAt) {
      this.hits++;
      entry2.hits++;
      return entry2.value;
    }
    if (entry2 && (options == null ? void 0 : options.revalidate) && now < entry2.staleAt) {
      this.hits++;
      entry2.hits++;
      this.refreshInBackground(key, fetcher, tier);
      return entry2.value;
    }
    this.misses++;
    const value = await fetcher();
    this.set(key, value, tier);
    return value;
  }
  /** Set a value in cache with explicit TTL. */
  set(key, value, tier = 6e4) {
    const now = Date.now();
    if (this.store.size >= this.maxSize) {
      this.evictLRU();
    }
    this.store.set(key, {
      value,
      expiresAt: now + tier,
      staleAt: now + tier + 9e5,
      hits: 0
    });
  }
  /** Get a cached value without fetching. */
  get(key) {
    const entry2 = this.store.get(key);
    if (!entry2) return null;
    if (Date.now() >= entry2.expiresAt) {
      this.store.delete(key);
      return null;
    }
    this.hits++;
    entry2.hits++;
    return entry2.value;
  }
  /** Invalidate a specific key or keys matching a prefix. */
  invalidate(keyOrPrefix) {
    if (this.store.has(keyOrPrefix)) {
      this.store.delete(keyOrPrefix);
      return;
    }
    for (const key of this.store.keys()) {
      if (key.startsWith(keyOrPrefix)) {
        this.store.delete(key);
      }
    }
  }
  /** Clear all cached entries. */
  clear() {
    this.store.clear();
  }
  /** Get cache statistics for debugging. */
  getStats() {
    return {
      size: this.store.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions
    };
  }
  evictLRU() {
    let lruKey = null;
    let minHits = Infinity;
    for (const [key, entry2] of this.store.entries()) {
      if (entry2.hits < minHits) {
        minHits = entry2.hits;
        lruKey = key;
      }
    }
    if (lruKey) {
      this.store.delete(lruKey);
      this.evictions++;
    }
  }
  async refreshInBackground(key, fetcher, tier) {
    try {
      const freshValue = await fetcher();
      this.set(key, freshValue, tier);
    } catch {
    }
  }
}
function cacheKey(prefix, ...args) {
  return `${prefix}:${args.map((a) => typeof a === "object" ? JSON.stringify(a) : String(a)).join(":")}`;
}
const CacheKeys = {
  shopSettings: (shop) => cacheKey("shopSettings", shop),
  petProfile: (productId) => cacheKey("petProfile", productId),
  filterRule: (ruleId) => cacheKey("filterRule", ruleId),
  dashboardStats: (shop) => cacheKey("dashboardStats", shop),
  badgeData: (shop, productId) => cacheKey("badgeData", shop, productId),
  compatibleBadge: (shop, productId) => cacheKey("compatibleBadge", shop, productId),
  bestMatches: (shop, productId) => cacheKey("bestMatches", shop, productId)
};
let responseCache = null;
function getResponseCache(maxSize) {
  if (!responseCache) {
    responseCache = new ResponseCache(maxSize);
  }
  return responseCache;
}
function countApplicableCriteria(pet) {
  let count = 0;
  if (pet.petType) count++;
  if (pet.breed) count++;
  if (pet.size) count++;
  if (pet.ageGroup) count++;
  if (pet.dietaryNeeds) count++;
  if (pet.temperament) count++;
  if (pet.color) count++;
  if (pet.weight) count++;
  return count;
}
function buildRuleFromPet(pet) {
  const parsedWeight = pet.weight ? parseFloat(pet.weight) : null;
  return {
    id: "",
    shop: "",
    name: "",
    description: null,
    petType: pet.petType,
    breedFilter: pet.breed,
    sizeFilter: pet.size,
    ageFilter: pet.ageGroup,
    dietFilter: pet.dietaryNeeds,
    temperamentFilter: pet.temperament,
    colorFilter: pet.color,
    weightMin: parsedWeight !== null && !isNaN(parsedWeight) ? parsedWeight - 10 : null,
    weightMax: parsedWeight !== null && !isNaN(parsedWeight) ? parsedWeight + 10 : null,
    vaccinated: null,
    // Only match if other pet matches current pet's vaccinated status equivalently
    neutered: null,
    isActive: true,
    priority: 0,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  };
}
async function fetchProductsByIds(admin, gids) {
  var _a2;
  const response = await admin.graphql(
    `#graphql
    query GetProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          images(first: 1) { nodes { url } }
          variants(first: 1) { nodes { price, compareAtPrice } }
        }
      }
    }`,
    { variables: { ids: gids } }
  );
  const json2 = await response.json();
  const nodes = ((_a2 = json2 == null ? void 0 : json2.data) == null ? void 0 : _a2.nodes) ?? [];
  const map = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    if (node == null ? void 0 : node.id) map.set(node.id, node);
  }
  return map;
}
async function getStorefrontBadgeData(shop, productId) {
  const [settings, pet] = await Promise.all([
    prisma.shopSettings.findUnique({ where: { shop } }),
    prisma.petProfile.findUnique({ where: { productId } })
  ]);
  if (!(settings == null ? void 0 : settings.badgeEnabled) || !pet) return null;
  return { badgeColor: settings.badgeColor, badgeText: settings.badgeText, petType: pet.petType };
}
async function getCompatibleBadgeData(shop, productId) {
  const [settings, currentPet] = await Promise.all([
    prisma.shopSettings.findUnique({ where: { shop } }),
    prisma.petProfile.findUnique({ where: { productId } })
  ]);
  if (!currentPet || !settings) return null;
  const compatiblePets = await prisma.petProfile.findMany({
    where: { shop, petType: currentPet.petType, id: { not: currentPet.id } },
    take: 5
  });
  return { buttonLabel: settings.buttonLabel, compatibleCount: compatiblePets.length };
}
async function getBestMatchesData(shop, productId, admin) {
  const cache2 = getResponseCache();
  return cache2.getOrCompute(
    CacheKeys.bestMatches(shop, productId),
    async () => {
      const [settings, currentPet] = await Promise.all([
        prisma.shopSettings.findUnique({ where: { shop } }),
        prisma.petProfile.findUnique({ where: { productId } })
      ]);
      if (!(settings == null ? void 0 : settings.badgeEnabled) || !currentPet) return null;
      const rule = buildRuleFromPet(currentPet);
      const maxScore = countApplicableCriteria(currentPet);
      const allPets = await prisma.petProfile.findMany({
        where: { shop, id: { not: currentPet.id } }
      });
      if (allPets.length === 0) {
        return { matches: [], total: 0, currentPetType: currentPet.petType, badgeEnabled: true };
      }
      const results = allPets.map((p) => evaluatePetAgainstRule(p, rule)).filter((r) => r.score >= 1).sort((a, b) => b.score - a.score).slice(0, 6);
      if (results.length === 0) {
        return { matches: [], total: 0, currentPetType: currentPet.petType, badgeEnabled: true };
      }
      const gids = results.map((r) => r.profile.productId);
      const productMap = await fetchProductsByIds(admin, gids);
      const matches = results.map((r) => {
        var _a2, _b, _c, _d, _e;
        const product = productMap.get(r.profile.productId);
        const variant = (_b = (_a2 = product == null ? void 0 : product.variants) == null ? void 0 : _a2.nodes) == null ? void 0 : _b[0];
        const scorePercent = maxScore > 0 ? Math.round(r.score / maxScore * 100) : 0;
        return {
          productId: r.profile.productId,
          handle: (product == null ? void 0 : product.handle) ?? r.profile.productHandle ?? "",
          title: (product == null ? void 0 : product.title) ?? r.profile.productTitle ?? "Unknown Product",
          image: ((_e = (_d = (_c = product == null ? void 0 : product.images) == null ? void 0 : _c.nodes) == null ? void 0 : _d[0]) == null ? void 0 : _e.url) ?? null,
          price: (variant == null ? void 0 : variant.price) ?? "",
          compareAtPrice: (variant == null ? void 0 : variant.compareAtPrice) ?? null,
          score: r.score,
          maxScore,
          scorePercent,
          matchedCriteria: r.matchedCriteria,
          petType: r.profile.petType
        };
      });
      return {
        matches,
        total: matches.length,
        currentPetType: currentPet.petType,
        badgeEnabled: true
      };
    },
    CacheTier.LONG,
    { revalidate: true }
  );
}
const cache$2 = getResponseCache();
const loader$g = async ({
  request
}) => {
  const {
    session
  } = await authenticate.public.appProxy(request);
  if (!session) {
    return Response.json({
      compatibleCount: 0,
      buttonLabel: ""
    }, {
      status: 401
    });
  }
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId") ?? url.searchParams.get("id");
  if (!productId) {
    return Response.json({
      compatibleCount: 0,
      buttonLabel: ""
    }, {
      status: 400
    });
  }
  const data = await cache$2.getOrCompute(CacheKeys.compatibleBadge(session.shop, productId), () => getCompatibleBadgeData(session.shop, productId), CacheTier.MEDIUM, {
    revalidate: true
  });
  if (!data) {
    return Response.json({
      compatibleCount: 0,
      buttonLabel: ""
    }, {
      status: 200
    });
  }
  return Response.json({
    compatibleCount: data.compatibleCount,
    buttonLabel: data.buttonLabel
  }, {
    status: 200
  });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
const rateLimitStore = /* @__PURE__ */ new Map();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW = 6e4;
function checkRateLimit(shop) {
  const now = Date.now();
  const entry2 = rateLimitStore.get(shop);
  if (!entry2 || now > entry2.resetAt) {
    rateLimitStore.set(shop, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  entry2.count++;
  return entry2.count <= RATE_LIMIT_MAX;
}
const loader$f = async ({
  request
}) => {
  const {
    session
  } = await authenticate.public.appProxy(request);
  if (!session) {
    return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  if (!checkRateLimit(session.shop)) {
    return Response.json({
      error: "Too many requests"
    }, {
      status: 429,
      headers: {
        "Retry-After": "60"
      }
    });
  }
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId") ?? url.searchParams.get("id");
  if (!productId) {
    return Response.json({
      error: "Missing productId"
    }, {
      status: 400
    });
  }
  let admin;
  try {
    const ctx = await unauthenticated.admin(session.shop);
    admin = ctx.admin;
  } catch {
    return Response.json({
      error: "Session not found"
    }, {
      status: 401
    });
  }
  const data = await getBestMatchesData(session.shop, productId, admin);
  const cacheHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=120, stale-while-revalidate=300",
    "Vary": "Origin"
  };
  if (!data) {
    return new Response(null, {
      status: 204,
      headers: cacheHeaders
    });
  }
  return Response.json(data, {
    status: 200,
    headers: cacheHeaders
  });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
async function getSettings(shop) {
  let settings = await prisma.shopSettings.findUnique({ where: { shop } });
  if (!settings) settings = await prisma.shopSettings.create({ data: { shop } });
  return settings;
}
async function updateSettings(shop, data) {
  return prisma.shopSettings.upsert({ where: { shop }, update: data, create: { shop, ...data } });
}
const loader$e = async ({
  request
}) => {
  const {
    session
  } = await authenticate.public.appProxy(request);
  if (!session) return new Response("Unauthorized", {
    status: 401
  });
  const settings = await getSettings(session.shop);
  return new Response(JSON.stringify({
    petButtonEnabled: settings.petButtonEnabled,
    petButtonColor: settings.petButtonColor,
    petButtonAnimation: settings.petButtonAnimation,
    petButtonPosition: settings.petButtonPosition,
    petButtonBottomOffset: settings.petButtonBottomOffset
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
async function handleDataRequest(shop, customerId, email, phone) {
  await prisma.gdprRequest.create({
    data: { shop, customerId, email, phone, topic: "customers/data_request", payload: JSON.stringify({}) }
  });
}
async function handleCustomerRedact(shop, customerId, email, phone) {
  await prisma.gdprRequest.create({
    data: { shop, customerId, email, phone, topic: "customers/redact", payload: JSON.stringify({}) }
  });
}
async function handleShopRedact(shop) {
  await prisma.gdprRequest.create({
    data: { shop, topic: "shop/redact", payload: JSON.stringify({}) }
  });
  await prisma.shopSettings.deleteMany({ where: { shop } });
}
const action$8 = async ({
  request
}) => {
  var _a2, _b;
  const profiler2 = new WebhookProfiler("gdpr", {
    topic: "mixed"
  });
  const hmacError = await validateWebhookRequest(request, profiler2);
  if (hmacError) return hmacError;
  profiler2.mark("authenticate");
  const {
    shop,
    topic,
    payload
  } = await authenticate.webhook(request);
  const data = payload;
  profiler2.mark("handler");
  if (topic === "customers/data_request") await handleDataRequest(shop, (_a2 = data == null ? void 0 : data.customer_id) == null ? void 0 : _a2.toString(), data == null ? void 0 : data.email, data == null ? void 0 : data.phone);
  else if (topic === "customers/redact") await handleCustomerRedact(shop, (_b = data == null ? void 0 : data.customer_id) == null ? void 0 : _b.toString(), data == null ? void 0 : data.email, data == null ? void 0 : data.phone);
  else if (topic === "shop/redact") await handleShopRedact(shop);
  profiler2.mark("done");
  profiler2.report();
  return new Response();
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8
}, Symbol.toStringTag, { value: "Module" }));
const PET_EMOJI_MAP = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  fish: "🐟",
  small_pet: "🐹",
  rabbit: "🐇",
  reptile: "🦎",
  horse: "🐴"
};
const DEFAULT_EMOJI = "🐾";
function getPetEmoji(petType) {
  if (!petType) return DEFAULT_EMOJI;
  return PET_EMOJI_MAP[petType.toLowerCase()] ?? DEFAULT_EMOJI;
}
const cache$1 = getResponseCache();
const loader$d = async ({
  request
}) => {
  const {
    session
  } = await authenticate.public.appProxy(request);
  if (!session) {
    return new Response("Unauthorized", {
      status: 401
    });
  }
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId") ?? url.searchParams.get("id");
  if (!productId) {
    return new Response("Missing productId", {
      status: 400
    });
  }
  const data = await cache$1.getOrCompute(CacheKeys.badgeData(session.shop, productId), () => getStorefrontBadgeData(session.shop, productId), CacheTier.MEDIUM, {
    revalidate: true
  });
  if (!data) {
    return new Response(null, {
      status: 204
    });
  }
  const emoji = getPetEmoji(data.petType);
  const escapedBadgeText = data.badgeText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
  const html = `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:9999px;font-size:13px;font-weight:600;line-height:1.6;color:#fff;background:${data.badgeColor}">${emoji} ${escapedBadgeText}</span>`;
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
function loginErrorMessage(loginErrors) {
  if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  } else if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }
  return {};
}
const loader$c = async ({
  request
}) => {
  const errors = loginErrorMessage(await login(request));
  return {
    errors
  };
};
const action$7 = async ({
  request
}) => {
  const errors = loginErrorMessage(await login(request));
  return {
    errors
  };
};
const route = UNSAFE_withComponentProps(function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const {
    errors
  } = actionData || loaderData;
  return /* @__PURE__ */ jsx(AppProvider$1, {
    embedded: false,
    children: /* @__PURE__ */ jsx("s-page", {
      children: /* @__PURE__ */ jsx(Form, {
        method: "post",
        children: /* @__PURE__ */ jsxs("s-section", {
          heading: "Log in",
          children: [/* @__PURE__ */ jsx("s-text-field", {
            name: "shop",
            label: "Shop domain",
            details: "example.myshopify.com",
            value: shop,
            onChange: (e) => setShop(e.currentTarget.value),
            autocomplete: "on",
            error: errors.shop
          }), /* @__PURE__ */ jsx("s-button", {
            type: "submit",
            children: "Log in"
          })]
        })
      })
    })
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: route,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
async function getCustomerPets(shop, customerId) {
  return prisma.customerPet.findMany({
    where: { shop, customerId },
    orderBy: { createdAt: "desc" }
  });
}
async function getActivePet(shop, customerId) {
  return prisma.customerPet.findFirst({
    where: { shop, customerId, isActive: true }
  });
}
async function createPet(shop, customerId, input) {
  const { setActive, ...data } = input;
  if (setActive) {
    await prisma.customerPet.updateMany({
      where: { shop, customerId, isActive: true },
      data: { isActive: false }
    });
  }
  const existingCount = await prisma.customerPet.count({
    where: { shop, customerId }
  });
  return prisma.customerPet.create({
    data: {
      shop,
      customerId,
      ...data,
      isActive: existingCount === 0 ? true : setActive ?? false
    }
  });
}
async function updatePet(shop, customerId, petId, input) {
  const { setActive, ...data } = input;
  if (setActive) {
    await prisma.customerPet.updateMany({
      where: { shop, customerId, isActive: true },
      data: { isActive: false }
    });
  }
  return prisma.customerPet.update({
    where: { id: petId },
    data: {
      ...data,
      ...setActive !== void 0 ? { isActive: setActive } : {}
    }
  });
}
async function deletePet(shop, customerId, petId) {
  const pet = await prisma.customerPet.findFirst({
    where: { id: petId, shop, customerId }
  });
  if (!pet) return null;
  await prisma.customerPet.delete({ where: { id: petId } });
  if (pet.isActive) {
    const nextPet = await prisma.customerPet.findFirst({
      where: { shop, customerId },
      orderBy: { createdAt: "desc" }
    });
    if (nextPet) {
      await prisma.customerPet.update({
        where: { id: nextPet.id },
        data: { isActive: true }
      });
    }
  }
  return pet;
}
async function setActivePet(shop, customerId, petId) {
  await prisma.customerPet.updateMany({
    where: { shop, customerId, isActive: true },
    data: { isActive: false }
  });
  return prisma.customerPet.update({
    where: { id: petId },
    data: { isActive: true }
  });
}
async function hasAgreed(shop, customerId) {
  const agreement = await prisma.customerAgreement.findUnique({
    where: { shop_customerId: { shop, customerId } }
  });
  return !!agreement;
}
async function agreeToTerms(shop, customerId) {
  const existing = await prisma.customerAgreement.findUnique({
    where: { shop_customerId: { shop, customerId } }
  });
  if (existing) return existing;
  return prisma.customerAgreement.create({
    data: { shop, customerId }
  });
}
const loader$b = async ({
  request
}) => {
  const {
    session
  } = await authenticate.public.appProxy(request);
  if (!session) return new Response("Unauthorized", {
    status: 401
  });
  const url = new URL(request.url);
  const action2 = url.searchParams.get("action") || "list";
  const customerId = url.searchParams.get("customerId") || "";
  url.searchParams.get("petId") || "";
  if (!customerId) {
    return json({
      error: "Missing customerId"
    }, {
      status: 400
    });
  }
  switch (action2) {
    case "list":
      const pets = await getCustomerPets(session.shop, customerId);
      return json({
        pets
      });
    case "active":
      const active = await getActivePet(session.shop, customerId);
      return json({
        pet: active
      });
    case "check-agreement":
      const agreed = await hasAgreed(session.shop, customerId);
      return json({
        agreed
      });
    default:
      return json({
        error: "Unknown action"
      }, {
        status: 400
      });
  }
};
const action$6 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.public.appProxy(request);
  if (!session) return new Response("Unauthorized", {
    status: 401
  });
  const fd = await request.formData();
  const actionType = fd.get("action");
  const customerId = fd.get("customerId");
  if (!customerId) {
    return json({
      error: "Missing customerId"
    }, {
      status: 400
    });
  }
  switch (actionType) {
    case "create": {
      const pet = await createPet(session.shop, customerId, {
        name: fd.get("name"),
        petType: fd.get("petType"),
        breed: fd.get("breed") || void 0,
        age: fd.get("age") || void 0,
        weight: fd.get("weight") || void 0,
        color: fd.get("color") || void 0,
        vaccinated: fd.get("vaccinated") === "true",
        neutered: fd.get("neutered") === "true",
        setActive: fd.get("setActive") === "true"
      });
      return json({
        success: true,
        pet
      });
    }
    case "update": {
      const petId = fd.get("petId");
      if (!petId) return json({
        error: "Missing petId"
      }, {
        status: 400
      });
      const pet = await updatePet(session.shop, customerId, petId, {
        name: fd.get("name"),
        petType: fd.get("petType"),
        breed: fd.get("breed") || void 0,
        age: fd.get("age") || void 0,
        weight: fd.get("weight") || void 0,
        color: fd.get("color") || void 0,
        vaccinated: fd.get("vaccinated") === "true",
        neutered: fd.get("neutered") === "true",
        setActive: fd.get("setActive") === "true"
      });
      return json({
        success: true,
        pet
      });
    }
    case "delete": {
      const petId = fd.get("petId");
      if (!petId) return json({
        error: "Missing petId"
      }, {
        status: 400
      });
      await deletePet(session.shop, customerId, petId);
      return json({
        success: true
      });
    }
    case "set-active": {
      const petId = fd.get("petId");
      if (!petId) return json({
        error: "Missing petId"
      }, {
        status: 400
      });
      const pet = await setActivePet(session.shop, customerId, petId);
      return json({
        success: true,
        pet
      });
    }
    case "agree-terms": {
      const agreement = await agreeToTerms(session.shop, customerId);
      return json({
        success: true,
        agreement
      });
    }
    default:
      return json({
        error: "Unknown action"
      }, {
        status: 400
      });
  }
};
function json(data, init) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const loader$a = async ({
  request
}) => {
  await authenticate.admin(request);
  return null;
};
const auth_$ = UNSAFE_withComponentProps(function Auth2() {
  return null;
});
const ErrorBoundary$8 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2() {
  return boundary.error(useRouteError());
});
const headers$8 = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$8,
  default: auth_$,
  headers: headers$8,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
const loader$9 = async ({
  request
}) => {
  const url = new URL(request.url);
  const params = url.searchParams.toString();
  const target = params ? `/app?${params}` : "/app";
  return redirect(target);
};
const _index = UNSAFE_withComponentProps(function Root() {
  return null;
});
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const loader$8 = async ({
  request
}) => {
  await authenticate.admin(request);
  return {
    apiKey: process.env.SHOPIFY_API_KEY || ""
  };
};
const app = UNSAFE_withComponentProps(function App2() {
  const {
    apiKey
  } = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return /* @__PURE__ */ jsxs(AppProvider$1, {
    embedded: true,
    apiKey,
    children: [isLoading && /* @__PURE__ */ jsx("div", {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9999,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsx("div", {
        style: {
          height: "100%",
          background: "var(--p-color-bg-fill-brand)",
          width: "30%",
          animation: "pf-slide 1s ease-in-out infinite"
        }
      })
    }), /* @__PURE__ */ jsxs("ui-nav-menu", {
      children: [/* @__PURE__ */ jsx("a", {
        href: "/app",
        rel: "home",
        style: {
          fontWeight: 600
        },
        children: "PetFilter"
      }), /* @__PURE__ */ jsx("a", {
        href: "/app",
        children: "Dashboard"
      }), /* @__PURE__ */ jsx("a", {
        href: "/app/products",
        children: "Products"
      }), /* @__PURE__ */ jsx("a", {
        href: "/app/rules",
        children: "Filter Rules"
      }), /* @__PURE__ */ jsx("a", {
        href: "/app/matching",
        children: "Matching"
      }), /* @__PURE__ */ jsx("a", {
        href: "/app/settings",
        children: "Settings"
      }), /* @__PURE__ */ jsx("a", {
        href: "/app/billing",
        children: "Billing"
      })]
    }), /* @__PURE__ */ jsx("ui-page", {
      "full-width": true,
      children: /* @__PURE__ */ jsx(Outlet, {})
    }), /* @__PURE__ */ jsx("style", {
      children: `
        @keyframes pf-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        ui-page { --top-bar-height: 0px !important; }
      `
    })]
  });
});
const ErrorBoundary$7 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary3() {
  return boundary.error(useRouteError());
});
const headers$7 = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$7,
  default: app,
  headers: headers$7,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
function StepCard({ step, title, description, IconComponent, children, isActive, isCompleted }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        opacity: isActive ? 1 : isCompleted ? 0.7 : 0.4,
        transition: "opacity 0.3s ease"
      },
      children: /* @__PURE__ */ jsx(Card, { roundedAbove: "sm", padding: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsxs(InlineStack, { gap: "200", blockAlign: "center", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--p-border-radius-200)",
                background: isCompleted ? "var(--p-color-bg-fill-success)" : isActive ? "var(--p-color-bg-fill-brand)" : "var(--p-color-bg-surface-secondary)",
                color: "var(--p-color-text-on-color)",
                flexShrink: 0
              },
              children: isCompleted ? /* @__PURE__ */ jsx(CheckCircleIcon, { width: 20, height: 20 }) : /* @__PURE__ */ jsx(IconComponent, { width: 20, height: 20 })
            }
          ),
          /* @__PURE__ */ jsxs(BlockStack, { gap: "0", children: [
            /* @__PURE__ */ jsxs(InlineStack, { gap: "200", blockAlign: "center", children: [
              isActive ? /* @__PURE__ */ jsx(Badge, { tone: "attention", children: `Step ${String(step)}` }) : /* @__PURE__ */ jsxs(Text, { as: "span", variant: "bodySm", tone: "subdued", children: [
                "Step ",
                String(step)
              ] }),
              isCompleted && /* @__PURE__ */ jsx(Badge, { tone: "success", children: "Done" })
            ] }),
            /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingSm", fontWeight: "semibold", children: title })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: description }),
        isActive && /* @__PURE__ */ jsx("div", { style: { paddingTop: "0.5rem" }, children })
      ] }) })
    }
  );
}
function StorefrontOnboarding({ onComplete }) {
  const navigate = useNavigate();
  const shopify2 = useAppBridge();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(/* @__PURE__ */ new Set());
  const totalSteps = 4;
  const progress = completedSteps.size / totalSteps * 100;
  const markStepComplete = useCallback(
    (step) => {
      const next = new Set(completedSteps);
      next.add(step);
      setCompletedSteps(next);
      if (step < totalSteps - 1) {
        setCurrentStep(step + 1);
      } else {
        onComplete();
      }
    },
    [completedSteps, onComplete]
  );
  const handleGoToSettings = useCallback(() => {
    shopify2.toast.show("Configure your badge colors, then come back to continue.");
    navigate("/app/settings");
  }, [navigate, shopify2]);
  const handleGoToProducts = useCallback(() => {
    shopify2.toast.show("Add a pet profile to a product, then come back to continue.");
    navigate("/app/products");
  }, [navigate, shopify2]);
  const steps2 = [
    {
      IconComponent: MagicIcon,
      title: "Install Theme Extension",
      description: "Install the pet-filter-theme extension so compatibility badges appear on your product pages."
    },
    {
      IconComponent: AppsIcon,
      title: "Enable App Embed",
      description: "Turn on the Pet Creation app embed so customers can add their own pet profiles on the storefront."
    },
    {
      IconComponent: SettingsIcon,
      title: "Configure Badge & Button Colors",
      description: "Choose badge and button colors that match your store's branding. Deep link to Settings to customize."
    },
    {
      IconComponent: PlusCircleIcon,
      title: "Add Your First Pet Profile",
      description: "Add a pet profile to one of your products and test the compatibility badge on your storefront."
    }
  ];
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        maxWidth: 720,
        margin: "0 auto",
        padding: "2rem 1rem"
      },
      children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsx(Text, { as: "h1", variant: "headingXl", fontWeight: "bold", children: "🐾 Welcome to PetFilter!" }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: "0.5rem" }, children: /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyLg", tone: "subdued", children: [
            "Let's get your storefront set up in ",
            String(totalSteps),
            " quick steps."
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Card, { roundedAbove: "sm", padding: "300", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsxs(InlineStack, { gap: "200", blockAlign: "center", align: "space-between", children: [
            /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodySm", fontWeight: "medium", children: "Setup Progress" }),
            /* @__PURE__ */ jsxs(Text, { as: "span", variant: "bodySm", tone: "subdued", children: [
              String(completedSteps.size),
              " of ",
              String(totalSteps),
              " steps done"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            ProgressBar,
            {
              progress,
              size: "small",
              tone: progress === 100 ? "success" : "primary"
            }
          )
        ] }) }),
        steps2.map((step, i) => /* @__PURE__ */ jsxs(
          StepCard,
          {
            step: i + 1,
            title: step.title,
            description: step.description,
            IconComponent: step.IconComponent,
            isActive: currentStep === i && !completedSteps.has(i),
            isCompleted: completedSteps.has(i),
            children: [
              i === 0 && /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
                /* @__PURE__ */ jsx(Banner, { tone: "info", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                  /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "To install the theme extension:" }),
                  /* @__PURE__ */ jsxs(List, { type: "number", children: [
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "Go to ",
                      /* @__PURE__ */ jsxs("strong", { children: [
                        "Shopify Admin ",
                        "→",
                        " Online Store ",
                        "→",
                        " Themes"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "Click ",
                      /* @__PURE__ */ jsx("strong", { children: "Customize" }),
                      " on your current theme"
                    ] }),
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "In the Theme Editor sidebar, click ",
                      /* @__PURE__ */ jsx("strong", { children: "App Embeds" })
                    ] }),
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "Find ",
                      /* @__PURE__ */ jsx("strong", { children: "pet-filter-theme" }),
                      " and click ",
                      /* @__PURE__ */ jsx("strong", { children: "Install" })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "primary",
                    onClick: () => markStepComplete(0),
                    children: [
                      "I've Installed It ",
                      "—",
                      " Continue"
                    ]
                  }
                )
              ] }),
              i === 1 && /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
                /* @__PURE__ */ jsx(Banner, { tone: "info", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                  /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "To enable the app embed on your storefront:" }),
                  /* @__PURE__ */ jsxs(List, { type: "number", children: [
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "Stay in the ",
                      /* @__PURE__ */ jsx("strong", { children: "Theme Editor" }),
                      " (Customize)"
                    ] }),
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "Click ",
                      /* @__PURE__ */ jsx("strong", { children: "App Embeds" }),
                      " in the sidebar"
                    ] }),
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "Find ",
                      /* @__PURE__ */ jsx("strong", { children: "Pet Creation" }),
                      " and toggle it ",
                      /* @__PURE__ */ jsx("strong", { children: "On" })
                    ] }),
                    /* @__PURE__ */ jsxs(List.Item, { children: [
                      "Click ",
                      /* @__PURE__ */ jsx("strong", { children: "Save" }),
                      " at the top of the editor"
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "primary",
                    onClick: () => markStepComplete(1),
                    children: [
                      "I've Enabled It ",
                      "—",
                      " Continue"
                    ]
                  }
                )
              ] }),
              i === 2 && /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
                /* @__PURE__ */ jsx(Banner, { tone: "info", children: /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Head to the Settings page to pick your badge color, badge text, and button label. You can also configure the floating pet creation button color and animation." }) }),
                /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "primary",
                      onClick: handleGoToSettings,
                      children: "Go to Settings"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "secondary",
                      onClick: () => markStepComplete(2),
                      children: [
                        "I've Configured It ",
                        "—",
                        " Continue"
                      ]
                    }
                  )
                ] })
              ] }),
              i === 3 && /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
                /* @__PURE__ */ jsx(Banner, { tone: "info", children: /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Go to Products and add a pet profile to any product in your store. Set pet type, breed, size, and more. Then visit your storefront to see the compatibility badge in action!" }) }),
                /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "primary",
                      onClick: handleGoToProducts,
                      children: "Go to Products"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "secondary",
                      onClick: () => markStepComplete(3),
                      children: [
                        "I've Added a Pet ",
                        "—",
                        " Finish"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          i
        )),
        progress === 100 && /* @__PURE__ */ jsx(Banner, { tone: "success", children: /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", fontWeight: "medium", children: [
          "🎉 All done! Redirecting to your dashboard",
          "…"
        ] }) })
      ] })
    }
  );
}
const loader$7 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const settings = await getSettings(session.shop);
  if (settings.hasCompletedOnboarding) {
    return redirect("/app");
  }
  return {
    onboarding: true
  };
};
const action$5 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const fd = await request.formData();
  if (fd.get("intent") === "complete-onboarding") {
    await updateSettings(session.shop, {
      hasCompletedOnboarding: true
    });
  }
  return {
    success: true
  };
};
const app_onboarding = UNSAFE_withComponentProps(function OnboardingRoute() {
  const data = useLoaderData();
  const navigate = useNavigate();
  if (!("onboarding" in data)) {
    return null;
  }
  const handleComplete = async () => {
    const formData = new FormData();
    formData.append("intent", "complete-onboarding");
    await fetch("/app/onboarding", {
      method: "POST",
      body: formData
    });
    navigate("/app");
  };
  return /* @__PURE__ */ jsx(StorefrontOnboarding, {
    onComplete: handleComplete
  });
});
const ErrorBoundary$6 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary4() {
  return boundary.error(useRouteError());
});
const headers$6 = (h) => boundary.headers(h);
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$6,
  action: action$5,
  default: app_onboarding,
  headers: headers$6,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
function MatchingSkeleton() {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          background: "var(--t-color-bg-surface)",
          borderRadius: "8px",
          boxShadow: "0 0 0 1px var(--t-color-border-secondary)",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "1rem 1rem 0 1rem" }, children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                height: "1.25rem",
                width: "160px",
                background: "var(--t-color-bg-fill)",
                borderRadius: "4px",
                animation: "pulse 1.5s infinite"
              }
            }
          ) }),
          /* @__PURE__ */ jsx("div", { style: { padding: "1rem" }, children: /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "480px"
              },
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "0.875rem",
                        width: "80px",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "4px",
                        marginBottom: "0.25rem",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "2.25rem",
                        width: "100%",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "6px",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "0.875rem",
                        width: "100px",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "4px",
                        marginBottom: "0.25rem",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "2.25rem",
                        width: "100%",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "6px",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      height: "2.25rem",
                      width: "120px",
                      background: "var(--t-color-bg-fill)",
                      borderRadius: "6px",
                      animation: "pulse 1.5s infinite"
                    }
                  }
                )
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          background: "var(--t-color-bg-surface)",
          borderRadius: "8px",
          boxShadow: "0 0 0 1px var(--t-color-border-secondary)",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "1rem 1rem 0 1rem" }, children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                height: "1.25rem",
                width: "180px",
                background: "var(--t-color-bg-fill)",
                borderRadius: "4px",
                animation: "pulse 1.5s infinite"
              }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "1rem" }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 60px 1fr",
                  gap: "0.75rem",
                  marginBottom: "0.75rem"
                },
                children: ["Product", "Pet Type", "Breed", "Score", "Matched Criteria"].map(
                  (_, i) => /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "0.75rem",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "4px",
                        animation: "pulse 1.5s infinite"
                      }
                    },
                    i
                  )
                )
              }
            ),
            [1, 2, 3, 4, 5].map((r) => /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 60px 1fr",
                  gap: "0.75rem",
                  padding: "0.75rem 0",
                  borderTop: "1px solid var(--t-color-border-secondary)"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "0.875rem",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "4px",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "0.875rem",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "4px",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "0.875rem",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "4px",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "1.25rem",
                        width: "48px",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "999px",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        height: "0.875rem",
                        background: "var(--t-color-bg-fill)",
                        borderRadius: "4px",
                        animation: "pulse 1.5s infinite"
                      }
                    }
                  )
                ]
              },
              r
            ))
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      ` })
  ] });
}
const FREE_PET_LIMIT = 50;
const FREE_RULE_LIMIT = 5;
async function getPlanTier(shop) {
  const settings = await prisma.shopSettings.findUnique({ where: { shop } });
  if (!settings) return "free";
  if (settings.billingPlan === "pro") return "pro";
  if (settings.billingPlan === "trial" && settings.trialEndsAt) {
    if (settings.trialEndsAt.getTime() > Date.now()) return "trial";
    return "free";
  }
  return "free";
}
async function canCreatePetProfile(shop) {
  const tier = await getPlanTier(shop);
  if (tier === "pro") return { allowed: true, current: 0, limit: Infinity };
  const count = await prisma.petProfile.count({ where: { shop } });
  return { allowed: count < FREE_PET_LIMIT, current: count, limit: FREE_PET_LIMIT };
}
async function canCreateFilterRule(shop) {
  const tier = await getPlanTier(shop);
  if (tier === "pro") return { allowed: true, current: 0, limit: Infinity };
  const count = await prisma.filterRule.count({ where: { shop } });
  return { allowed: count < FREE_RULE_LIMIT, current: count, limit: FREE_RULE_LIMIT };
}
async function listRules(shop) {
  return prisma.filterRule.findMany({ where: { shop }, orderBy: { priority: "asc" } });
}
async function listRulesPaginated(shop, skip = 0, take = 20) {
  const [rules, total] = await Promise.all([
    prisma.filterRule.findMany({ where: { shop }, orderBy: { priority: "asc" }, skip, take: take + 1 }),
    prisma.filterRule.count({ where: { shop } })
  ]);
  const hasNext = rules.length > take;
  return { rules: rules.slice(0, take), total, hasNext, skip };
}
async function createRule(shop, data) {
  const limitCheck = await canCreateFilterRule(shop);
  if (!limitCheck.allowed) {
    throw new Error(`LIMIT_REACHED:Filter rules (${limitCheck.current}/${limitCheck.limit}). Upgrade to Pro for unlimited.`);
  }
  return prisma.filterRule.create({ data: { ...data, shop } });
}
async function updateRule(shop, id, data) {
  return prisma.filterRule.update({ where: { id }, data });
}
async function deleteRule(shop, id) {
  return prisma.filterRule.delete({ where: { id } });
}
async function batchDeleteRules(shop, ids) {
  return prisma.filterRule.deleteMany({ where: { shop, id: { in: ids } } });
}
const PAGE_SIZE$1 = 20;
async function listPets(admin, shop, after = null) {
  const response = await admin.graphql(
    `#graphql
    query ListProductsWithMetafields($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            status
            metafields(namespace: "pet_filter", first: 10) {
              edges {
                node { key value }
              }
            }
          }
          cursor
        }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { variables: { first: PAGE_SIZE$1 + 1, after } }
  );
  const json2 = await response.json();
  const profiles = await prisma.petProfile.findMany({ where: { shop } });
  const rawEdges = json2.data.products.edges || [];
  const displayEdges = rawEdges.slice(0, PAGE_SIZE$1);
  const hasNext = rawEdges.length > PAGE_SIZE$1;
  const endCursor = displayEdges.length > 0 ? displayEdges[displayEdges.length - 1].cursor : null;
  return {
    products: { edges: displayEdges, pageInfo: { hasNextPage: hasNext, endCursor } },
    profiles,
    hasNext,
    endCursor
  };
}
async function updatePetMetafields(admin, productId, metafields) {
  const response = await admin.graphql(`#graphql
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }`, {
    variables: {
      metafields: metafields.map((m) => ({
        ownerId: productId,
        namespace: "pet_filter",
        key: m.key,
        value: m.value,
        type: "single_line_text_field"
      }))
    }
  });
  return response.json();
}
async function savePetProfile(shop, productId, data) {
  const existing = await prisma.petProfile.findUnique({ where: { productId } });
  if (!existing) {
    const limitCheck = await canCreatePetProfile(shop);
    if (!limitCheck.allowed) {
      throw new Error(`LIMIT_REACHED:Pet profiles (${limitCheck.current}/${limitCheck.limit}). Upgrade to Pro for unlimited.`);
    }
  }
  await prisma.petProfile.upsert({
    where: { productId },
    update: { ...data, shop },
    create: { ...data, shop, productId }
  });
}
async function deletePetProfile(productId) {
  await prisma.petProfile.deleteMany({ where: { productId } });
}
function InfoButton({ content }) {
  return /* @__PURE__ */ jsx(Tooltip, { content, dismissOnMouseOut: true, children: /* @__PURE__ */ jsx(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        cursor: "pointer",
        color: "var(--p-color-text-info)",
        opacity: 0.7,
        transition: "opacity 0.15s",
        flexShrink: 0,
        lineHeight: 0
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
      onMouseLeave: (e) => e.currentTarget.style.opacity = "0.7",
      children: /* @__PURE__ */ jsx(Icon, { source: InfoIcon, tone: "info" })
    }
  ) });
}
const loader$6 = async ({
  request
}) => {
  const {
    admin,
    session
  } = await authenticate.admin(request);
  const [rules, petsData] = await Promise.all([listRules(session.shop), listPets(admin, session.shop)]);
  const {
    products,
    profiles
  } = petsData;
  return {
    rules,
    profiles,
    products
  };
};
const app_matching = UNSAFE_withComponentProps(function Matching() {
  const {
    rules,
    profiles,
    products
  } = useLoaderData();
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return /* @__PURE__ */ jsx(MatchingSkeleton, {});
  }
  const [ruleId, setRuleId] = useState("");
  const [minScore, setMinScore] = useState(1);
  const [results, setResults] = useState(null);
  const rule = rules.find((r) => r.id === ruleId);
  const productTitleMap = new Map(((products == null ? void 0 : products.edges) || []).map((e) => [e.node.id, e.node.title]));
  function run() {
    if (!rule) return;
    setResults(findCompatiblePets(profiles, rule, minScore));
  }
  const ruleOptions = [{
    label: "Select a rule...",
    value: ""
  }, ...rules.map((r) => ({
    label: r.name,
    value: r.id
  }))];
  const [searchQuery, setSearchQuery] = useState("");
  const resultRows = (results == null ? void 0 : results.map((r, idx) => [/* @__PURE__ */ jsx("span", {
    style: {
      fontWeight: 500
    },
    children: productTitleMap.get(r.profile.productId) || r.profile.productId.split("/").pop()
  }, `title-${idx}`), r.profile.petType || "-", r.profile.breed || "-", /* @__PURE__ */ jsx(Badge, {
    tone: "success",
    children: r.score
  }, idx), /* @__PURE__ */ jsx(InlineStack, {
    gap: "100",
    wrap: true,
    children: r.matchedCriteria.map((c, ci) => /* @__PURE__ */ jsx(Badge, {
      tone: "default",
      children: c
    }, ci))
  }, `criteria-${idx}`)])) || [];
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return resultRows;
    const q = searchQuery.toLowerCase();
    return resultRows.filter((row) => {
      var _a2, _b, _c, _d;
      const product = ((_b = (_a2 = row[0]) == null ? void 0 : _a2.props) == null ? void 0 : _b.children) || "";
      const petType = row[1] || "";
      const breed = row[2] || "";
      const score = ((_d = (_c = row[3]) == null ? void 0 : _c.props) == null ? void 0 : _d.children) || "";
      return String(product).toLowerCase().includes(q) || String(petType).toLowerCase().includes(q) || String(breed).toLowerCase().includes(q) || String(score).toLowerCase().includes(q);
    });
  }, [resultRows, searchQuery]);
  return /* @__PURE__ */ jsx(Page, {
    title: "Matching",
    children: /* @__PURE__ */ jsxs(BlockStack, {
      gap: "400",
      children: [/* @__PURE__ */ jsxs(Card, {
        roundedAbove: "sm",
        children: [/* @__PURE__ */ jsxs(InlineStack, {
          gap: "100",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsx(Text, {
            as: "h2",
            variant: "headingSm",
            children: "Configure Matching"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: "Select a filter rule and minimum match count to find compatible pet products. Each matching attribute gives 1 point."
          })]
        }), /* @__PURE__ */ jsxs(BlockStack, {
          gap: "300",
          children: [/* @__PURE__ */ jsx(Select, {
            label: "Filter Rule",
            options: ruleOptions,
            value: ruleId,
            onChange: (v) => {
              setRuleId(v);
              setResults(null);
            }
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx(Text, {
              as: "label",
              variant: "bodyMd",
              fontWeight: "medium",
              children: "Minimum Score"
            }), /* @__PURE__ */ jsx("input", {
              type: "number",
              value: minScore,
              onChange: (e) => setMinScore(parseInt(e.target.value) || 10),
              style: {
                border: "1px solid var(--p-color-input-border)",
                borderRadius: "var(--p-border-radius-200)",
                padding: "0.5rem 0.75rem",
                width: "100%",
                boxSizing: "border-box",
                fontSize: "0.875rem",
                marginTop: "0.25rem"
              }
            }), /* @__PURE__ */ jsx(Text, {
              as: "p",
              variant: "bodySm",
              tone: "subdued",
              children: "Minimum number of matching attributes"
            })]
          }), /* @__PURE__ */ jsx(Button, {
            onClick: run,
            disabled: !rule,
            children: "Run Matching"
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        roundedAbove: "sm",
        children: [/* @__PURE__ */ jsxs(InlineStack, {
          gap: "100",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsxs(Text, {
            as: "h2",
            variant: "headingSm",
            children: ["Results (", (results == null ? void 0 : results.length) || 0, " compatible pets)"]
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: "Products that match the selected filter rule, sorted by match count. Each matching attribute earns 1 point."
          })]
        }), results === null ? null : results.length === 0 ? /* @__PURE__ */ jsxs(BlockStack, {
          gap: "200",
          inlineAlign: "center",
          padding: "400",
          children: [/* @__PURE__ */ jsx(Text, {
            as: "h3",
            variant: "headingMd",
            children: "No matches found"
          }), /* @__PURE__ */ jsx(Text, {
            as: "p",
            variant: "bodyMd",
            tone: "subdued",
            children: "Try lowering the minimum score or adjusting filters."
          })]
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              paddingBottom: "0.75rem"
            },
            children: /* @__PURE__ */ jsx(TextField, {
              label: "Search results",
              labelHidden: true,
              placeholder: "Search by product, pet type, breed, or score…",
              value: searchQuery,
              onChange: setSearchQuery,
              autoComplete: "off",
              clearButton: true,
              onClearButtonClick: () => setSearchQuery("")
            })
          }), /* @__PURE__ */ jsx(DataTable, {
            columnContentTypes: ["text", "text", "text", "text", "text"],
            headings: ["Product", "Pet Type", "Breed", "Score", "Matched Criteria"],
            rows: filteredRows
          })]
        })]
      })]
    })
  });
});
const ErrorBoundary$5 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary5() {
  return boundary.error(useRouteError());
});
const headers$5 = (h) => boundary.headers(h);
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$5,
  default: app_matching,
  headers: headers$5,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
function ProductsSkeleton() {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
    /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsx("div", { style: { height: "20px", width: "150px", background: "var(--t-color-bg-fill)", borderRadius: "4px" } }) }),
    /* @__PURE__ */ jsx("div", { style: { background: "var(--t-color-bg-surface)", borderRadius: "8px", boxShadow: "0 0 0 1px var(--t-color-border-secondary)", overflow: "hidden" }, children: /* @__PURE__ */ jsxs("div", { style: { padding: "1rem" }, children: [
      /* @__PURE__ */ jsx("div", { style: { height: "14px", width: "100%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.75rem" } }),
      [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx("div", { style: { height: "14px", width: `${80 - i * 8}%`, background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.5rem" } }, i))
    ] }) })
  ] });
}
function useContextualSaveBar(shopify2, isDirty, onSave, onDiscard) {
  const saveRef = useRef(onSave);
  const discardRef = useRef(onDiscard);
  saveRef.current = onSave;
  discardRef.current = onDiscard;
  useEffect(() => {
    if (isDirty) {
      shopify2.saveBar.show({
        saveAction: () => saveRef.current(),
        discardAction: () => discardRef.current()
      });
    } else {
      shopify2.saveBar.hide();
    }
    return () => {
      shopify2.saveBar.hide();
    };
  }, [isDirty]);
}
function fieldChanged(current, original) {
  const a = current ?? "";
  const b = original ?? "";
  return String(a) !== String(b);
}
function EditProfileForm({ product, profile, fieldInfo, fetcher, onDelete }) {
  const shopify2 = useAppBridge();
  const formRef = useRef(null);
  const [formPetType, setFormPetType] = useState((profile == null ? void 0 : profile.petType) || "");
  const [formBreed, setFormBreed] = useState((profile == null ? void 0 : profile.breed) || "");
  const [formSize, setFormSize] = useState((profile == null ? void 0 : profile.size) || "");
  const [formAge, setFormAge] = useState((profile == null ? void 0 : profile.ageGroup) || "");
  const [formDiet, setFormDiet] = useState((profile == null ? void 0 : profile.dietaryNeeds) || "");
  const [formTemp, setFormTemp] = useState((profile == null ? void 0 : profile.temperament) || "");
  const [formColor, setFormColor] = useState((profile == null ? void 0 : profile.color) || "");
  const [formWeight, setFormWeight] = useState((profile == null ? void 0 : profile.weight) || "");
  const [formVax, setFormVax] = useState((profile == null ? void 0 : profile.vaccinated) === true);
  const [formNeut, setFormNeut] = useState((profile == null ? void 0 : profile.neutered) === true);
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
  const isDirty = profile ? fieldChanged(formPetType, profile.petType) || fieldChanged(formBreed, profile.breed) || fieldChanged(formSize, profile.size) || fieldChanged(formAge, profile.ageGroup) || fieldChanged(formDiet, profile.dietaryNeeds) || fieldChanged(formTemp, profile.temperament) || fieldChanged(formColor, profile.color) || fieldChanged(formWeight, profile.weight) || fieldChanged(formVax, profile.vaccinated) || fieldChanged(formNeut, profile.neutered) : (
    // New profile: dirty if any field has a value
    formPetType !== "" || formBreed !== "" || formSize !== "" || formAge !== "" || formDiet !== "" || formTemp !== "" || formColor !== "" || formWeight !== "" || formVax !== false || formNeut !== false
  );
  function handleSave() {
    var _a2;
    (_a2 = formRef.current) == null ? void 0 : _a2.requestSubmit();
  }
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
  useContextualSaveBar(shopify2, isDirty, handleSave, handleDiscard);
  return /* @__PURE__ */ jsxs(Card, { roundedAbove: "sm", children: [
    /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
      /* @__PURE__ */ jsxs(Text, { as: "h2", variant: "headingSm", children: [
        "Edit: ",
        product.title
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: onDelete,
          variant: "primary",
          tone: "critical",
          disabled: fetcher.state === "submitting",
          loading: fetcher.state === "submitting",
          children: fetcher.state === "submitting" ? "Deleting..." : "Delete Profile"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(fetcher.Form, { method: "POST", ref: formRef, children: [
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "intent", value: "save" }),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "productId", value: product.id }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Pet Type" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.petType })
          ] }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Pet Type",
              labelHidden: true,
              name: "petType",
              value: formPetType,
              onChange: setFormPetType,
              placeholder: "dog, cat, bird, fish, small_pet",
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Breed" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.breed })
          ] }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Breed",
              labelHidden: true,
              name: "breed",
              value: formBreed,
              onChange: setFormBreed,
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Size" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.size })
          ] }),
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Size",
              labelHidden: true,
              name: "size",
              value: formSize,
              onChange: setFormSize,
              options: [
                { label: "Select", value: "" },
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" }
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Age Group" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.ageGroup })
          ] }),
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Age Group",
              labelHidden: true,
              name: "ageGroup",
              value: formAge,
              onChange: setFormAge,
              options: [
                { label: "Select", value: "" },
                { label: "Baby", value: "baby" },
                { label: "Adult", value: "adult" },
                { label: "Senior", value: "senior" }
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Dietary Needs" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.dietaryNeeds })
          ] }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Dietary Needs",
              labelHidden: true,
              name: "dietaryNeeds",
              value: formDiet,
              onChange: setFormDiet,
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Temperament" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.temperament })
          ] }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Temperament",
              labelHidden: true,
              name: "temperament",
              value: formTemp,
              onChange: setFormTemp,
              placeholder: "friendly, shy, energetic",
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Color" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.color })
          ] }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Color",
              labelHidden: true,
              name: "color",
              value: formColor,
              onChange: setFormColor,
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Weight (kg)" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.weight })
          ] }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Weight (kg)",
              labelHidden: true,
              name: "weight",
              type: "number",
              value: formWeight,
              onChange: setFormWeight,
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Vaccinated" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.vaccinated })
          ] }),
          /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", cursor: "pointer" }, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "vaccinated", value: "true", checked: formVax === true, onChange: () => setFormVax(true) }),
              " Yes"
            ] }),
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", cursor: "pointer" }, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "vaccinated", value: "false", checked: formVax === false, onChange: () => setFormVax(false) }),
              " No"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "0.875rem" }, children: "Neutered" }),
            /* @__PURE__ */ jsx(InfoButton, { content: fieldInfo.neutered })
          ] }),
          /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", cursor: "pointer" }, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "neutered", value: "true", checked: formNeut === true, onChange: () => setFormNeut(true) }),
              " Yes"
            ] }),
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", cursor: "pointer" }, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "neutered", value: "false", checked: formNeut === false, onChange: () => setFormNeut(false) }),
              " No"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const loader$5 = async ({
  request
}) => {
  const {
    admin,
    session
  } = await authenticate.admin(request);
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  return listPets(admin, session.shop, cursor);
};
const action$4 = async ({
  request
}) => {
  var _a2;
  const {
    admin,
    session
  } = await authenticate.admin(request);
  const shop = session.shop;
  const fd = await request.formData();
  const intent = fd.get("intent");
  if (intent === "delete") {
    const pid2 = fd.get("productId");
    await deletePetProfile(pid2);
    return {
      success: true,
      intent: "delete"
    };
  }
  const pid = fd.get("productId");
  const keys = ["petType", "breed", "size", "ageGroup", "dietaryNeeds", "temperament", "color", "weight"];
  const data = {};
  for (const k of keys) data[k] = fd.get(k);
  data.vaccinated = fd.get("vaccinated") === "true";
  data.neutered = fd.get("neutered") === "true";
  const mfs = [...keys.filter((k) => data[k]), "vaccinated", "neutered"].filter((k) => data[k] !== void 0 && data[k] !== null && data[k] !== "").map((k) => ({
    key: k.replace(/([A-Z])/g, "_$1").toLowerCase(),
    value: String(data[k])
  }));
  try {
    if (mfs.length > 0) await updatePetMetafields(admin, pid, mfs);
    await savePetProfile(shop, pid, data);
    return {
      success: true,
      intent: "save"
    };
  } catch (error) {
    if ((_a2 = error == null ? void 0 : error.message) == null ? void 0 : _a2.includes("LIMIT_REACHED")) {
      return {
        error: "LIMIT_REACHED",
        message: "You have reached the free plan limit. Upgrade to Pro for unlimited pet profiles.",
        intent: "save"
      };
    }
    throw error;
  }
};
const app_products = UNSAFE_withComponentProps(function Products() {
  var _a2, _b;
  const {
    products,
    profiles,
    hasNext,
    endCursor
  } = useLoaderData();
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return /* @__PURE__ */ jsx(ProductsSkeleton, {});
  }
  const fetcher = useFetcher();
  const shopify2 = useAppBridge();
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const cursorStackRef = useRef([]);
  const cursor = searchParams.get("cursor") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const fieldInfo = {
    petType: "The type of pet this product is suitable for. Options: dog, cat, bird, fish, small_pet.",
    breed: "The specific breed this product is recommended for (e.g. Labrador, Persian, Beagle).",
    size: "What size category this product fits best — Small, Medium, or Large.",
    ageGroup: "Which life stage this product is designed for — Baby, Adult, or Senior.",
    dietaryNeeds: "Any specific dietary requirements this product addresses (e.g. grain-free, senior formula).",
    temperament: "The temperament this product works best with — Calm, Friendly, or Energetic.",
    color: "The coat/fur color this product matches (e.g. golden, black, white).",
    weight: "The recommended weight in kg for this product.",
    vaccinated: "Whether this product is specifically suitable for vaccinated pets.",
    neutered: "Whether this product is specifically suitable for neutered pets."
  };
  useEffect(() => {
    if (cursor) {
      cursorStackRef.current.push(cursor);
    }
  }, []);
  useEffect(() => {
    var _a3, _b2, _c;
    if (((_a3 = fetcher.data) == null ? void 0 : _a3.error) === "LIMIT_REACHED") {
      shopify2.toast.show(fetcher.data.message || "Plan limit reached");
      return;
    }
    if (((_b2 = fetcher.data) == null ? void 0 : _b2.success) && fetcher.data.intent === "save") {
      shopify2.toast.show("Pet profile updated");
    }
    if (((_c = fetcher.data) == null ? void 0 : _c.success) && fetcher.data.intent === "delete") {
      shopify2.toast.show("Pet profile deleted");
      setSelected(null);
    }
  }, [fetcher.data, shopify2]);
  const profileMap = new Map(profiles.map((p) => [p.productId, p]));
  const selProfile = selected ? profileMap.get(selected) : null;
  const selProduct = selected ? (_b = (_a2 = products == null ? void 0 : products.edges) == null ? void 0 : _a2.find((e) => e.node.id === selected)) == null ? void 0 : _b.node : null;
  const productRows = ((products == null ? void 0 : products.edges) || []).map((e) => {
    const p = e.node;
    const pr = profileMap.get(p.id);
    return [/* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => setSelected(p.id),
      style: {
        background: "none",
        border: "none",
        color: "var(--p-color-text-brand)",
        textDecoration: "underline",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "0.875rem",
        padding: 0
      },
      children: p.title
    }, `title-${p.id}`), (pr == null ? void 0 : pr.petType) ? /* @__PURE__ */ jsx(Badge, {
      tone: "default",
      children: pr.petType
    }, `type-${p.id}`) : /* @__PURE__ */ jsx(Text, {
      as: "span",
      tone: "subdued",
      children: "-"
    }, `no-type-${p.id}`), p.status === "ACTIVE" ? /* @__PURE__ */ jsx(Badge, {
      tone: "success",
      children: "Active"
    }, `status-${p.id}`) : /* @__PURE__ */ jsx(Badge, {
      tone: "default",
      children: p.status
    }, `status-${p.id}`)];
  });
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return productRows;
    const q = searchQuery.toLowerCase();
    return productRows.filter((row) => {
      var _a3, _b2, _c, _d, _e, _f;
      const title = ((_b2 = (_a3 = row[0]) == null ? void 0 : _a3.props) == null ? void 0 : _b2.children) || "";
      const petType = ((_d = (_c = row[1]) == null ? void 0 : _c.props) == null ? void 0 : _d.children) || "";
      const status = ((_f = (_e = row[2]) == null ? void 0 : _e.props) == null ? void 0 : _f.children) || "";
      return String(title).toLowerCase().includes(q) || String(petType).toLowerCase().includes(q) || String(status).toLowerCase().includes(q);
    });
  }, [productRows, searchQuery]);
  function goNext() {
    if (!endCursor) return;
    setSearchParams({
      cursor: endCursor
    });
    setSelected(null);
  }
  function goPrev() {
    cursorStackRef.current.pop();
    const prev = cursorStackRef.current.pop() || "";
    if (prev) {
      setSearchParams({
        cursor: prev
      });
    } else {
      setSearchParams({});
    }
    setSelected(null);
  }
  const pageNum = cursorStackRef.current.length || 1;
  const hasPrev = cursorStackRef.current.length > 0;
  return /* @__PURE__ */ jsx(Page, {
    title: "Pet Products",
    children: /* @__PURE__ */ jsxs(BlockStack, {
      gap: "400",
      children: [/* @__PURE__ */ jsxs(Card, {
        roundedAbove: "sm",
        children: [/* @__PURE__ */ jsxs(InlineStack, {
          align: "space-between",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsxs(InlineStack, {
            gap: "100",
            blockAlign: "center",
            children: [/* @__PURE__ */ jsx(Text, {
              as: "h2",
              variant: "headingSm",
              children: "All Products"
            }), /* @__PURE__ */ jsx(InfoButton, {
              content: "All products from your Shopify store. Click a product name to edit its pet profile. Products without a profile show '-' in the Pet Type column."
            })]
          }), /* @__PURE__ */ jsx(InlineStack, {
            gap: "200",
            children: /* @__PURE__ */ jsxs(Text, {
              as: "span",
              variant: "bodySm",
              tone: "subdued",
              children: ["Page ", pageNum]
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            paddingBottom: "0.75rem"
          },
          children: /* @__PURE__ */ jsx(TextField, {
            label: "Search products",
            labelHidden: true,
            placeholder: "Search by title, pet type, or status…",
            value: searchQuery,
            onChange: setSearchQuery,
            autoComplete: "off",
            clearButton: true,
            onClearButtonClick: () => setSearchQuery("")
          })
        }), /* @__PURE__ */ jsx(DataTable, {
          columnContentTypes: ["text", "text", "text"],
          headings: ["Title", "Pet Type", "Status"],
          rows: filteredRows
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "1rem"
          },
          children: [/* @__PURE__ */ jsx(Button, {
            onClick: goPrev,
            disabled: !hasPrev,
            children: "Previous"
          }), /* @__PURE__ */ jsx(Button, {
            onClick: goNext,
            disabled: !hasNext,
            children: "Next"
          })]
        })]
      }), profileMap.size > 40 && /* @__PURE__ */ jsx(Banner, {
        tone: "warning",
        children: /* @__PURE__ */ jsxs(Text, {
          as: "p",
          children: ["You have ", profileMap.size, " of ", FREE_PET_LIMIT, " pet profiles used. Upgrade to Pro for unlimited."]
        })
      }), selected && selProduct && /* @__PURE__ */ jsx(EditProfileForm, {
        product: selProduct,
        profile: selProfile,
        fieldInfo,
        fetcher,
        onDelete: () => {
          const form = new FormData();
          form.append("intent", "delete");
          form.append("productId", selected);
          fetcher.submit(form, {
            method: "POST"
          });
        }
      })]
    })
  });
});
const ErrorBoundary$4 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary6() {
  return boundary.error(useRouteError());
});
const headers$4 = (h) => boundary.headers(h);
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$4,
  action: action$4,
  default: app_products,
  headers: headers$4,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
function SettingsSkeleton() {
  return /* @__PURE__ */ jsxs("div", { style: { maxWidth: 640, margin: "0 auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          background: "var(--t-color-bg-surface)",
          borderRadius: "8px",
          boxShadow: "0 0 0 1px var(--t-color-border-secondary)",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "1rem 1rem 0 1rem" }, children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                height: "1.25rem",
                width: "180px",
                background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                backgroundSize: "200% 100%",
                borderRadius: "4px",
                animation: "shimmer 1.5s ease-in-out infinite"
              }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 480 }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  height: "1.25rem",
                  width: "220px",
                  background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                  backgroundSize: "200% 100%",
                  borderRadius: "4px",
                  animation: "shimmer 1.5s ease-in-out infinite"
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.25rem" }, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "0.875rem",
                    width: "100px",
                    background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "4px",
                    animation: "shimmer 1.5s ease-in-out infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "32px",
                    width: "40px",
                    background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "6px",
                    animation: "shimmer 1.5s ease-in-out infinite"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.25rem" }, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "0.875rem",
                    width: "90px",
                    background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "4px",
                    animation: "shimmer 1.5s ease-in-out infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "2.25rem",
                    width: "100%",
                    background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "6px",
                    animation: "shimmer 1.5s ease-in-out infinite"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.25rem" }, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "0.875rem",
                    width: "110px",
                    background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "4px",
                    animation: "shimmer 1.5s ease-in-out infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "2.25rem",
                    width: "100%",
                    background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "6px",
                    animation: "shimmer 1.5s ease-in-out infinite"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  height: "2.25rem",
                  width: "120px",
                  background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                  backgroundSize: "200% 100%",
                  borderRadius: "6px",
                  animation: "shimmer 1.5s ease-in-out infinite"
                }
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          background: "var(--t-color-bg-surface)",
          borderRadius: "8px",
          boxShadow: "0 0 0 1px var(--t-color-border-secondary)",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: { padding: "1rem 1rem 0 1rem" }, children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                height: "1.25rem",
                width: "100px",
                background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                backgroundSize: "200% 100%",
                borderRadius: "4px",
                animation: "shimmer 1.5s ease-in-out infinite"
              }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  height: "1rem",
                  width: "140px",
                  background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                  backgroundSize: "200% 100%",
                  borderRadius: "4px",
                  animation: "shimmer 1.5s ease-in-out infinite"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  height: "1rem",
                  width: "200px",
                  background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                  backgroundSize: "200% 100%",
                  borderRadius: "4px",
                  animation: "shimmer 1.5s ease-in-out infinite"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  height: "1rem",
                  width: "160px",
                  background: "linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)",
                  backgroundSize: "200% 100%",
                  borderRadius: "4px",
                  animation: "shimmer 1.5s ease-in-out infinite"
                }
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      ` })
  ] });
}
const loader$4 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  return getSettings(session.shop);
};
const action$3 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const fd = await request.formData();
  await updateSettings(session.shop, {
    badgeEnabled: fd.get("badgeEnabled") === "true",
    badgeColor: fd.get("badgeColor"),
    badgeText: fd.get("badgeText"),
    buttonLabel: fd.get("buttonLabel"),
    petButtonEnabled: fd.get("petButtonEnabled") === "true",
    petButtonColor: fd.get("petButtonColor"),
    petButtonAnimation: fd.get("petButtonAnimation"),
    petButtonPosition: fd.get("petButtonPosition"),
    petButtonBottomOffset: parseInt(fd.get("petButtonBottomOffset"), 10) || 24
  });
  return {
    success: true
  };
};
const app_settings = UNSAFE_withComponentProps(function Settings() {
  const settings = useLoaderData();
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return /* @__PURE__ */ jsx(SettingsSkeleton, {});
  }
  const fetcher = useFetcher();
  const shopify2 = useAppBridge();
  const formRef = useRef(null);
  useEffect(() => {
    var _a2;
    if ((_a2 = fetcher.data) == null ? void 0 : _a2.success) shopify2.toast.show("Settings saved");
  }, [fetcher.data, shopify2]);
  const [badgeEnabled, setBadgeEnabled] = useState(settings.badgeEnabled);
  const [badgeColor, setBadgeColor] = useState(settings.badgeColor);
  const [badgeText, setBadgeText] = useState(settings.badgeText || "");
  const [buttonLabel, setButtonLabel] = useState(settings.buttonLabel || "");
  const [petButtonEnabled, setPetButtonEnabled] = useState(settings.petButtonEnabled);
  const [petButtonColor, setPetButtonColor] = useState(settings.petButtonColor);
  const [petButtonAnimation, setPetButtonAnimation] = useState(settings.petButtonAnimation);
  const [petButtonPosition, setPetButtonPosition] = useState(settings.petButtonPosition);
  const [petButtonBottomOffset, setPetButtonBottomOffset] = useState(settings.petButtonBottomOffset);
  const isDirty = fieldChanged(badgeEnabled, settings.badgeEnabled) || fieldChanged(badgeColor, settings.badgeColor) || fieldChanged(badgeText, settings.badgeText) || fieldChanged(buttonLabel, settings.buttonLabel) || fieldChanged(petButtonEnabled, settings.petButtonEnabled) || fieldChanged(petButtonColor, settings.petButtonColor) || fieldChanged(petButtonAnimation, settings.petButtonAnimation) || fieldChanged(petButtonPosition, settings.petButtonPosition) || fieldChanged(petButtonBottomOffset, settings.petButtonBottomOffset);
  function handleSave() {
    var _a2;
    (_a2 = formRef.current) == null ? void 0 : _a2.requestSubmit();
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
  useContextualSaveBar(shopify2, isDirty, handleSave, handleDiscard);
  return /* @__PURE__ */ jsx(Page, {
    title: "Settings",
    children: /* @__PURE__ */ jsx(fetcher.Form, {
      method: "POST",
      ref: formRef,
      children: /* @__PURE__ */ jsxs(BlockStack, {
        gap: "400",
        children: [/* @__PURE__ */ jsxs(Card, {
          roundedAbove: "sm",
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center"
            },
            children: [/* @__PURE__ */ jsx(Icon, {
              source: ShippingLabelIcon,
              tone: "base"
            }), /* @__PURE__ */ jsx("div", {
              style: {
                flex: 1,
                textAlign: "center"
              },
              children: /* @__PURE__ */ jsx(Text, {
                as: "h2",
                variant: "headingSm",
                children: "Storefront Badge"
              })
            }), /* @__PURE__ */ jsx(InfoButton, {
              content: "Configure the pet compatibility badge shown on your storefront product pages."
            })]
          }), /* @__PURE__ */ jsxs(BlockStack, {
            gap: "300",
            children: [/* @__PURE__ */ jsx(Checkbox, {
              label: "Show pet badge on product pages",
              checked: badgeEnabled,
              onChange: (v) => setBadgeEnabled(v),
              name: "badgeEnabled",
              value: "true"
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              },
              children: [/* @__PURE__ */ jsx(Text, {
                as: "label",
                variant: "bodyMd",
                fontWeight: "medium",
                children: "Badge Color"
              }), /* @__PURE__ */ jsx("input", {
                type: "color",
                name: "badgeColor",
                value: badgeColor,
                onChange: (e) => setBadgeColor(e.target.value),
                style: {
                  width: "40px",
                  height: "32px",
                  padding: 0,
                  border: "1px solid var(--p-color-input-border)",
                  borderRadius: "var(--p-border-radius-200)",
                  cursor: "pointer"
                }
              }), /* @__PURE__ */ jsx(Text, {
                as: "span",
                variant: "bodySm",
                tone: "subdued",
                children: badgeColor
              })]
            }), /* @__PURE__ */ jsx(TextField, {
              label: "Badge Text",
              name: "badgeText",
              value: badgeText,
              onChange: (v) => setBadgeText(v),
              helpText: "Text displayed on the badge",
              autoComplete: "off"
            }), /* @__PURE__ */ jsx(TextField, {
              label: "Button Label",
              name: "buttonLabel",
              value: buttonLabel,
              onChange: (v) => setButtonLabel(v),
              helpText: "'Find Compatible Friends' button text",
              autoComplete: "off"
            })]
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          roundedAbove: "sm",
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center"
            },
            children: [/* @__PURE__ */ jsx(Icon, {
              source: HeartIcon,
              tone: "base"
            }), /* @__PURE__ */ jsx("div", {
              style: {
                flex: 1,
                textAlign: "center"
              },
              children: /* @__PURE__ */ jsx(Text, {
                as: "h2",
                variant: "headingSm",
                children: "Pet Creation Button"
              })
            }), /* @__PURE__ */ jsx(InfoButton, {
              content: "Configure the floating pet creation button on your storefront. Customers can add and manage pet profiles."
            })]
          }), /* @__PURE__ */ jsxs(BlockStack, {
            gap: "300",
            children: [/* @__PURE__ */ jsx(Checkbox, {
              label: "Show floating pet creation button",
              checked: petButtonEnabled,
              onChange: (v) => setPetButtonEnabled(v),
              name: "petButtonEnabled",
              value: "true"
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              },
              children: [/* @__PURE__ */ jsx(Text, {
                as: "label",
                variant: "bodyMd",
                fontWeight: "medium",
                children: "Button Color"
              }), /* @__PURE__ */ jsx("input", {
                type: "color",
                name: "petButtonColor",
                value: petButtonColor,
                onChange: (e) => setPetButtonColor(e.target.value),
                style: {
                  width: "40px",
                  height: "32px",
                  padding: 0,
                  border: "1px solid var(--p-color-input-border)",
                  borderRadius: "var(--p-border-radius-200)",
                  cursor: "pointer"
                }
              }), /* @__PURE__ */ jsx(Text, {
                as: "span",
                variant: "bodySm",
                tone: "subdued",
                children: petButtonColor
              })]
            }), /* @__PURE__ */ jsx(Select, {
              label: "Animation",
              name: "petButtonAnimation",
              value: petButtonAnimation,
              onChange: (v) => setPetButtonAnimation(v),
              options: [{
                label: "Pulse (default)",
                value: "pulse"
              }, {
                label: "Bounce",
                value: "bounce"
              }, {
                label: "Glow",
                value: "glow"
              }, {
                label: "None",
                value: "none"
              }]
            }), /* @__PURE__ */ jsx(Select, {
              label: "Position",
              name: "petButtonPosition",
              value: petButtonPosition,
              onChange: (v) => setPetButtonPosition(v),
              options: [{
                label: "Bottom Right",
                value: "right"
              }, {
                label: "Bottom Left",
                value: "left"
              }]
            }), /* @__PURE__ */ jsx(TextField, {
              label: "Bottom Offset (px)",
              name: "petButtonBottomOffset",
              value: String(petButtonBottomOffset),
              onChange: (v) => setPetButtonBottomOffset(parseInt(v, 10) || 24),
              type: "number",
              helpText: "Distance from the bottom of the screen",
              autoComplete: "off"
            })]
          })]
        })]
      })
    })
  });
});
const ErrorBoundary$3 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary7() {
  return boundary.error(useRouteError());
});
const headers$3 = (h) => boundary.headers(h);
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$3,
  action: action$3,
  default: app_settings,
  headers: headers$3,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_SAFETY_THRESHOLD = 200;
class ThrottledGraphQLClient {
  constructor(config = {}) {
    __publicField(this, "costStore", /* @__PURE__ */ new Map());
    __publicField(this, "queue", []);
    __publicField(this, "processing", false);
    __publicField(this, "safetyThreshold");
    __publicField(this, "enableLogging");
    this.safetyThreshold = config.safetyThreshold ?? DEFAULT_SAFETY_THRESHOLD;
    this.enableLogging = config.enableLogging ?? process.env.NODE_ENV !== "production";
  }
  /** Execute a GraphQL query with cost-aware throttle management. */
  async query(admin, query, variables) {
    var _a2;
    await this.waitInQueue();
    const shop = this.getShopIdentifier(admin);
    await this.applyThrottleWait(shop);
    const startTime = Date.now();
    const response = await admin.graphql(query, { variables });
    const text = await response.text();
    let cost = null;
    try {
      const parsed = JSON.parse(text);
      if ((_a2 = parsed == null ? void 0 : parsed.extensions) == null ? void 0 : _a2.cost) {
        cost = parsed.extensions.cost;
        this.updateCostState(shop, cost);
      }
    } catch {
    }
    if (this.enableLogging) {
      const elapsed = Date.now() - startTime;
      const costMsg = cost ? `cost=${cost.actualQueryCost ?? cost.requestedQueryCost}pts avail=${cost.throttleStatus.currentlyAvailable}/${cost.throttleStatus.maximumAvailable}` : "cost=unknown";
      console.log(`[ThrottledGraphQL] ${elapsed}ms ${costMsg}`);
    }
    return { json: JSON.parse(text), cost };
  }
  /** Execute a mutation — same as query but shorthand. */
  async mutate(admin, mutation, variables) {
    return this.query(admin, mutation, variables);
  }
  // === PRIVATE ===
  getShopIdentifier(admin) {
    var _a2;
    try {
      return ((_a2 = admin == null ? void 0 : admin.session) == null ? void 0 : _a2.shop) ?? "default";
    } catch {
      return "default";
    }
  }
  getCostState(shop) {
    if (!this.costStore.has(shop)) {
      this.costStore.set(shop, {
        currentlyAvailable: 1e3,
        maximumAvailable: 1e3,
        restoreRate: 50,
        lastRequestedAt: Date.now(),
        safetyThreshold: this.safetyThreshold
      });
    }
    return this.costStore.get(shop);
  }
  updateCostState(shop, cost) {
    const state = this.getCostState(shop);
    state.currentlyAvailable = cost.throttleStatus.currentlyAvailable;
    state.maximumAvailable = cost.throttleStatus.maximumAvailable;
    state.restoreRate = cost.throttleStatus.restoreRate;
    state.lastRequestedAt = Date.now();
  }
  /**
   * Calculate throttle wait using the official Shopify formula:
   *   T_sleep(ms) = ((SafetyThreshold - CurrentlyAvailable) / RestoreRate) × 1000
   */
  async applyThrottleWait(shop) {
    const state = this.getCostState(shop);
    const now = Date.now();
    const elapsedMs = now - state.lastRequestedAt;
    const restorePerMs = state.restoreRate / 1e3;
    const restoredPoints = Math.floor(elapsedMs * restorePerMs);
    const available = Math.min(
      state.maximumAvailable,
      state.currentlyAvailable + restoredPoints
    );
    if (available < this.safetyThreshold) {
      const neededPoints = this.safetyThreshold - available;
      const waitMs = Math.ceil(neededPoints / state.restoreRate * 1e3);
      if (this.enableLogging) {
        console.log(
          `[ThrottledGraphQL] Throttling: available=${available}, threshold=${this.safetyThreshold}, waiting=${waitMs}ms`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  /** Queue management — serial execution. */
  async waitInQueue() {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve: () => resolve(), reject });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }
  async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        item.resolve();
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    this.processing = false;
  }
}
let instance = null;
function getThrottledGraphQLClient(config) {
  if (!instance) {
    instance = new ThrottledGraphQLClient(config);
  }
  return instance;
}
const BURST_WINDOW_MS = 1e4;
const HIGH_COST_THRESHOLD = 500;
class CostProfiler {
  constructor(maxSamples = 1e3) {
    __publicField(this, "samples", []);
    __publicField(this, "burstWindows", /* @__PURE__ */ new Map());
    __publicField(this, "maxSamples");
    this.maxSamples = maxSamples;
  }
  /** Record a query cost sample. */
  record(queryName, requestedCost, actualCost, shop) {
    const sample = {
      queryName,
      requestedCost,
      actualCost,
      timestamp: Date.now(),
      shop
    };
    this.samples.push(sample);
    const windowKey = Math.floor(sample.timestamp / BURST_WINDOW_MS);
    const current = this.burstWindows.get(windowKey) ?? 0;
    this.burstWindows.set(windowKey, current + (actualCost ?? requestedCost));
    if (this.samples.length > this.maxSamples) {
      this.samples = this.samples.slice(-this.maxSamples);
    }
  }
  /** Get a summary of all profiled costs. */
  getSummary() {
    const costs = this.samples.filter((s) => s.actualCost !== null);
    const requestedCosts = this.samples.map((s) => s.requestedCost);
    return {
      totalQueries: this.samples.length,
      totalRequestedCost: requestedCosts.reduce((a, b) => a + b, 0),
      totalActualCost: costs.length > 0 ? costs.reduce((a, b) => a + (b.actualCost ?? 0), 0) : 0,
      avgRequestedCost: requestedCosts.length > 0 ? Math.round(requestedCosts.reduce((a, b) => a + b, 0) / requestedCosts.length) : 0,
      maxRequestedCost: requestedCosts.length > 0 ? Math.max(...requestedCosts) : 0,
      peakBurstCost: Math.max(...this.burstWindows.values(), 0),
      queriesOverThreshold: this.samples.filter((s) => s.requestedCost >= HIGH_COST_THRESHOLD).length
    };
  }
  /** Estimate the cost of a query before executing it. */
  estimateCost(query, variables) {
    const isMutation = /^\s*mutation\b/im.test(query);
    let totalCost = isMutation ? 10 : 0;
    const firstMatches = query.matchAll(/\bfirst\s*:\s*\$?(\w+)/g);
    for (const match of firstMatches) {
      const value = (variables == null ? void 0 : variables[match[1]]) ?? parseInt(match[1], 10);
      const firstOrLast = typeof value === "number" ? value : 50;
      totalCost += 2 + firstOrLast;
    }
    const lastMatches = query.matchAll(/\blast\s*:\s*\$?(\w+)/g);
    for (const match of lastMatches) {
      const value = (variables == null ? void 0 : variables[match[1]]) ?? parseInt(match[1], 10);
      const firstOrLast = typeof value === "number" ? value : 50;
      totalCost += 2 + firstOrLast;
    }
    return totalCost;
  }
  /** Check if a query exceeds the safety threshold (200pts). */
  isSafe(query, variables) {
    return this.estimateCost(query, variables) <= 200;
  }
  /** Export all samples for debugging. */
  export() {
    return [...this.samples];
  }
  /** Reset all recorded data. */
  reset() {
    this.samples = [];
    this.burstWindows.clear();
  }
}
let costProfiler = null;
function getCostProfiler() {
  if (!costProfiler) {
    costProfiler = new CostProfiler();
  }
  return costProfiler;
}
const gql = getThrottledGraphQLClient();
const profiler = getCostProfiler();
const cache = getResponseCache();
const TRIAL_DAYS = 14;
const pendingCharges = /* @__PURE__ */ new Map();
async function getBillingUrl(admin, shop, origin) {
  var _a2, _b, _c, _d;
  const returnUrl = `${origin || process.env.SHOPIFY_APP_URL}/app/billing/callback`;
  const { json: rawJson, cost } = await gql.mutate(admin, `#graphql
    mutation CreateBilling($name: String!, $price: MoneyInput!, $returnUrl: URL!, $test: Boolean) {
      appPurchaseOneTimeCreate(name: $name, price: $price, returnUrl: $returnUrl, test: $test) {
        appPurchaseOneTime { id name price { amount currencyCode } }
        confirmationUrl
        userErrors { field message }
      }
    }`, {
    name: "PetFilter Pro",
    price: { amount: 9.99, currencyCode: "USD" },
    returnUrl,
    test: true
  });
  if (cost) {
    profiler.record("CreateBilling", cost.requestedQueryCost, cost.actualQueryCost, shop);
  }
  const result = (_a2 = rawJson == null ? void 0 : rawJson.data) == null ? void 0 : _a2.appPurchaseOneTimeCreate;
  if ((_b = result == null ? void 0 : result.userErrors) == null ? void 0 : _b.length) {
    console.error("[Billing] userErrors:", JSON.stringify(result.userErrors));
  }
  if ((_c = result == null ? void 0 : result.appPurchaseOneTime) == null ? void 0 : _c.id) {
    const chargeId = result.appPurchaseOneTime.id.split("/").pop();
    if (chargeId) {
      pendingCharges.set(chargeId, { shop, chargeId, timestamp: Date.now() });
      setTimeout(() => pendingCharges.delete(chargeId), 30 * 60 * 1e3);
      console.log("[Billing] Stored pending charge:", { shop, chargeId });
    }
  }
  console.log("[Billing] confirmationUrl:", result == null ? void 0 : result.confirmationUrl, "appPurchaseOneTime:", (_d = result == null ? void 0 : result.appPurchaseOneTime) == null ? void 0 : _d.id);
  return (result == null ? void 0 : result.confirmationUrl) || null;
}
function getPendingShop(chargeId) {
  const entry2 = pendingCharges.get(chargeId);
  return entry2 == null ? void 0 : entry2.shop;
}
async function checkSubscription(shop) {
  return cache.getOrCompute(
    CacheKeys.shopSettings(shop),
    async () => {
      const settings = await prisma.shopSettings.findUnique({ where: { shop } });
      if (!settings) return { isTrialing: false, isSubscribed: false, daysLeft: 0 };
      if (settings.billingPlan === "pro" && settings.subscriptionId) {
        return { isTrialing: false, isSubscribed: true, daysLeft: null };
      }
      if (settings.trialEndsAt) {
        const daysLeft = Math.max(0, Math.ceil((settings.trialEndsAt.getTime() - Date.now()) / 864e5));
        return { isTrialing: true, isSubscribed: false, daysLeft };
      }
      return { isTrialing: false, isSubscribed: false, daysLeft: 0 };
    },
    CacheTier.LONG,
    { revalidate: true }
  );
}
async function startTrial(shop) {
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 864e5);
  await prisma.shopSettings.upsert({
    where: { shop },
    update: { trialEndsAt, billingPlan: "trial" },
    create: { shop, trialEndsAt, billingPlan: "trial" }
  });
  cache.invalidate(CacheKeys.shopSettings(shop));
}
async function activatePro(shop, subscriptionId) {
  await prisma.shopSettings.upsert({
    where: { shop },
    update: { billingPlan: "pro", subscriptionId, trialEndsAt: null },
    create: { shop, billingPlan: "pro", subscriptionId }
  });
  cache.invalidate(CacheKeys.shopSettings(shop));
}
const loader$3 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const url = new URL(request.url);
  const success = url.searchParams.get("success");
  const error = url.searchParams.get("error");
  return {
    subscription: await checkSubscription(session.shop),
    success,
    error
  };
};
const action$2 = async ({
  request
}) => {
  const {
    admin,
    session
  } = await authenticate.admin(request);
  const intent = (await request.formData()).get("intent");
  if (intent === "start-trial") {
    await startTrial(session.shop);
    return {
      success: true,
      intent: "trial"
    };
  }
  if (intent === "upgrade") {
    const confirmationUrl = await getBillingUrl(admin, session.shop, new URL(request.url).origin);
    return {
      success: true,
      intent: "redirect",
      confirmationUrl
    };
  }
  return {
    success: false
  };
};
const app_billing = UNSAFE_withComponentProps(function Billing() {
  const {
    subscription,
    success,
    error
  } = useLoaderData();
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return /* @__PURE__ */ jsx(Page, {
      title: "Billing & Plan",
      children: /* @__PURE__ */ jsx(BlockStack, {
        gap: "400",
        children: /* @__PURE__ */ jsx(Card, {
          roundedAbove: "sm",
          children: /* @__PURE__ */ jsx(BlockStack, {
            gap: "300",
            children: /* @__PURE__ */ jsx(Spinner, {
              size: "large"
            })
          })
        })
      })
    });
  }
  const fetcher = useFetcher();
  const shopify2 = useAppBridge();
  useEffect(() => {
    if (success === "pro_activated") {
      shopify2.toast.show("Welcome to PetFilter Pro! 🎉");
      window.history.replaceState(null, "", "/app/billing");
    }
  }, [success, shopify2]);
  useEffect(() => {
    if (error) shopify2.toast.show(`Error: ${error}`);
  }, [error, shopify2]);
  useEffect(() => {
    var _a2;
    if (((_a2 = fetcher.data) == null ? void 0 : _a2.success) && fetcher.data.intent === "trial") shopify2.toast.show("14-day trial started!");
  }, [fetcher.data, shopify2]);
  useEffect(() => {
    var _a2;
    if (((_a2 = fetcher.data) == null ? void 0 : _a2.success) && fetcher.data.intent === "redirect" && fetcher.data.confirmationUrl) window.top.location.href = fetcher.data.confirmationUrl;
  }, [fetcher.data]);
  const trialProgress = (subscription == null ? void 0 : subscription.isTrialing) ? Math.max(0, Math.min(100, (14 - (subscription.daysLeft || 14)) / 14 * 100)) : 0;
  const isSubmitting = fetcher.state !== "idle";
  return /* @__PURE__ */ jsx(Page, {
    title: "Billing & Plan",
    children: /* @__PURE__ */ jsxs(Layout$1, {
      children: [/* @__PURE__ */ jsx(Layout$1.Section, {
        children: /* @__PURE__ */ jsxs(Card, {
          roundedAbove: "sm",
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem"
            },
            children: [/* @__PURE__ */ jsx(Icon, {
              source: subscription.isSubscribed ? StarFilledIcon : BillFilledIcon,
              tone: "base"
            }), /* @__PURE__ */ jsx("div", {
              style: {
                flex: 1,
                textAlign: "center"
              },
              children: /* @__PURE__ */ jsx(Text, {
                as: "h2",
                variant: "headingSm",
                children: "Current Plan"
              })
            }), /* @__PURE__ */ jsx(InfoButton, {
              content: "Your current subscription plan and status. Upgrade to Pro for unlimited features."
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              marginTop: "1rem"
            },
            children: subscription.isSubscribed ? /* @__PURE__ */ jsxs(BlockStack, {
              gap: "200",
              children: [/* @__PURE__ */ jsx(Text, {
                as: "h3",
                variant: "headingLg",
                children: "PetFilter Pro"
              }), /* @__PURE__ */ jsx(Text, {
                as: "p",
                variant: "bodyMd",
                children: "You are on the Pro plan with full access to all features."
              }), /* @__PURE__ */ jsx(Badge, {
                tone: "success",
                children: "Active"
              })]
            }) : subscription.isTrialing ? /* @__PURE__ */ jsxs(BlockStack, {
              gap: "200",
              children: [/* @__PURE__ */ jsxs(Text, {
                as: "h3",
                variant: "headingLg",
                children: ["Trial — ", subscription.daysLeft, " days left"]
              }), /* @__PURE__ */ jsx(Text, {
                as: "p",
                variant: "bodyMd",
                tone: "subdued",
                children: "Your 14-day free trial ends soon. Upgrade to keep access."
              }), /* @__PURE__ */ jsx(ProgressBar, {
                progress: trialProgress,
                tone: "highlight"
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  paddingTop: "0.5rem"
                }
              }), /* @__PURE__ */ jsxs(fetcher.Form, {
                method: "POST",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "intent",
                  value: "upgrade"
                }), /* @__PURE__ */ jsx(Button, {
                  submit: true,
                  variant: "primary",
                  disabled: isSubmitting,
                  loading: isSubmitting,
                  children: "Upgrade to Pro — $9.99/mo"
                })]
              })]
            }) : /* @__PURE__ */ jsxs(BlockStack, {
              gap: "300",
              inlineAlign: "center",
              padding: "400",
              children: [/* @__PURE__ */ jsx(Text, {
                as: "h3",
                variant: "headingLg",
                children: "Free Plan"
              }), /* @__PURE__ */ jsx(Text, {
                as: "p",
                variant: "bodyMd",
                tone: "subdued",
                style: {
                  textAlign: "center"
                },
                children: "Start your 14-day free trial to explore all features."
              }), /* @__PURE__ */ jsxs(InlineStack, {
                gap: "300",
                children: [/* @__PURE__ */ jsxs(fetcher.Form, {
                  method: "POST",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "intent",
                    value: "start-trial"
                  }), /* @__PURE__ */ jsx(Button, {
                    submit: true,
                    variant: "primary",
                    disabled: isSubmitting,
                    loading: isSubmitting,
                    children: "Start Free Trial"
                  })]
                }), /* @__PURE__ */ jsxs(fetcher.Form, {
                  method: "POST",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "intent",
                    value: "upgrade"
                  }), /* @__PURE__ */ jsx(Button, {
                    submit: true,
                    disabled: isSubmitting,
                    loading: isSubmitting,
                    children: "Upgrade to Pro"
                  })]
                })]
              })]
            })
          })]
        })
      }), /* @__PURE__ */ jsx(Layout$1.Section, {
        children: /* @__PURE__ */ jsxs("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem"
          },
          children: [/* @__PURE__ */ jsxs(Card, {
            roundedAbove: "sm",
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center",
                padding: "1rem 0"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  color: "var(--p-color-icon-subdued)",
                  marginBottom: "0.5rem"
                },
                children: /* @__PURE__ */ jsx(Icon, {
                  source: GiftCardIcon,
                  tone: "subdued"
                })
              }), /* @__PURE__ */ jsx(Text, {
                as: "h3",
                variant: "headingSm",
                fontWeight: "semibold",
                children: "Free / Trial"
              })]
            }), /* @__PURE__ */ jsxs(List, {
              type: "bullet",
              children: [/* @__PURE__ */ jsx(List.Item, {
                children: "Up to 50 pet profiles"
              }), /* @__PURE__ */ jsx(List.Item, {
                children: "Basic filter rules (5 max)"
              }), /* @__PURE__ */ jsx(List.Item, {
                children: "Storefront pet badges"
              })]
            })]
          }), /* @__PURE__ */ jsxs(Card, {
            roundedAbove: "sm",
            style: {
              border: "2px solid var(--p-color-bg-fill-brand)"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center",
                padding: "1rem 0"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  color: "var(--p-color-icon-brand)",
                  marginBottom: "0.5rem"
                },
                children: /* @__PURE__ */ jsx(Icon, {
                  source: StarFilledIcon,
                  tone: "base"
                })
              }), /* @__PURE__ */ jsx(Text, {
                as: "h3",
                variant: "headingSm",
                fontWeight: "semibold",
                children: "Pro — $9.99/mo"
              }), /* @__PURE__ */ jsx(Badge, {
                tone: "info",
                children: "Recommended"
              })]
            }), /* @__PURE__ */ jsxs(List, {
              type: "bullet",
              children: [/* @__PURE__ */ jsx(List.Item, {
                children: "Unlimited pet profiles"
              }), /* @__PURE__ */ jsx(List.Item, {
                children: "Unlimited filter rules"
              }), /* @__PURE__ */ jsx(List.Item, {
                children: "Advanced matching engine"
              }), /* @__PURE__ */ jsx(List.Item, {
                children: "Custom badge/button styling"
              }), /* @__PURE__ */ jsx(List.Item, {
                children: "Batch operations"
              })]
            })]
          })]
        })
      })]
    })
  });
});
const ErrorBoundary$2 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary8() {
  return boundary.error(useRouteError());
});
const headers$2 = (h) => boundary.headers(h);
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$2,
  action: action$2,
  default: app_billing,
  headers: headers$2,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function getStoreSlug(shop) {
  return shop.replace(/\.myshopify\.com$/, "");
}
function adminUrl(shop, path) {
  return `https://admin.shopify.com/store/${getStoreSlug(shop)}/apps/petfilter${path}`;
}
function verifyHmac(params, secret) {
  const hmac = params.get("hmac");
  if (!hmac) return false;
  const sorted = Array.from(params.entries()).filter(([k]) => k !== "hmac" && k !== "sign").sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("&");
  const expected = crypto__default.createHmac("sha256", secret).update(sorted).digest("hex");
  if (expected.length !== hmac.length) {
    console.error("[billing-callback] HMAC length mismatch");
    return false;
  }
  return crypto__default.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac));
}
function normalizeChargeId(chargeId) {
  if (chargeId.startsWith("gid://")) return chargeId;
  return `gid://shopify/AppPurchaseOneTime/${chargeId}`;
}
const loader$2 = async ({
  request
}) => {
  var _a2, _b;
  const tStart = Date.now();
  const url = new URL(request.url);
  const params = url.searchParams;
  const chargeId = params.get("charge_id");
  let shop = params.get("shop");
  console.log("[billing-callback] Full params:", Object.fromEntries(params.entries()));
  if (!shop && chargeId) {
    shop = getPendingShop(chargeId) || null;
    console.log("[billing-callback] Resolved shop from pending:", shop);
  }
  if (!chargeId || !shop) {
    console.error("[billing-callback] Missing required params", {
      chargeId: !!chargeId,
      shop: !!shop
    });
    const errUrl = shop ? adminUrl(shop, `/app/billing?error=missing_params`) : "/app/billing?error=missing_params";
    return redirect(errUrl);
  }
  const hasHmac = params.has("hmac");
  const secret = process.env.SHOPIFY_API_SECRET || "";
  if (hasHmac && !verifyHmac(params, secret)) {
    console.error("[billing-callback] HMAC verification failed", {
      shop,
      chargeId
    });
    const errUrl = adminUrl(shop, "/app/billing?error=hmac_invalid");
    return redirect(errUrl);
  }
  if (!hasHmac) {
    console.log("[billing-callback] Skipping HMAC (old-style ApplicationCharge, no hmac param)");
  }
  const tHmac = Date.now();
  let admin;
  try {
    const ctx = await unauthenticated.admin(shop);
    admin = ctx.admin;
  } catch (sessionErr) {
    console.error("[billing-callback] Session init failed", {
      shop,
      chargeId,
      error: String(sessionErr)
    });
    return redirect("/app/billing?error=session_failed");
  }
  const gid = normalizeChargeId(chargeId);
  const tAdmin = Date.now();
  let json2;
  try {
    const response = await admin.graphql(`#graphql
      query VerifyPurchase($id: ID!) {
        node(id: $id) {
          ... on AppPurchaseOneTime {
            id
            status
            name
          }
        }
      }`, {
      variables: {
        id: gid
      }
    });
    const text = await response.text();
    json2 = JSON.parse(text);
  } catch (gqlErr) {
    console.error("[billing-callback] GraphQL request failed", {
      shop,
      chargeId,
      gid,
      error: String(gqlErr)
    });
    return redirect("/app/billing?error=graphql_failed");
  }
  const tGraphql = Date.now();
  if (json2.errors) {
    const messages = json2.errors.map((e) => e.message).join("; ");
    console.error("[billing-callback] GraphQL response errors", {
      shop,
      chargeId,
      gid,
      errors: messages
    });
    return redirect("/app/billing?error=graphql_error");
  }
  const cost = (_a2 = json2 == null ? void 0 : json2.extensions) == null ? void 0 : _a2.cost;
  if (cost) {
    const profiler2 = getCostProfiler();
    profiler2.record("VerifyPurchase(callback)", cost.requestedQueryCost, cost.actualQueryCost, shop);
  }
  const purchase = (_b = json2.data) == null ? void 0 : _b.node;
  if (!purchase) {
    console.error("[billing-callback] Purchase not found", {
      shop,
      chargeId,
      gid
    });
    return redirect("/app/billing?error=purchase_not_found");
  }
  if (purchase.status !== "ACTIVE") {
    console.error("[billing-callback] Purchase not active", {
      shop,
      chargeId,
      status: purchase.status
    });
    return redirect(`/app/billing?error=purchase_${purchase.status.toLowerCase()}`);
  }
  try {
    await activatePro(shop, chargeId);
  } catch (dbErr) {
    console.error("[billing-callback] DB activation failed", {
      shop,
      chargeId,
      error: String(dbErr)
    });
    return redirect("/app/billing?error=activation_failed");
  }
  const tEnd = Date.now();
  console.log("[billing-callback] Latency profile", {
    shop,
    chargeId,
    total: tEnd - tStart,
    hmacVerify: tHmac - tStart,
    sessionInit: tAdmin - tHmac,
    graphqlQuery: tGraphql - tAdmin,
    dbWrite: tEnd - tGraphql,
    graphqlCost: cost ? `${cost.actualQueryCost ?? cost.requestedQueryCost}pts (${cost.throttleStatus.currentlyAvailable}/${cost.throttleStatus.maximumAvailable} avail)` : "unknown"
  });
  return redirect(adminUrl(shop, "/app/billing?success=pro_activated"));
};
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function getDashboardStats(shop) {
  const [totalPets, totalRules, activeRules] = await Promise.all([
    prisma.petProfile.count({ where: { shop } }),
    prisma.filterRule.count({ where: { shop } }),
    prisma.filterRule.count({ where: { shop, isActive: true } })
  ]);
  const settings = await prisma.shopSettings.findUnique({ where: { shop } });
  return { totalPets, totalRules, activeRules, totalMatches: 0, settings };
}
async function getRecentPets(shop, limit = 5) {
  return prisma.petProfile.findMany({ where: { shop }, orderBy: { createdAt: "desc" }, take: limit });
}
async function getRecentRules(shop, limit = 5) {
  return prisma.filterRule.findMany({ where: { shop }, orderBy: { updatedAt: "desc" }, take: limit });
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }, children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { style: { background: "var(--t-color-bg-surface)", borderRadius: "8px", boxShadow: "0 0 0 1px var(--t-color-border-secondary)", padding: "1rem" }, children: [
      /* @__PURE__ */ jsx("div", { style: { height: "12px", width: "60%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.5rem" } }),
      /* @__PURE__ */ jsx("div", { style: { height: "32px", width: "40%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.25rem" } }),
      /* @__PURE__ */ jsx("div", { style: { height: "14px", width: "50%", background: "var(--t-color-bg-fill)", borderRadius: "4px" } })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { style: { background: "var(--t-color-bg-surface)", borderRadius: "8px", boxShadow: "0 0 0 1px var(--t-color-border-secondary)", padding: "1rem" }, children: [
      /* @__PURE__ */ jsx("div", { style: { height: "16px", width: "30%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "1rem" } }),
      [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { style: { height: "14px", width: `${70 - i * 10}%`, background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.5rem" } }, i))
    ] })
  ] });
}
const steps = [
  {
    icon: CollectionIcon,
    title: "Products",
    description: "Add pet profiles to your products. Set pet type, breed, size, temperament, and more. Each product can have detailed pet information for accurate matching."
  },
  {
    icon: FilterIcon,
    title: "Filter Rules",
    description: "Create rules to define which pets are compatible. Filter by species, size, age, temperament, dietary needs, and health status. Rules run automatically on your storefront."
  },
  {
    icon: StarFilledIcon,
    title: "Matching Engine",
    description: "Test your rules against your pet profiles. See compatibility scores and which criteria matched. Perfect your filters before they go live on your store."
  },
  {
    icon: SettingsIcon,
    title: "Settings",
    description: "Customize the 'Pet Friendly' badge and button that appears on your product pages. Choose colors and text that match your store's branding."
  },
  {
    icon: BillFilledIcon,
    title: "Billing & Plans",
    description: "Start with a 14-day free trial. Upgrade to Pro for unlimited profiles, rules, and advanced matching features."
  }
];
function WelcomeModal({ open, onDismiss }) {
  const fetcher = useFetcher();
  const handleDismiss = useCallback(() => {
    fetcher.submit({ intent: "dismiss-welcome" }, { method: "POST" });
    onDismiss();
  }, [fetcher, onDismiss]);
  return /* @__PURE__ */ jsx(
    Modal,
    {
      open,
      onClose: handleDismiss,
      title: "Welcome to PetFilter! 🐾",
      primaryAction: {
        content: "Let's Get Started",
        onAction: handleDismiss
      },
      large: true,
      children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: "PetFilter helps your customers find the perfect pet match. Here's a quick tour of what you can do:" }),
        steps.map((step, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              gap: "1rem",
              padding: "1rem",
              borderRadius: "var(--p-border-radius-200)",
              background: i % 2 === 0 ? "var(--p-color-bg-surface-secondary)" : "transparent"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--p-border-radius-200)",
                    background: "var(--p-color-bg-fill-brand)",
                    color: "var(--p-color-text-on-color)",
                    flexShrink: 0
                  },
                  children: /* @__PURE__ */ jsx(step.icon, { width: 20, height: 20, fill: "white" })
                }
              ),
              /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                /* @__PURE__ */ jsxs(Text, { as: "h3", variant: "headingSm", fontWeight: "semibold", children: [
                  i + 1,
                  ". ",
                  step.title
                ] }),
                /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: step.description })
              ] })
            ]
          },
          i
        ))
      ] }) })
    }
  );
}
function StatCard({
  value,
  label,
  subtitle,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", {
    style: {
      flex: 1,
      borderRadius: "var(--p-border-radius-300)",
      border: "1px solid var(--p-color-border-subdued)",
      padding: "1.25rem 1.5rem",
      background: "var(--p-color-bg-surface)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "default"
    },
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "var(--p-shadow-400)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    },
    children: [/* @__PURE__ */ jsx("div", {
      style: {
        width: 24,
        height: 24,
        marginBottom: "0.75rem"
      },
      children: /* @__PURE__ */ jsx(Icon, {
        source: icon
      })
    }), /* @__PURE__ */ jsx(Text, {
      as: "p",
      variant: "heading2xl",
      fontWeight: "bold",
      children: value
    }), /* @__PURE__ */ jsxs(BlockStack, {
      gap: "0",
      children: [/* @__PURE__ */ jsx(Text, {
        as: "span",
        variant: "bodyMd",
        fontWeight: "medium",
        children: label
      }), subtitle && /* @__PURE__ */ jsx(Text, {
        as: "span",
        variant: "bodySm",
        tone: "subdued",
        children: subtitle
      })]
    })]
  });
}
const action$1 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const fd = await request.formData();
  if (fd.get("intent") === "dismiss-welcome") {
    await updateSettings(session.shop, {
      hasSeenWelcome: true
    });
  }
  return {
    success: true
  };
};
const loader$1 = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const shop = session.shop;
  const [stats, recentPets, recentRules] = await Promise.all([getDashboardStats(shop), getRecentPets(shop), getRecentRules(shop)]);
  if (!stats.settings || stats.settings.hasCompletedOnboarding === false) {
    return redirect("/app/onboarding");
  }
  return {
    stats,
    recentPets,
    recentRules
  };
};
const app__index = UNSAFE_withComponentProps(function Dashboard() {
  var _a2, _b, _c, _d, _e;
  const navigation = useNavigation();
  const navigate = useNavigate();
  const {
    stats,
    recentPets,
    recentRules
  } = useLoaderData();
  const [welcomeOpen, setWelcomeOpen] = useState(((_a2 = stats.settings) == null ? void 0 : _a2.hasSeenWelcome) === false);
  if (navigation.state === "loading") {
    return /* @__PURE__ */ jsx(DashboardSkeleton, {});
  }
  const planLabel = ((_b = stats.settings) == null ? void 0 : _b.billingPlan) === "pro" ? "Pro" : ((_c = stats.settings) == null ? void 0 : _c.billingPlan) === "trial" ? "Trial" : "Free";
  const planStatus = ((_d = stats.settings) == null ? void 0 : _d.billingPlan) === "pro" ? "Active" : "Upgrade available";
  const recentPetRows = recentPets.map((p) => [p.productTitle || p.productId.split("/").pop() || p.productId, p.petType ? p.petType.charAt(0).toUpperCase() + p.petType.slice(1) : "—", p.breed || "—", p.size || "—"]);
  const recentRuleRows = recentRules.map((r) => [r.name, r.petType ? r.petType.charAt(0).toUpperCase() + r.petType.slice(1) : "Any", /* @__PURE__ */ jsx(Badge, {
    tone: r.isActive ? "success" : "default",
    children: r.isActive ? "Active" : "Inactive"
  }, r.id)]);
  return /* @__PURE__ */ jsxs(Page, {
    title: "Dashboard",
    children: [/* @__PURE__ */ jsx(WelcomeModal, {
      open: welcomeOpen,
      onDismiss: () => setWelcomeOpen(false)
    }), /* @__PURE__ */ jsxs(BlockStack, {
      gap: "400",
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        },
        children: [/* @__PURE__ */ jsx(StatCard, {
          value: stats.totalPets,
          label: "Products",
          subtitle: "products registered",
          icon: CollectionIcon
        }), /* @__PURE__ */ jsx(StatCard, {
          value: stats.totalRules,
          label: "Filter Rules",
          subtitle: `${stats.activeRules} active`,
          icon: FilterIcon
        }), /* @__PURE__ */ jsx(StatCard, {
          value: stats.totalMatches,
          label: "Matches",
          subtitle: "all time",
          icon: StarFilledIcon
        }), /* @__PURE__ */ jsx(StatCard, {
          value: planLabel,
          label: "Plan",
          subtitle: planStatus,
          icon: BillFilledIcon
        })]
      }), /* @__PURE__ */ jsx(Card, {
        roundedAbove: "sm",
        children: /* @__PURE__ */ jsxs(BlockStack, {
          gap: "300",
          children: [/* @__PURE__ */ jsxs(InlineStack, {
            gap: "100",
            blockAlign: "center",
            children: [/* @__PURE__ */ jsx(Text, {
              as: "h2",
              variant: "headingMd",
              fontWeight: "semibold",
              children: "Quick Actions"
            }), /* @__PURE__ */ jsx(InfoButton, {
              content: "Shortcuts to the most common tasks in PetFilter."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap"
            },
            children: [/* @__PURE__ */ jsx(Button, {
              onClick: () => navigate("/app/products"),
              variant: "secondary",
              children: "Add Pet Profile"
            }), /* @__PURE__ */ jsx(Button, {
              onClick: () => navigate("/app/rules"),
              variant: "secondary",
              children: "Create Filter Rule"
            }), /* @__PURE__ */ jsx(Button, {
              onClick: () => navigate("/app/matching"),
              variant: "secondary",
              children: "Run Matching"
            }), /* @__PURE__ */ jsx(Button, {
              onClick: () => navigate("/app/onboarding"),
              variant: "primary",
              children: "Storefront Setup Guide"
            }), /* @__PURE__ */ jsx(Button, {
              onClick: () => setWelcomeOpen(true),
              variant: "secondary",
              children: "Welcome Guide"
            })]
          })]
        })
      }), /* @__PURE__ */ jsxs(Card, {
        roundedAbove: "sm",
        children: [/* @__PURE__ */ jsxs(InlineStack, {
          gap: "200",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsx(Text, {
            as: "h2",
            variant: "headingSm",
            children: "Recent Profiles"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: "The most recently created pet profiles on your products. Click Products to manage them."
          })]
        }), recentPets.length === 0 ? /* @__PURE__ */ jsx("div", {
          style: {
            padding: "1.5rem",
            textAlign: "center"
          },
          children: /* @__PURE__ */ jsx(Text, {
            as: "p",
            variant: "bodyMd",
            tone: "subdued",
            children: "No pets yet. Start by adding pet profiles to your products."
          })
        }) : /* @__PURE__ */ jsx(DataTable, {
          columnContentTypes: ["text", "text", "text", "text"],
          headings: ["Product", "Type", "Breed", "Size"],
          rows: recentPetRows
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        roundedAbove: "sm",
        children: [/* @__PURE__ */ jsxs(InlineStack, {
          gap: "200",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsx(Text, {
            as: "h2",
            variant: "headingSm",
            children: "Recent Rules"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: "Your most recently created or updated filter rules. Click Filter Rules to manage them."
          })]
        }), recentRules.length === 0 ? /* @__PURE__ */ jsx("div", {
          style: {
            padding: "1.5rem",
            textAlign: "center"
          },
          children: /* @__PURE__ */ jsx(Text, {
            as: "p",
            variant: "bodyMd",
            tone: "subdued",
            children: "No rules yet. Create filter rules to start matching pets."
          })
        }) : /* @__PURE__ */ jsx(DataTable, {
          columnContentTypes: ["text", "text", "text"],
          headings: ["Name", "Pet Type", "Status"],
          rows: recentRuleRows
        })]
      }), ((_e = stats.settings) == null ? void 0 : _e.billingPlan) !== "pro" && /* @__PURE__ */ jsx(Card, {
        roundedAbove: "sm",
        children: /* @__PURE__ */ jsxs(InlineStack, {
          gap: "300",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsxs(BlockStack, {
            gap: "100",
            children: [/* @__PURE__ */ jsx(Text, {
              as: "h3",
              variant: "headingSm",
              children: "Upgrade to Pro"
            }), /* @__PURE__ */ jsx(Text, {
              as: "p",
              variant: "bodyMd",
              tone: "subdued",
              children: "Unlock unlimited filter rules, advanced matching, and priority support."
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              marginLeft: "auto"
            },
            children: /* @__PURE__ */ jsx(Button, {
              onClick: () => navigate("/app/billing"),
              variant: "primary",
              children: "Upgrade Now"
            })
          })]
        })
      })]
    })]
  });
});
const ErrorBoundary$1 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary9() {
  return boundary.error(useRouteError());
});
const headers$1 = (h) => boundary.headers(h);
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  action: action$1,
  default: app__index,
  headers: headers$1,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function RulesSkeleton() {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { height: "20px", width: "120px", background: "var(--t-color-bg-fill)", borderRadius: "4px" } }),
      /* @__PURE__ */ jsx("div", { style: { height: "36px", width: "100px", background: "var(--t-color-bg-fill)", borderRadius: "6px" } })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { background: "var(--t-color-bg-surface)", borderRadius: "8px", boxShadow: "0 0 0 1px var(--t-color-border-secondary)", overflow: "hidden" }, children: /* @__PURE__ */ jsxs("div", { style: { padding: "1rem" }, children: [
      /* @__PURE__ */ jsx("div", { style: { height: "14px", width: "100%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.75rem" } }),
      [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { style: { height: "14px", width: `${75 - i * 10}%`, background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.5rem" } }, i))
    ] }) })
  ] });
}
const PAGE_SIZE = 20;
const loader = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * PAGE_SIZE;
  return listRulesPaginated(session.shop, skip, PAGE_SIZE);
};
const action = async ({
  request
}) => {
  const {
    session
  } = await authenticate.admin(request);
  const shop = session.shop;
  const fd = await request.formData();
  const intent = fd.get("intent");
  const pick = (k) => {
    const v = fd.get(k);
    return v && v !== "" ? v : void 0;
  };
  const pickNum = (k) => {
    const v = fd.get(k);
    return v && v !== "" ? parseFloat(v) : void 0;
  };
  if (intent === "create") {
    await createRule(shop, {
      name: fd.get("name"),
      description: pick("description"),
      petType: pick("petType"),
      breedFilter: pick("breedFilter"),
      sizeFilter: pick("sizeFilter"),
      ageFilter: pick("ageFilter"),
      dietFilter: pick("dietFilter"),
      temperamentFilter: pick("temperamentFilter"),
      colorFilter: pick("colorFilter"),
      weightMin: pickNum("weightMin"),
      weightMax: pickNum("weightMax"),
      vaccinated: pick("vaccinated") === "true" ? true : pick("vaccinated") === "false" ? false : void 0,
      neutered: pick("neutered") === "true" ? true : pick("neutered") === "false" ? false : void 0,
      isActive: fd.get("isActive") !== "false"
    });
    return {
      success: true,
      intent: "create"
    };
  }
  if (intent === "update") {
    await updateRule(shop, fd.get("id"), {
      name: fd.get("name"),
      description: pick("description"),
      petType: pick("petType"),
      breedFilter: pick("breedFilter"),
      sizeFilter: pick("sizeFilter"),
      ageFilter: pick("ageFilter"),
      dietFilter: pick("dietFilter"),
      temperamentFilter: pick("temperamentFilter"),
      colorFilter: pick("colorFilter"),
      weightMin: pickNum("weightMin"),
      weightMax: pickNum("weightMax"),
      vaccinated: pick("vaccinated") === "true" ? true : pick("vaccinated") === "false" ? false : null,
      neutered: pick("neutered") === "true" ? true : pick("neutered") === "false" ? false : null,
      isActive: fd.get("isActive") !== "false"
    });
    return {
      success: true,
      intent: "update"
    };
  }
  if (intent === "delete") {
    await deleteRule(shop, fd.get("id"));
    return {
      success: true,
      intent: "delete"
    };
  }
  if (intent === "batch-delete") {
    await batchDeleteRules(shop, JSON.parse(fd.get("ids")));
    return {
      success: true,
      intent: "batch-delete"
    };
  }
  return {
    success: false
  };
};
const app_rules = UNSAFE_withComponentProps(function FilterRules() {
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return /* @__PURE__ */ jsx(RulesSkeleton, {});
  }
  const {
    rules,
    total,
    hasNext,
    skip
  } = useLoaderData();
  const fetcher = useFetcher();
  const shopify2 = useAppBridge();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selIds, setSelIds] = useState([]);
  const [openField, setOpenField] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fieldInfo = {
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
    isActive: "Toggle this rule on or off without deleting it."
  };
  const currentPage = Math.floor(skip / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  useEffect(() => {
    var _a2;
    if (!((_a2 = fetcher.data) == null ? void 0 : _a2.success)) return;
    if (fetcher.data.intent === "create") {
      setShowCreate(false);
      shopify2.toast.show("Rule created");
    } else if (fetcher.data.intent === "update") {
      setEditId(null);
      shopify2.toast.show("Rule updated");
    } else if (fetcher.data.intent === "delete") {
      shopify2.toast.show("Rule deleted");
    } else if (fetcher.data.intent === "batch-delete") {
      setSelIds([]);
      shopify2.toast.show("Rules deleted");
    }
  }, [fetcher.data, shopify2]);
  const editRule = editId ? rules.find((r) => r.id === editId) : null;
  const ruleRows = rules.map((r) => [/* @__PURE__ */ jsx("input", {
    type: "checkbox",
    checked: selIds.includes(r.id),
    onChange: (e) => {
      if (e.target.checked) setSelIds([...selIds, r.id]);
      else setSelIds(selIds.filter((i) => i !== r.id));
    },
    style: {
      width: "1rem",
      height: "1rem",
      cursor: "pointer"
    }
  }, `cb-${r.id}`), /* @__PURE__ */ jsx("span", {
    onClick: () => {
      setEditId(r.id);
      setShowCreate(false);
    },
    style: {
      color: "var(--p-color-text-brand)",
      cursor: "pointer",
      fontWeight: 500
    },
    children: r.name
  }, `name-${r.id}`), r.petType || "Any", r.sizeFilter || "Any", r.isActive ? /* @__PURE__ */ jsx(Badge, {
    tone: "success",
    children: "Active"
  }, `status-${r.id}`) : /* @__PURE__ */ jsx(Badge, {
    tone: "default",
    children: "Inactive"
  }, `status-${r.id}`)]);
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return ruleRows;
    const q = searchQuery.toLowerCase();
    return ruleRows.filter((row) => {
      var _a2, _b, _c, _d;
      const name = ((_b = (_a2 = row[1]) == null ? void 0 : _a2.props) == null ? void 0 : _b.children) || "";
      const petType = row[2] || "";
      const size = row[3] || "";
      const status = ((_d = (_c = row[4]) == null ? void 0 : _c.props) == null ? void 0 : _d.children) || "";
      return String(name).toLowerCase().includes(q) || String(petType).toLowerCase().includes(q) || String(size).toLowerCase().includes(q) || String(status).toLowerCase().includes(q);
    });
  }, [ruleRows, searchQuery]);
  function goPage(page) {
    if (page < 1 || page > totalPages) return;
    setSearchParams({
      page: String(page)
    });
    setEditId(null);
    setShowCreate(false);
  }
  function RuleForm({
    rule
  }) {
    var _a2, _b, _c, _d;
    const shopify22 = useAppBridge();
    const formRef = useRef(null);
    const [formName, setFormName] = useState((rule == null ? void 0 : rule.name) || "");
    const [formDesc, setFormDesc] = useState((rule == null ? void 0 : rule.description) || "");
    const [formPetType, setFormPetType] = useState((rule == null ? void 0 : rule.petType) || "");
    const [formBreed, setFormBreed] = useState((rule == null ? void 0 : rule.breedFilter) || "");
    const [formSize, setFormSize] = useState((rule == null ? void 0 : rule.sizeFilter) || "");
    const [formAge, setFormAge] = useState((rule == null ? void 0 : rule.ageFilter) || "");
    const [formDiet, setFormDiet] = useState((rule == null ? void 0 : rule.dietFilter) || "");
    const [formTemp, setFormTemp] = useState((rule == null ? void 0 : rule.temperamentFilter) || "");
    const [formColor, setFormColor] = useState((rule == null ? void 0 : rule.colorFilter) || "");
    const [formWeightMin, setFormWeightMin] = useState(((_a2 = rule == null ? void 0 : rule.weightMin) == null ? void 0 : _a2.toString()) || "");
    const [formWeightMax, setFormWeightMax] = useState(((_b = rule == null ? void 0 : rule.weightMax) == null ? void 0 : _b.toString()) || "");
    const [formVax, setFormVax] = useState((rule == null ? void 0 : rule.vaccinated) === true);
    const [formNeut, setFormNeut] = useState((rule == null ? void 0 : rule.neutered) === true);
    const [formActive, setFormActive] = useState((rule == null ? void 0 : rule.isActive) !== false);
    const petTypeOptions = [{
      label: "Any",
      value: ""
    }, {
      label: "Dog",
      value: "dog"
    }, {
      label: "Cat",
      value: "cat"
    }, {
      label: "Bird",
      value: "bird"
    }, {
      label: "Fish",
      value: "fish"
    }, {
      label: "Small Pet",
      value: "small_pet"
    }];
    const sizeOptions = [{
      label: "Any",
      value: ""
    }, {
      label: "Small",
      value: "small"
    }, {
      label: "Medium",
      value: "medium"
    }, {
      label: "Large",
      value: "large"
    }];
    const ageOptions = [{
      label: "Any",
      value: ""
    }, {
      label: "Baby",
      value: "baby"
    }, {
      label: "Adult",
      value: "adult"
    }, {
      label: "Senior",
      value: "senior"
    }];
    const isDirty = rule ? fieldChanged(formName, rule.name) || fieldChanged(formDesc, rule.description) || fieldChanged(formPetType, rule.petType) || fieldChanged(formBreed, rule.breedFilter) || fieldChanged(formSize, rule.sizeFilter) || fieldChanged(formAge, rule.ageFilter) || fieldChanged(formDiet, rule.dietFilter) || fieldChanged(formTemp, rule.temperamentFilter) || fieldChanged(formColor, rule.colorFilter) || fieldChanged(formWeightMin, (_c = rule.weightMin) == null ? void 0 : _c.toString()) || fieldChanged(formWeightMax, (_d = rule.weightMax) == null ? void 0 : _d.toString()) || fieldChanged(formVax, rule.vaccinated) || fieldChanged(formNeut, rule.neutered) || fieldChanged(formActive, rule.isActive) : (
      // Create mode: dirty when any field has a meaningful value
      formName !== "" || formDesc !== "" || formPetType !== "" || formBreed !== "" || formSize !== "" || formAge !== "" || formDiet !== "" || formTemp !== "" || formColor !== "" || formWeightMin !== "" || formWeightMax !== "" || formVax !== false || formNeut !== false
    );
    function handleSave() {
      var _a3;
      (_a3 = formRef.current) == null ? void 0 : _a3.requestSubmit();
    }
    function handleDiscard() {
      var _a3, _b2;
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
        setFormWeightMin(((_a3 = rule.weightMin) == null ? void 0 : _a3.toString()) || "");
        setFormWeightMax(((_b2 = rule.weightMax) == null ? void 0 : _b2.toString()) || "");
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
        setFormActive(true);
      }
    }
    useContextualSaveBar(shopify22, isDirty, handleSave, handleDiscard);
    return /* @__PURE__ */ jsxs(fetcher.Form, {
      method: "POST",
      ref: formRef,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "480px"
      },
      children: [/* @__PURE__ */ jsx("input", {
        type: "hidden",
        name: "intent",
        value: rule ? "update" : "create"
      }), rule && /* @__PURE__ */ jsx("input", {
        type: "hidden",
        name: "id",
        value: rule.id
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Rule Name"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.name
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Rule Name",
          labelHidden: true,
          name: "name",
          value: formName,
          onChange: setFormName,
          required: true,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Description"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.description
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Description",
          labelHidden: true,
          name: "description",
          value: formDesc,
          onChange: setFormDesc,
          multiline: 3,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Pet Type"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.petType
          })]
        }), /* @__PURE__ */ jsx(Select, {
          label: "Pet Type",
          labelHidden: true,
          name: "petType",
          value: formPetType,
          onChange: setFormPetType,
          options: petTypeOptions
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Breed Filter"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.breedFilter
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Breed Filter",
          labelHidden: true,
          name: "breedFilter",
          value: formBreed,
          onChange: setFormBreed,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Size"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.sizeFilter
          })]
        }), /* @__PURE__ */ jsx(Select, {
          label: "Size",
          labelHidden: true,
          name: "sizeFilter",
          value: formSize,
          onChange: setFormSize,
          options: sizeOptions
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Age"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.ageFilter
          })]
        }), /* @__PURE__ */ jsx(Select, {
          label: "Age",
          labelHidden: true,
          name: "ageFilter",
          value: formAge,
          onChange: setFormAge,
          options: ageOptions
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Diet Filter"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.dietFilter
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Diet Filter",
          labelHidden: true,
          name: "dietFilter",
          value: formDiet,
          onChange: setFormDiet,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Temperament"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.temperamentFilter
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Temperament",
          labelHidden: true,
          name: "temperamentFilter",
          value: formTemp,
          onChange: setFormTemp,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Color"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.colorFilter
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Color",
          labelHidden: true,
          name: "colorFilter",
          value: formColor,
          onChange: setFormColor,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Min Weight (kg)"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.weightMin
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Min Weight",
          labelHidden: true,
          name: "weightMin",
          type: "number",
          value: formWeightMin,
          onChange: setFormWeightMin,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.25rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Max Weight (kg)"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.weightMax
          })]
        }), /* @__PURE__ */ jsx(TextField, {
          label: "Max Weight",
          labelHidden: true,
          name: "weightMax",
          type: "number",
          value: formWeightMax,
          onChange: setFormWeightMax,
          autoComplete: "off"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Vaccinated"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.vaccinated
          })]
        }), /* @__PURE__ */ jsxs("label", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontSize: "0.875rem"
          },
          children: [/* @__PURE__ */ jsx("input", {
            type: "checkbox",
            name: "vaccinated",
            value: "true",
            checked: formVax,
            onChange: (e) => setFormVax(e.target.checked)
          }), "Vaccinated"]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginTop: "0.5rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Neutered"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.neutered
          })]
        }), /* @__PURE__ */ jsxs("label", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontSize: "0.875rem"
          },
          children: [/* @__PURE__ */ jsx("input", {
            type: "checkbox",
            name: "neutered",
            value: "true",
            checked: formNeut,
            onChange: (e) => setFormNeut(e.target.checked)
          }), "Neutered"]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginTop: "0.5rem"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 500,
              fontSize: "0.875rem"
            },
            children: "Active"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: fieldInfo.isActive
          })]
        }), /* @__PURE__ */ jsxs("label", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontSize: "0.875rem"
          },
          children: [/* @__PURE__ */ jsx("input", {
            type: "checkbox",
            name: "isActive",
            value: "true",
            checked: formActive,
            onChange: (e) => setFormActive(e.target.checked)
          }), "Active"]
        })]
      })]
    });
  }
  return /* @__PURE__ */ jsx(Page, {
    title: "Filter Rules",
    children: /* @__PURE__ */ jsxs(BlockStack, {
      gap: "400",
      children: [/* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "flex-end"
        },
        children: /* @__PURE__ */ jsx(Button, {
          onClick: () => {
            setShowCreate(!showCreate);
            setEditId(null);
          },
          children: showCreate ? "Cancel" : "New Rule"
        })
      }), selIds.length > 0 && /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsxs(fetcher.Form, {
          method: "POST",
          style: {
            display: "inline"
          },
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "intent",
            value: "batch-delete"
          }), /* @__PURE__ */ jsx("input", {
            type: "hidden",
            name: "ids",
            value: JSON.stringify(selIds)
          }), /* @__PURE__ */ jsx(Button, {
            submit: true,
            variant: "primary",
            tone: "critical",
            disabled: fetcher.state === "submitting",
            loading: fetcher.state === "submitting",
            children: fetcher.state === "submitting" ? "Deleting..." : `Delete Selected (${selIds.length})`
          })]
        })
      }), showCreate && /* @__PURE__ */ jsxs(Card, {
        roundedAbove: "sm",
        children: [/* @__PURE__ */ jsx(Text, {
          as: "h2",
          variant: "headingSm",
          children: "New Filter Rule"
        }), /* @__PURE__ */ jsx(RuleForm, {})]
      }), editId && editRule && /* @__PURE__ */ jsxs(Card, {
        roundedAbove: "sm",
        children: [/* @__PURE__ */ jsxs(InlineStack, {
          align: "space-between",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsxs(Text, {
            as: "h2",
            variant: "headingSm",
            children: ["Edit: ", editRule.name]
          }), /* @__PURE__ */ jsx(Button, {
            onClick: () => setEditId(null),
            children: "Back"
          })]
        }), /* @__PURE__ */ jsx(RuleForm, {
          rule: editRule
        }), /* @__PURE__ */ jsx("div", {
          style: {
            marginTop: "1rem"
          },
          children: /* @__PURE__ */ jsxs(fetcher.Form, {
            method: "POST",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "intent",
              value: "delete"
            }), /* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "id",
              value: editId
            }), /* @__PURE__ */ jsx(Button, {
              submit: true,
              variant: "primary",
              tone: "critical",
              children: "Delete Rule"
            })]
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs(InlineStack, {
          gap: "100",
          blockAlign: "center",
          children: [/* @__PURE__ */ jsx(Text, {
            as: "h3",
            variant: "headingSm",
            children: "All Rules"
          }), /* @__PURE__ */ jsx(InfoButton, {
            content: "All filter rules you've created. Rules define criteria for matching pet products. Click a rule name to edit, or use checkboxes for batch operations."
          })]
        }), /* @__PURE__ */ jsx(Card, {
          roundedAbove: "sm",
          children: rules.length === 0 ? /* @__PURE__ */ jsx("div", {
            style: {
              padding: "2rem 1rem",
              textAlign: "center",
              color: "var(--p-color-text-subdued)"
            },
            children: 'No rules found. Click "New Rule" to create one.'
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                paddingBottom: "0.75rem"
              },
              children: /* @__PURE__ */ jsx(TextField, {
                label: "Search rules",
                labelHidden: true,
                placeholder: "Search by name, pet type, size, or status…",
                value: searchQuery,
                onChange: setSearchQuery,
                autoComplete: "off",
                clearButton: true,
                onClearButtonClick: () => setSearchQuery("")
              })
            }), /* @__PURE__ */ jsx(DataTable, {
              columnContentTypes: ["text", "text", "text", "text", "text"],
              headings: ["", "Name", "Pet Type", "Size", "Status"],
              rows: filteredRows
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1rem"
              },
              children: [/* @__PURE__ */ jsxs(Text, {
                as: "span",
                variant: "bodySm",
                tone: "subdued",
                children: ["Page ", currentPage, " of ", totalPages, " (", total, " total)"]
              }), /* @__PURE__ */ jsxs(InlineStack, {
                gap: "200",
                children: [/* @__PURE__ */ jsx(Button, {
                  onClick: () => goPage(currentPage - 1),
                  disabled: currentPage <= 1,
                  children: "Previous"
                }), /* @__PURE__ */ jsx(Button, {
                  onClick: () => goPage(currentPage + 1),
                  disabled: !hasNext,
                  children: "Next"
                })]
              })]
            })]
          })
        })]
      })]
    })
  });
});
const ErrorBoundary10 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary11() {
  return boundary.error(useRouteError());
});
const headers = (h) => boundary.headers(h);
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary10,
  action,
  default: app_rules,
  headers,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-v99bKydh.js", "imports": ["/assets/jsx-runtime-DQVVV8EP.js", "/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/index-5SEiYHG8.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-ZbW8UgUZ.js", "imports": ["/assets/jsx-runtime-DQVVV8EP.js", "/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/index-5SEiYHG8.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/context-DTFgoCb8.js", "/assets/context-BmYEPcId.js"], "css": ["/assets/root-x1cbIzLV.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/webhooks.app.scopes_update": { "id": "routes/webhooks.app.scopes_update", "parentId": "root", "path": "webhooks/app/scopes_update", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.scopes_update-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/webhooks.app.uninstalled": { "id": "routes/webhooks.app.uninstalled", "parentId": "root", "path": "webhooks/app/uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.uninstalled-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/proxy.compatible-count": { "id": "routes/proxy.compatible-count", "parentId": "root", "path": "proxy/compatible-count", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/proxy.compatible-count-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/proxy.best-matches": { "id": "routes/proxy.best-matches", "parentId": "root", "path": "proxy/best-matches", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/proxy.best-matches-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/proxy.settings": { "id": "routes/proxy.settings", "parentId": "root", "path": "proxy/settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/proxy.settings-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/webhooks.gdpr": { "id": "routes/webhooks.gdpr", "parentId": "root", "path": "webhooks/gdpr", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/webhooks.gdpr-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/proxy.badge": { "id": "routes/proxy.badge", "parentId": "root", "path": "proxy/badge", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/proxy.badge-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/route-ySa-11zj.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/AppProxyProvider-EjTPxPp_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/proxy.pets": { "id": "routes/proxy.pets", "parentId": "root", "path": "proxy/pets", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/proxy.pets-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/auth._-wFnzOaP_.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/index-Cuf3UEA-.js", "/assets/jsx-runtime-DQVVV8EP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/_index-DzrU4lof.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app-yp6eLCw5.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/AppProxyProvider-EjTPxPp_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.onboarding": { "id": "routes/app.onboarding", "parentId": "routes/app", "path": "onboarding", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app.onboarding-CWPv0JQk.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/useAppBridge-Bj34gXAL.js", "/assets/ButtonGroup-CJro56tj.js", "/assets/ProgressBar-R3Z5kFUH.js", "/assets/SettingsIcon.svg-Dobekwms.js", "/assets/Banner-DmwbGXsP.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/CSSTransition-BtiOVsgR.js", "/assets/index-5SEiYHG8.js", "/assets/XIcon.svg-RHji5npu.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.matching": { "id": "routes/app.matching", "parentId": "routes/app", "path": "matching", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app.matching-qVzU-sVw.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/info-button-BVH4J4fb.js", "/assets/ButtonGroup-CJro56tj.js", "/assets/Select-DjoNg7AL.js", "/assets/DataTable-DBLszCZ9.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/context-DTFgoCb8.js", "/assets/index-5SEiYHG8.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.products": { "id": "routes/app.products", "parentId": "routes/app", "path": "products", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app.products-CgXYHDqU.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/info-button-BVH4J4fb.js", "/assets/use-contextual-save-bar-Dl-H_mum.js", "/assets/useAppBridge-Bj34gXAL.js", "/assets/ButtonGroup-CJro56tj.js", "/assets/Select-DjoNg7AL.js", "/assets/DataTable-DBLszCZ9.js", "/assets/Banner-DmwbGXsP.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/context-DTFgoCb8.js", "/assets/index-5SEiYHG8.js", "/assets/XIcon.svg-RHji5npu.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.settings": { "id": "routes/app.settings", "parentId": "routes/app", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app.settings-DIrwBY4-.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/info-button-BVH4J4fb.js", "/assets/use-contextual-save-bar-Dl-H_mum.js", "/assets/useAppBridge-Bj34gXAL.js", "/assets/ButtonGroup-CJro56tj.js", "/assets/Select-DjoNg7AL.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/context-DTFgoCb8.js", "/assets/index-5SEiYHG8.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.billing": { "id": "routes/app.billing", "parentId": "routes/app", "path": "billing", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app.billing-C-qWfAL-.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/info-button-BVH4J4fb.js", "/assets/ButtonGroup-CJro56tj.js", "/assets/useAppBridge-Bj34gXAL.js", "/assets/StarFilledIcon.svg-U1eclyoE.js", "/assets/ProgressBar-R3Z5kFUH.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/context-DTFgoCb8.js", "/assets/index-5SEiYHG8.js", "/assets/CSSTransition-BtiOVsgR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.billing.callback": { "id": "routes/app.billing.callback", "parentId": "routes/app.billing", "path": "callback", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/app.billing.callback-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app._index-C-xEOy9I.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/ButtonGroup-CJro56tj.js", "/assets/info-button-BVH4J4fb.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/context-BmYEPcId.js", "/assets/context-DTFgoCb8.js", "/assets/CSSTransition-BtiOVsgR.js", "/assets/XIcon.svg-RHji5npu.js", "/assets/StarFilledIcon.svg-U1eclyoE.js", "/assets/SettingsIcon.svg-Dobekwms.js", "/assets/DataTable-DBLszCZ9.js", "/assets/index-5SEiYHG8.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.rules": { "id": "routes/app.rules", "parentId": "routes/app", "path": "rules", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app.rules-B4usOHRT.js", "imports": ["/assets/chunk-6CSD65Y2-DqrUyLCo.js", "/assets/jsx-runtime-DQVVV8EP.js", "/assets/index-Cuf3UEA-.js", "/assets/info-button-BVH4J4fb.js", "/assets/use-contextual-save-bar-Dl-H_mum.js", "/assets/useAppBridge-Bj34gXAL.js", "/assets/ButtonGroup-CJro56tj.js", "/assets/DataTable-DBLszCZ9.js", "/assets/Select-DjoNg7AL.js", "/assets/use-is-after-initial-mount-C3nZxAFT.js", "/assets/context-DTFgoCb8.js", "/assets/index-5SEiYHG8.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-15c93ab1.js", "version": "15c93ab1", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "v8_passThroughRequests": false, "v8_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/webhooks.app.scopes_update": {
    id: "routes/webhooks.app.scopes_update",
    parentId: "root",
    path: "webhooks/app/scopes_update",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "root",
    path: "webhooks/app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/proxy.compatible-count": {
    id: "routes/proxy.compatible-count",
    parentId: "root",
    path: "proxy/compatible-count",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/proxy.best-matches": {
    id: "routes/proxy.best-matches",
    parentId: "root",
    path: "proxy/best-matches",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/proxy.settings": {
    id: "routes/proxy.settings",
    parentId: "root",
    path: "proxy/settings",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/webhooks.gdpr": {
    id: "routes/webhooks.gdpr",
    parentId: "root",
    path: "webhooks/gdpr",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/proxy.badge": {
    id: "routes/proxy.badge",
    parentId: "root",
    path: "proxy/badge",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/proxy.pets": {
    id: "routes/proxy.pets",
    parentId: "root",
    path: "proxy/pets",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route11
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/app.onboarding": {
    id: "routes/app.onboarding",
    parentId: "routes/app",
    path: "onboarding",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/app.matching": {
    id: "routes/app.matching",
    parentId: "routes/app",
    path: "matching",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/app.products": {
    id: "routes/app.products",
    parentId: "routes/app",
    path: "products",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/app.settings": {
    id: "routes/app.settings",
    parentId: "routes/app",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/app.billing": {
    id: "routes/app.billing",
    parentId: "routes/app",
    path: "billing",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/app.billing.callback": {
    id: "routes/app.billing.callback",
    parentId: "routes/app.billing",
    path: "callback",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route19
  },
  "routes/app.rules": {
    id: "routes/app.rules",
    parentId: "routes/app",
    path: "rules",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
