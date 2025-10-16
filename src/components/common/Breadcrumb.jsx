"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import products from "@/lib/data/products.json";

function titleCase(str) {
  return str
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

function findProductLabel(segment) {
  const p = products.find((x) => x.id === segment);
  if (p) return p.name;
  return null;
}

export default function Breadcrumb({ items, className = "" }) {
  const pathname = usePathname();

  // Auto-generate items from pathname if none provided
  const autoItems = (() => {
    const segments = (pathname || "/").split("/").filter(Boolean);

    const base = [{ label: "Home", href: "/" }];
    let href = "";

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      href += `/${seg}`;
      let label = titleCase(seg);

      // Humanize known segments
      const map = {
        store: "Shop",
        product: "Product",
        category: "Category",
      };
      if (map[seg]) label = map[seg];

      // Resolve product id to product name for last segment
      if (i === segments.length - 1) {
        const prod = findProductLabel(seg);
        if (prod) label = prod;
      }

      base.push({ label, href });
    }
    return base;
  })();

  const list = items && items.length ? items : autoItems;

  return (
    <nav
      className={`text-sm text-gray-600 bg-[#E9E9E9] p-4 rounded-md ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-1">
        {list.map((item, idx) => {
          const isLast = idx === list.length - 1;
          return (
            <li key={`${item.href}-${idx}`} className="flex items-center">
              {isLast ? (
                <span className="text-gray-800 font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-accent-500">
                  {item.label}
                </Link>
              )}
              {!isLast && <span className="mx-2 text-gray-400">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
