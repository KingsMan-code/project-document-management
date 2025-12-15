/**
 * Utility function to handle asset paths for GitHub Pages compatibility
 * In development, returns the path as-is
 * In production, adds the repository name as prefix
 */
export function getAssetPath(path: string): string {
  // Prefer an explicitly provided public base path (set at build time),
  // fall back to empty string in development. Avoid hardcoding repo names.
  const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // Normalize base so it either is '' or starts with a single leading slash and no trailing slash
  const base = rawBase
    ? `/${rawBase.replace(/^\/+|\/+$/g, '')}`
    : '';

  // Ensure path starts with a single leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalizedPath}`;
}

