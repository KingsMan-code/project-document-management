/**
 * Utility function to handle asset paths for GitHub Pages compatibility
 * In development, returns the path as-is
 * In production, adds the repository name as prefix
 */
export function getAssetPath(path: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? '/project-document-management' : '';
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}

