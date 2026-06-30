# Google Scholar — manual fallback (by design)

Google Scholar has **no official API at any price**, and aggressive scraping
risks an IP block. Per Part 3 of the spec, Scholar is handled by **manual
entry**, not automation.

## How to add a publication

Insert a row into `content_items` with `source_type = 'scholar'`:

```sql
insert into content_items (source_type, title, description, url, published_at, sync_status)
values (
  'scholar',
  '<Paper title>',
  '<Venue / authors>',
  '<https://link-to-paper>',
  '<YYYY-01-01>',
  'success'
);
```

The weekly `external` sync job writes a visible `sync_logs` note
(`scholar: no API — add publications manually`) so this gap is **surfaced, not
hidden** on `/status`. It does not mark the job failed.

## If you later want light automation

Only consider a low-frequency, polite fetch of a single public profile page
with caching and backoff — and only after confirming it does not violate terms
or trigger blocking. Do not build this without an explicit decision; manual
entry is the default.
