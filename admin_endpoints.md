# Admin Endpoints Documentation

## Admin Login

- **Endpoint:** `POST /auth/login`
- **Method:** `POST`
- **Description:** Authenticate admin user and receive JWT token
- **Request Body (form-data):**
  - `username`: `juniorflamebet@gmail.com`
  - `password`: `Maurice@12!`
- **Response (200 OK):**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

All other admin endpoints are prefixed with `/admin` and require admin authentication via JWT Bearer token.

---

## 1. List All Categories

- **Endpoint:** `GET /admin/categories`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Tool Rental",
    "slug": "tool-rental",
    "description": null,
    "is_active": true,
    "created_at": "2026-06-02T10:00:00Z"
  }
]
```

---

## 2. Create Category

- **Endpoint:** `POST /admin/categories`
- **Method:** `POST`
- **Authentication:** Required (admin JWT)
- **Query Parameters:**
  - `name` (string, required)
  - `description` (string, optional)
- **Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Tool Rental",
  "slug": "tool-rental",
  "description": null,
  "is_active": true
}
```
- **Response (400):** Category 'X' already exists

---

## 3. Update Category

- **Endpoint:** `PATCH /admin/categories/{id}`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Query Parameters:**
  - `name` (string, optional)
  - `is_active` (bool, optional)
- **Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Tool Rental",
  "slug": "tool-rental",
  "is_active": true
}
```
- **Response (404):** Category not found

---

## 4. Delete Category (Soft Delete)

- **Endpoint:** `DELETE /admin/categories/{id}`
- **Method:** `DELETE`
- **Authentication:** Required (admin JWT)
- **Response (200 OK):**
```json
{ "message": "Category 'Tool Rental' deactivated" }
```
- **Response (400):** Cannot deactivate category 'X': items still reference it

---

## 5. List Provider Category Markups

- **Endpoint:** `GET /admin/providers/{id}/markups`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "category": "Tool Rental",
    "price_markup": "15.00"
  }
]
```

---

## 6. Create/Update Provider Category Markup

- **Endpoint:** `POST /admin/providers/{id}/markups`
- **Method:** `POST`
- **Authentication:** Required (admin JWT)
- **Query Parameters:**
  - `category` (string, required)
  - `price_markup` (decimal, required)
- **Response (200 OK):**
```json
{
  "id": "uuid",
  "provider_id": "uuid",
  "category": "Tool Rental",
  "price_markup": "15.00"
}
```
- **Response (404):** Provider not found

---

## 7. Delete Provider Category Markup

- **Endpoint:** `DELETE /admin/providers/{id}/markups/{category}`
- **Method:** `DELETE`
- **Authentication:** Required (admin JWT)
- **Note:** The `{category}` path parameter must be URL-encoded (e.g. use `encodeURIComponent(categoryName)` in JavaScript).
- **Response (200 OK):**
```json
{ "message": "Markup for category 'Tool Rental' removed" }
```
- **Response (404):** Markup not found

---

## 8. Admin Item Detail — New Fields

- **Endpoints:** `GET /admin/items`, `GET /admin/items/{id}`
- **New fields in ItemDetail response:**

```json
{
  "id": "uuid",
  "title": "AMT - Android Multi Tool Rent",
  "price_final": "29.52",
  "effective_markup": "15.00",
  "markup_source": "provider_category",
  "provider_listings": [...]
}
```

| Field            | Type   | Values                 | Description                                                      |
|------------------|--------|------------------------|------------------------------------------------------------------|
| effective_markup | Decimal | e.g. "15.00"          | The actual markup applied (from override or item fallback)       |
| markup_source    | string | "item" or "provider_category" | Where the effective markup came from                      |

These fields are admin-only — they are not present in `GET /items` (public) or client order responses.

---

## 9. Pricing Rules (Frontend Display Logic)

The server resolves `price_final` deterministically:

- **If the item has an active preferred ProviderListing (from an active provider):**
  1. Check `ProviderCategoryMarkup` for that provider + item's category → use that markup
  2. Else fall back to `Item.price_markup`
  3. `price_final = cost_price + effective_markup`
- **If no active preferred listing exists:**
  - `price_final = Item.price_markup` (no cost_price added)

