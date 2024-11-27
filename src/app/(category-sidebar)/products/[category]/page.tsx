import { notFound } from "next/navigation";
import Image from "next/image";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { getCategory, getCategoryProductCount } from "@/lib/queries";

import { Link } from "@/components/ui/link";

export async function generateStaticParams() {
  return await db.select({ category: categories.slug }).from(categories);
}

export interface ProductsPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { category } = await params;
  const urlDecoded = decodeURIComponent(category);
  const cat = await getCategory(urlDecoded);

  if (!cat) {
    return notFound();
  }

  const countRes = await getCategoryProductCount(urlDecoded);
  const finalCount = countRes[0]?.count ?? 0;

  return (
    <div className="container p-4">
      {finalCount && (
        <h1 className="mb-2 border-b-2 text-sm font-bold">
          {finalCount} {finalCount === 1 ? "Product" : "Products"}
        </h1>
      )}
      <div className="space-y-4">
        {cat.subcollections.map((subCollection) => (
          <div key={subCollection.id}>
            <h2 className="mb-2 border-b-2 text-lg font-semibold">
              {subCollection.name}
            </h2>
            <div className="flex flex-row flex-wrap gap-2">
              {subCollection.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.name}
                  href={`/products/${urlDecoded}/${subcategory.slug}`}
                  className="group flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm sm:w-[200px]"
                >
                  <div className="py-2">
                    <Image
                      loading="eager"
                      decoding="sync"
                      src={subcategory.image_url ?? "/placeholder.svg"}
                      alt={`A small picture of ${subcategory.name}`}
                      width={48}
                      height={48}
                      quality={65}
                      className="h-12 w-12 flex-shrink-0 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 group-hover:underline">
                      {subcategory.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
