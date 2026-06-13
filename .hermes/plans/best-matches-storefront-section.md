# Best Matches for Your Pet — Storefront Section Design

> Author: architect · Date: 2026-06-10 · Status: draft

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Shopify Storefront (Liquid Theme)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Product Page                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Badge (proxy.badge.tsx → HTML <span>)          │  │  │
│  │  │  Product Details                                 │  │  │
│  │  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │  │  │
│  │  │  ★ Best Matches for Your Pet ★                   │  │  │
│  │  │  ┌───┐  ┌───┐  ┌───┐  ┌───┐                     │  │  │
│  │  │  │ 🐕│  │ 🐈│  │ 🐕│  │ 🐇│                     │  │  │
│  │  │  └───┘  └───┘  └───┘  └───┘                     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Liquid snippet fetches: /apps/pet-filter/proxy/best-matches │
│  ?productId={{ product.id }}                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ GET (proxy via authenticate.public.appProxy)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Hermes App Backend                                          │
│                                                              │
│  app/routes/proxy.best-matches.tsx                           │
│    ├── authenticate.public.appProxy(request)                 │
│    ├── getBestMatchesData(shop, productId)                   │
│    │     ├── PetProfile (current product)                    │
│    │     ├── PetProfile[] (all other pets in shop)           │
│    │     ├── Build dynamic rule from current pet attributes  │
│    │     ├── findCompatiblePets(allPets, rule, minScore=1)   │
│    │     ├── Top 4-6 pets sorted by score                    │
│    │     └── Shopify GraphQL: fetch product data for each    │
│    │         (image, title, price, handle)                   │
│    └── Response JSON → { matches: [...], total: N }         │
│                                                              │
│  Caching: response-cache.ts (CacheTier.LONG / 5 min)        │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. New Proxy Endpoint: /proxy/best-matches

### Route File

`app/routes/proxy.best-matches.tsx`

### Contract

```
GET /apps/pet-filter/proxy/best-matches?productId=xxx

Response 200 (JSON):
{
  "matches": [
    {
      "productId": "gid://shopify/Product/456",
      "handle": "golden-retriever-plush",
      "title": "Golden Retriever Plush Toy",
      "image": "https://cdn.shopify.com/.../image.png",
      "price": "$24.99",
      "compareAtPrice": "$29.99",        // optional
      "score": 7,
      "maxScore": 11,
      "scorePercent": 64,                 // integer 0-100
      "matchedCriteria": ["Pet Type", "Breed", "Size", "Temperament"],
      "petType": "dog"
    }
  ],
  "total": 4,
  "currentPetType": "dog",
  "badgeEnabled": true
}

Response 204: No Content (badgeEnabled=false veya current pet bulunamadi)
Response 400: Missing productId
Response 401: Unauthorized
```

### Implementation Steps (for constructor)

```typescript
// Algorithm in getBestMatchesData(shop, productId)
// 1. Load ShopSettings → badgeEnabled check (return null if false)
// 2. Load current PetProfile by productId
// 3. Build dynamic rule from current pet attributes
//    const rule: FilterRule = {
//      petType: currentPet.petType,
//      breedFilter: currentPet.breed,
//      sizeFilter: currentPet.size,
//      ageFilter: currentPet.ageGroup,
//      dietFilter: currentPet.dietaryNeeds,
//      temperamentFilter: currentPet.temperament,
//      colorFilter: currentPet.color,
//      weightMin: weight ? parseFloat(weight) - 10 : null,
//      weightMax: weight ? parseFloat(weight) + 10 : null,
//      vaccinated: currentPet.vaccinated,
//      neutered: currentPet.neutered,
//    };
// 4. Find all other PetProfiles for shop (excluding current)
// 5. evaluatePetAgainstRule each pet with the dynamic rule
// 6. Sort by score desc, take top 4-6
// 7. For each matched pet → Shopify GraphQL Admin API
//    query { product(id: "gid://shopify/Product/{productId}") {
//      title, handle, images(first:1){nodes{url}},
//      variants(first:1){nodes{price,compareAtPrice}}
//    }}
// 8. Return { matches: [...], total: N, currentPetType, badgeEnabled }
```

**Important design decision: dynamic rule construction.**  
We build a rule FROM the current pet's attributes, then score other pets against it. This is better than using a predefined FilterRule because:
- No extra merchant configuration needed
- Each product gets personalized matches
- Reuses the existing `evaluatePetAgainstRule` engine

