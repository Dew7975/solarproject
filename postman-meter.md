# Meter API Integration Guide

The Meter API accepts monthly energy totals from an external metering system and automatically generates a monthly invoice.

## Endpoint

`POST /api/meter`

## Authentication

- Optional header: `x-api-key`
- If `METER_API_KEY` is set in `.env`, the header **must** be present and match.

## Request Body

```json
{
  "userId": "cus_123",
  "totalGenerated": 512.5,
  "totalExported": 180.4,
  "totalImported": 22.2,
  "totalCo2": 124.9,
  "month": 8,
  "year": 2026
}
```

### Notes

- `month` and `year` are optional; if omitted, the current month is used.
- `totalImported` is optional and defaults to `0`.

## Responses

### 200 OK

```json
{
  "ok": true,
  "readingId": "read_123",
  "invoiceId": "inv_123",
  "amount": 4500,
  "stored": {
    "month": 8,
    "year": 2026,
    "kwhGenerated": 512.5,
    "kwhExported": 180.4,
    "kwhImported": 22.2
  },
  "totals": {
    "co2Kg": 124.9
  }
}
```

### 400 Bad Request

- Missing or invalid payload fields.

### 401 Unauthorized

- Invalid or missing `x-api-key` when `METER_API_KEY` is set.

### 404 Not Found

- No application found for the provided `userId`.

### 409 Conflict (Idempotency)

- Returned when a meter reading for the same month/year already exists for the application.

## Idempotency & Retries

- The API checks for an existing reading for the same `applicationId`, `month`, and `year`.
- If a reading already exists, a `409 Conflict` response is returned.
- For retry logic, treat `409` as a successful submission already processed.

## Error Handling Guidance

- On `401`, verify the API key.
- On `400`, correct payload fields or data types.
- On `409`, stop retrying and record the existing submission.

## Related IoT Endpoint

`POST /api/iot/measurements` accepts signed device telemetry. This endpoint uses HMAC signatures and a device registry. It is intended for real-time device data and is separate from the monthly Meter API.
