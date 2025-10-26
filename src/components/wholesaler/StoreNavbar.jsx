"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function StoreNavbar({ basePath = "" }) {
  const params = typeof useParams === "function" ? useParams() : {};
  const pathname = typeof usePathname === "function" ? usePathname() : "";
  const slugParam = Array.isArray(params?.slug)
    ? params.slug[0]
    : typeof params?.slug === "string"
    ? params.slug
    : undefined;
  const computedBase = basePath || (slugParam ? `/wholesaler/${slugParam}` : "");

  const isHome = pathname === computedBase;
  const isProducts = pathname === `${computedBase}/products`;
  const isContacts = pathname === `${computedBase}/contacts`;

  return (
    <nav className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-2 mb-6 shadow-sm">
      <ul className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link
            className={`px-3 py-2 rounded-md transition-colors ${
              isHome ? "bg-gray-900 text-white" : "hover:bg-gray-100"
            }`}
            href={computedBase || "/"}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`px-3 py-2 rounded-md transition-colors ${
              isProducts ? "bg-gray-900 text-white" : "hover:bg-gray-100"
            }`}
            href={`${computedBase}/products`}
          >
            Products
          </Link>
        </li>
        <li>
          <a className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" href="#about">About</a>
        </li>
        <li>
          <Link
            className={`px-3 py-2 rounded-md transition-colors ${
              isContacts ? "bg-gray-900 text-white" : "hover:bg-gray-100"
            }`}
            href={`${computedBase}/contacts`}
          >
            Contacts
          </Link>
        </li>
      </ul>
    </nav>
  );
}