---

## 3. Storefront Service Extension

### New function in `app/modules/storefront/storefront.service.ts`

```typescript
export interface BestMatchProduct {
  productId: string;
  handle: string;
  title: string;
  image: string | null;
  price: string;
  compareAtPrice: string | null;
  score: number;
  maxScore: number;
  scorePercent: number;
  matchedCriteria: string[];
  petType: string | null;
}

export interface BestMatchesResult {
  matches: BestMatchProduct[];
  total: number;
  currentPetType: string | null;
  badgeEnabled: boolean;
}

export async function getBestMatchesData(
  shop: string,
  productId: string,
): Promise<BestMatchesResult | null> {
  // See algorithm above
}
```

### New Cache Key

```typescript
// In app/lib/response-cache.ts → CacheKeys
bestMatches: (shop: string, productId: string) => cacheKey("bestMatches", shop, productId),
CacheTier: CacheTier.LONG (5 min) — product data is stable
```

---

## 4. Storefront Section Component

### Architecture Decision: Client-Side Rendered Section

**Chosen approach:** The proxy endpoint returns HTML (not JSON), rendered server-side as a complete section with embedded styles. The Liquid snippet fetches this HTML and injects it into the DOM. This avoids:
- CSP issues with inline scripts in Liquid
- Theme compatibility concerns with JS frameworks
- Complex Liquid rendering of dynamic data

### Proxy Returns HTML

The `/proxy/best-matches` endpoint returns HTML in the same style as `proxy.badge.tsx`:

```html
<div class="pf-best-matches" data-pet-type="dog">
  <h3 class="pf-best-matches__title">🐾 Best Matches for Your Pet</h3>
  <div class="pf-best-matches__grid">
    <a href="/products/golden-retriever-plush"
       class="pf-best-matches__card">
      <div class="pf-best-matches__card-image">
        <img src="https://cdn.shopify.com/..." alt="...">
      </div>
      <div class="pf-best-matches__card-info">
        <span class="pf-best-matches__card-title">Golden Retriever Plush Toy</span>
        <span class="pf-best-matches__card-price">$24.99</span>
        <span class="pf-best-matches__card-badge">92% Match</span>
      </div>
    </a>
    <!-- more cards -->
  </div>
</div>
```

### Visual Design

```
┌──────────────────────────────────────────────────────┐
│  🐾 Best Matches for Your Pet                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │  │      │ │
│  │ │  🐕  │ │  │ │  🐈  │ │  │ │  🐕  │ │  │ ...  │ │
│  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │  │      │ │
│  │ Golden   │  │ Persian  │  │ Beagle   │  │      │ │
│  │ Retriever│  │ Cat Wand │  │ Harness  │  │      │ │
│  │ $24.99   │  │ $12.99   │  │ $19.99   │  │      │ │
│  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │  │      │ │
│  │ │92%   │ │  │ │78%   │ │  │ │71%   │ │  │      │ │
│  │ │Match │ │  │ │Match │ │  │ │Match │ │  │      │ │
│  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │  │      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────┘ │
└──────────────────────────────────────────────────────┘

Grid: 4-6 cards, responsive (4 cols desktop, 2 cols tablet, 1 col mobile)
Card: 150x200px approx, rounded corners, subtle shadow
Score badge: colored pill (green ≥80%, yellow ≥60%, gray <60%)
```

### HTML/CSS (inline, no external deps)

The inline styles use `pf-` prefix to avoid Shopify theme conflicts. All styles are embedded in the HTML response (no separate CSS file).

---

## 5. Theme Integration Approach

### Liquid Snippet: `snippets/pet-filter-best-matches.liquid`

This snippet is what the merchant adds to their theme:

```liquid
{% if settings.pf_badge_enabled %}
  <div id="pf-best-matches-section"
       data-product-id="{{ product.id }}"
       style="margin-top: 2rem;">
    <div class="pf-best-matches__loading">
      <p style="text-align:center;color:#888;">Loading best matches…</p>
    </div>
  </div>

  <script>
    (function() {
      var container = document.getElementById('pf-best-matches-section');
      var productId = container.getAttribute('data-product-id');
      var url = '/apps/pet-filter/proxy/best-matches?productId=' + encodeURIComponent(productId);

      fetch(url)
        .then(function(res) {
          if (res.status === 204) { container.style.display = 'none'; return null; }
          return res.text();
        })
        .then(function(html) {
          if (html) container.innerHTML = html;
        })
        .catch(function() { container.style.display = 'none'; });
    })();
  </script>
{% endif %}
```