**Note:** `OrderItem.unit_price` is a snapshot — it never changes after order creation, even if markups are edited later.

---

## 10. Category Validation on Item Create/Edit

- **Endpoints affected:** `POST /admin/items`, `PATCH /admin/items/{id}`
- **Behavior:** The `category` field is validated against the `Category` table.
- **Response 400 if invalid:**
```json
{
  "detail": "Category 'FakeCategory' is not recognized. Valid categories: ['Tool Rental', 'Remote Services', 'TestCategory']"
}
```
- **Note:** The seed script (`scripts/seed_services.py`) auto-creates Category rows from `services_type` values, so categories are populated automatically as new suppliers are onboarded.

---


## 11. List All Items

- **Endpoint:** `GET /admin/items`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "slug": "string",
    "title": "string",
    "description": "string or null",
    "item_type": "SERVICE|PRODUCT",
    "category": "string",
    "thumbnail": "string or null",
    "price_final": "decimal",
    "currency": "string",
    "delivery_time": "string or null",
    "stock": "int or null",
    "is_visible": true,
    "low_stock": false
  }
]
```

---

## 2. Create Item

- **Endpoint:** `POST /admin/items`
- **Method:** `POST`
- **Authentication:** Required (admin JWT)
- **Request Body:**
```json
{
  "slug": "string (required)",
  "title": "string (required)",
  "description": "string (optional)",
  "item_type": "SERVICE|PRODUCT (required)",
  "category": "string (required)",
  "thumbnail": "string (optional)",
  "price_markup": "decimal (default: 0)",
  "currency": "string (default: ZAR)",
  "delivery_time": "string (optional)",
  "stock": "int (optional)"
}
```
- **Response (200 OK):** Returns `ItemDetail` object

---

## 3. Edit Item

- **Endpoint:** `PATCH /admin/items/{item_id}`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `item_id` (string, required) — Item UUID
- **Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "thumbnail": "string (optional)",
  "price_markup": "decimal (optional)",
  "currency": "string (optional)",
  "delivery_time": "string (optional)",
  "stock": "int (optional)",
  "is_visible": "bool (optional)"
}
```
- **Response (200 OK):** Returns `ItemDetail` object
- **Errors:** 404 if item not found

---

## 4. Set Item Markup

- **Endpoint:** `PATCH /admin/items/{item_id}/markup`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `item_id` (string, required) — Item UUID
- **Query Parameters:**
  - `markup` (decimal, required) — New markup price
- **Response (200 OK):** Returns `ItemDetail` object
- **Errors:** 404 if item not found

---

## 5. Toggle Item Visibility

- **Endpoint:** `PATCH /admin/items/{item_id}/visibility`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `item_id` (string, required) — Item UUID
- **Query Parameters:**
  - `is_visible` (bool, required) — Visibility state
- **Response (200 OK):** Returns `ItemDetail` object
- **Errors:** 404 if item not found

---

## 6. Archive Item (Soft Delete)

- **Endpoint:** `DELETE /admin/items/{item_id}`
- **Method:** `DELETE`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `item_id` (string, required) — Item UUID
- **Response (200 OK):**
```json
{"message": "Item archived"}
```
- **Errors:** 404 if item not found

---

## 7. List Users

- **Endpoint:** `GET /admin/users`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "email": "string",
    "role": "CLIENT|ADMIN",
    "is_active": true
  }
]
```

---

## 8. Update User Status

- **Endpoint:** `PATCH /admin/users/{user_id}`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `user_id` (string, required) — User UUID
- **Query Parameters:**
  - `is_active` (bool, required) — User active status
- **Response (200 OK):**
```json
{"id": "uuid", "email": "string", "is_active": true}
```
- **Errors:** 404 if user not found

---

## 9. List Orders

- **Endpoint:** `GET /admin/orders`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Query Parameters:**
  - `status` (string, optional) — Filter by status: PENDING, PAID, FULFILLED, CANCELLED, REFUNDED
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "status": "PENDING|PAID|FULFILLED|CANCELLED|REFUNDED",
    "total_amount": "decimal"
  }
]
```

---

## 10. Update Order Status

