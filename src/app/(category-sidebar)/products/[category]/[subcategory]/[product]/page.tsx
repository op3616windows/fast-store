import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { getProductDetails, getProductsForSubcategory } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { AddToCart } from "@/components/add-to-cart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    product: string;
    subcategory: string;
    category: string;
  }>;
}): Promise<Metadata> {
  const { product: productParam } = await params;
  const urlDecodedProduct = decodeURIComponent(productParam);

  const product = await getProductDetails(urlDecodedProduct);

  if (!product) {
    return notFound();
  }

  return {
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string; subcategory: string; category: string }>;
}) {
  const { product, category, subcategory } = await params;
  const urlDecodedProduct = decodeURIComponent(product);
  const urlDecodedSubcategory = decodeURIComponent(subcategory);
  const [productData, relatedUnshifted] = await Promise.all([
    getProductDetails(urlDecodedProduct),
    getProductsForSubcategory(urlDecodedSubcategory),
  ]);

  if (!productData) {
    return notFound();
  }

  const currentProductIndex = relatedUnshifted.findIndex(
    (p) => p.slug === productData.slug
  );

  const related = [
    ...relatedUnshifted.slice(currentProductIndex + 1),
    ...relatedUnshifted.slice(0, currentProductIndex),
  ];

  return (
    <div className="container p-4 border-t-2">
      <div className="flex flex-col gap-2 md:flex-row">
        <Image
          loading="eager"
          decoding="sync"
          src={productData.image_url ?? "/placeholder.svg?height=64&width=64"}
          alt={`A small picture of ${productData.name}`}
          height={256}
          quality={80}
          width={256}
          className="h-56 w-56 flex-shrink-0 border-2 md:h-64 md:w-64"
        />
        <div className="flex flex-col">
          <h1 className="pt-1 text-xl font-bold text-accent1">
            {productData.name}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {productData.description}
          </p>
          <p className="text-xl font-bold">
            ${parseFloat(productData.price).toFixed(2)}
          </p>
          <AddToCart productSlug={productData.slug} />
        </div>
      </div>
      <div className="pt-8">
        {related.length > 0 && (
          <h2 className="text-lg font-bold text-accent1">
            Explore more products
          </h2>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {related.map((product) => (
            <ProductCard
              key={product.slug}
              category_slug={category}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
