export function getAbsolutePath(path) {
  if (typeof path !== "string") return path;

  if (path.startsWith("http")) {
    return path;
  }

  let currentDomain = process.env.NEXT_PUBLIC_FE_URL || "";

  if (typeof window !== "undefined") {
    currentDomain = window.location.origin;
  }

  // Remove extra slashes between currentDomain and path
  const cleanedPath = path.replace(/^\/+/, ""); // Remove starting slashes
  const cleanedDomain = currentDomain.replace(/\/+$/, ""); // Remove trailing slashes

  return `${cleanedDomain}/${cleanedPath}`;
}
