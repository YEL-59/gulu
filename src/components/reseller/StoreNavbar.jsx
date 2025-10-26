"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function StoreNavbar({ basePath = "" }) {
  const params = typeof useParams === "function" ? useParams() : {};
  const slugParam = Array.isArray(params?.slug)
    ? params.slug[0]
    : typeof params?.slug === "string"
    ? params.slug
    : undefined;
  const computedBase = basePath || (slugParam ? `/reseller/${slugParam}` : "");

  return (
    <nav className="bg-white border border-gray-200 rounded-lg p-2 mb-6">
      <ul className="flex flex-wrap items-center gap-3 text-sm">
        <li>
          <Link className="px-3 py-2 rounded-md hover:bg-gray-100" href={computedBase || "/"}>
            Home
          </Link>
        </li>
        <li>
          <Link className="px-3 py-2 rounded-md hover:bg-gray-100" href={`${computedBase}/products`}>
            Products
          </Link>
        </li>
        <li>
          <a className="px-3 py-2 rounded-md hover:bg-gray-100" href="#about">About</a>
        </li>
        <li>
          <Link className="px-3 py-2 rounded-md hover:bg-gray-100" href={`${computedBase}/contacts`}>
            Contacts
          </Link>
        </li>
      </ul>
    </nav>
  );
}