- **Endpoint:** `PATCH /admin/orders/{order_id}/status`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `order_id` (string, required) — Order UUID
- **Query Parameters:**
  - `status` (string, required) — New status: PENDING, PAID, FULFILLED, CANCELLED, REFUNDED
- **Response (200 OK):**
```json
{"id": "uuid", "status": "PENDING|PAID|FULFILLED|CANCELLED|REFUNDED"}
```
- **Errors:** 404 if order not found

---

## 11. Bulk Upload Credentials

- **Endpoint:** `POST /admin/credentials/bulk`
- **Method:** `POST`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `item_id` (string, required) — Service item UUID
- **Request:** `multipart/form-data` with `credentials_file` (JSON or CSV)
- **File Format:**
  - JSON: Array of objects or single object
  - CSV: Key-value pairs as columns
- **Response (200 OK):**
```json
{"item_id": "uuid", "credentials_added": 0}
```
- **Errors:** 404 item not found, 400 if not SERVICE type or invalid file format

---

## 12. Get Credential Pool

- **Endpoint:** `GET /admin/credentials/{item_id}`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `item_id` (string, required) — Service item UUID
- **Response (200 OK):**
```json
{
"item_id": "uuid",
    "item_title": "string",
    "total": 0,
    "used": 0,
    "remaining": 0,
    "low_stock": false
}
```
- **Errors:** 404 if item not found

---

## 13. List Banners

- **Endpoint:** `GET /admin/banners`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "slug": "string",
    "title": "string",
    "content": "string",
    "image_url": "string or null",
    "link_url": "string or null",
    "is_active": true,
    "is_dismissible": true,
    "starts_at": "datetime or null",
    "ends_at": "datetime or null",
    "created_at": "datetime"
  }
]
```

---

## 14. Create Banner

- **Endpoint:** `POST /admin/banners`
- **Method:** `POST`
- **Authentication:** Required (admin JWT)
- **Request Body:**
```json
{
  "slug": "string (required)",
  "title": "string (required)",
  "content": "string (required)",
  "image_url": "string (optional)",
  "link_url": "string (optional)",
  "is_active": true,
  "is_dismissible": true,
  "starts_at": "datetime (optional)",
  "ends_at": "datetime (optional)"
}
```
- **Response (200 OK):** Returns banner object

---

## 15. Edit Banner

- **Endpoint:** `PATCH /admin/banners/{banner_id}`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `banner_id` (string, required) — Banner UUID
- **Request Body:**
```json
{
  "slug": "string (optional)",
  "title": "string (optional)",
  "content": "string (optional)",
  "image_url": "string (optional)",
  "link_url": "string (optional)",
  "is_active": "bool (optional)",
  "is_dismissible": "bool (optional)",
  "starts_at": "datetime (optional)",
  "ends_at": "datetime (optional)"
}
```
- **Response (200 OK):** Returns updated banner object
- **Errors:** 404 if banner not found

---

## 16. Delete Banner

- **Endpoint:** `DELETE /admin/banners/{banner_id}`
- **Method:** `DELETE`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `banner_id` (string, required) — Banner UUID
- **Response (200 OK):**
```json
{"message": "Banner deleted"}
```
- **Errors:** 404 if banner not found

---

## 17. Toggle Banner Active Status

- **Endpoint:** `PATCH /admin/banners/{banner_id}/toggle`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `banner_id` (string, required) — Banner UUID
- **Query Parameters:**
  - `is_active` (bool, required) — Active state
- **Response (200 OK):**
```json
{"id": "uuid", "is_active": true}
```
- **Errors:** 404 if banner not found

---

## 18. List Providers (Suppliers)

- **Endpoint:** `GET /admin/providers`
- **Method:** `GET`
- **Authentication:** Required (admin JWT)
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "base_url": "string or null",
    "notes": "string or null",
    "is_active": true
  }
]
```

---

## 19. Toggle Provider Status

- **Endpoint:** `PATCH /admin/providers/{provider_id}`
- **Method:** `PATCH`
- **Authentication:** Required (admin JWT)
- **Path Parameters:**
  - `provider_id` (string, required) — Provider UUID
- **Query Parameters:**
  - `is_active` (bool, required) — Provider active status
- **Response (200 OK):**
```json
{"id": "uuid", "is_active": true}
```
- **Errors:** 404 if provider not found