import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductsForSubcategory,
  getSubcategory,
  getSubcategoryProductCount,
} from "@/lib/queries";

import { ProductCard } from "@/components/product-card";

export async function generateMetadata(props: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { subcategory: subCategoryParam } = await props.params;
  const urlDecodedCategory = decodeURIComponent(subCategoryParam);

  const [subcategory, rows] = await Promise.all([
    getSubcategory(urlDecodedCategory),
    getSubcategoryProductCount(urlDecodedCategory),
  ]);

  if (!subcategory) {
    return notFound();
  }

  const description = rows[0]?.count
    ? `Choose from over ${rows[0]?.count - 1} products in ${
        subcategory.name
      }. In stock and ready to ship.`
    : undefined;

  return {
    openGraph: { title: subcategory.name, description },
  };
}

export interface SubCategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubCategoryPage({
  params,
}: SubCategoryPageProps) {
  const { subcategory, category } = await params;

  const urlDecodedSubcategory = decodeURIComponent(subcategory);
  const [products, countRes] = await Promise.all([
    getProductsForSubcategory(urlDecodedSubcategory),
    getSubcategoryProductCount(urlDecodedSubcategory),
  ]);

  if (!products) {
    return notFound();
  }

  const finalCount = countRes[0]?.count;

  return (
    <div className="container mx-auto p-4">
      {finalCount > 0 ? (
        <h1 className="mb-2 border-b-2 text-sm font-bold">
          {finalCount} {finalCount === 1 ? "Product" : "Products"}
        </h1>
      ) : (
        <p>No products for this subcategory</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.slug} className="w-full">
            <ProductCard product={product} category_slug={category} />
          </div>
        ))}
      </div>
    </div>
  );
}
