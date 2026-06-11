export function parseRoute(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";

  if (clean === "/") return { name: "home" };
  if (clean === "/shop") return { name: "shop" };
  if (clean === "/compare") return { name: "compare" };
  if (clean === "/cart") return { name: "cart" };
  if (clean === "/checkout") return { name: "checkout" };
  if (clean === "/account") return { name: "account" };
  if (clean === "/support") return { name: "support" };
  if (clean === "/blog") return { name: "blog" };
  if (clean === "/legal") return { name: "legal" };
  if (clean.startsWith("/product/")) return { name: "product", id: clean.split("/").pop() };

  return { name: "not-found" };
}
