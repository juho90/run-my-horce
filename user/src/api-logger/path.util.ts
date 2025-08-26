export function normalizePath(path: string): string {
  return path.replace(/\d+/g, ':id');
}