### Integration Steps (for merchant docs):
1. Go to Online Store → Themes → Edit Code
2. Open `snippets/pet-filter-best-matches.liquid` (create if not exists)
3. Open `product.liquid` → Add `{% render 'pet-filter-best-matches' %}` where you want the section
4. Save → The section appears on product pages

---

## 6. Caching Strategy

| Cache | Key | TTL | Strategy |
|-------|-----|-----|----------|
| Response Cache | `bestMatches:{shop}:{productId}` | 5 min (CacheTier.LONG) | stale-while-revalidate |
| Shopify Product data | N/A (fetched fresh per request) | GraphQL response is already fast | N/A |

The product images/titles/prices rarely change, so 5-minute TTL is safe. On product update webhook, invalidate the cache.

---

## 7. Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scoring method | Dynamic rule from current pet | No extra config; reuse existing engine |
| Proxy return format | HTML (not JSON) | Simpler theme integration; no JS framework required |
| Number of matches | 4-6 (server decides) | Performant; no pagination needed |
| Score display | Percent (score/maxScore × 100) | Intuitive for customers |
| Score colors | Green ≥80%, Yellow ≥60%, Gray <60% | Universal traffic-light pattern |
| Styling | Inline CSS with `pf-` prefix | No theme conflicts; no external deps |
| Caching | 5 min LRU with stale-while-revalidate | Balance freshness vs performance |
| Badge control | Respects `badgeEnabled` from ShopSettings | Consistent with existing badge behavior |

---

## 8. Edge Cases

| Case | Behavior |
|------|----------|
| badgeEnabled = false | Return 204 (No Content); section hidden |
| Current pet not found | Return 204; section hidden |
| No compatible pets found | Return 200 with `{ matches: [], total: 0 }`; section shows "No matches found" |
| Only 1-3 matches | Show whatever is available (not padded) |
| GraphQL product fetch fails for some SKUs | Skip failed SKUs, return successful ones |
| Product has no image | Omit image from card, text-only layout |
| Fetch error in Liquid snippet | Catch → hide section silently |
| Cross-shop data leak | authenticate.public.appProxy prevents this |
| Rate limiting | 5 products per render; cache absorbs most traffic |

---

## 9. File Manifest

| File | Action | Purpose |
|------|--------|---------|
| `app/routes/proxy.best-matches.tsx` | **CREATE** | Proxy endpoint: HTML section |
| `app/modules/storefront/storefront.service.ts` | **MODIFY** | Add `getBestMatchesData()` |
| `app/modules/storefront/index.ts` | **MODIFY** | Export new function |
| `app/lib/response-cache.ts` | **MODIFY** | Add `CacheKeys.bestMatches` |
| `theme/snippets/pet-filter-best-matches.liquid` | **CREATE** | Theme integration snippet |

---

## 10. Scoring Detail

The `evaluatePetAgainstRule` system supports 11 criteria. Each matched criterion = +1 point.
`maxScore` = total applicable criteria for the current pet (not all 11 — if a pet has no `breed`, breed can't be scored).
`scorePercent` = Math.round((score / maxScore) × 100).

Example:
- Current pet: Dog, Labrador, Large, Adult, Active temperament, Vaccinated
- maxScore = 5 (pet_type + breed + size + age + temperament + vaccinated = 6, but if other pet also has these)
- Other pet matches 4/6 → scorePercent = 67%

---

## 11. Review Checklist

- [ ] Dynamic rule generation covers all PetProfile fields used in evaluatePetAgainstRule
- [ ] Shopify GraphQL query fetches: title, handle, image (first), price, compareAtPrice
- [ ] Cache key includes both shop and productId
- [ ] badgeEnabled check from ShopSettings is first gate
- [ ] Inline CSS uses `pf-` prefix to avoid theme collisions
- [ ] HTML response includes emoji for pet type in section title
- [ ] Liquid snippet gracefully handles 204 (hidden) vs 200 (renders)
- [ ] Error handling: fetch failure → silent hide
- [ ] Cross-shop isolation via authenticate.public.appProxy
- [ ] Score display uses universal traffic-light colors
- [ ] Responsive grid: 4 cols desktop, 2 tablet, 1 mobile
