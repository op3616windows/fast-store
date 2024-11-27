import Image from "next/image";
import { Link } from "@/components/ui/link";

interface Product {
  name: string;
  slug: string;
  image_url: string | null;
  description: string;
  price: string;
  subcategory_slug: string;
}

interface ProductCardProps {
  product: Product;
  imageLoading?: "eager" | "lazy";
  category_slug: string;
}

export function ProductCard({
  product,
  category_slug,
  imageLoading,
}: ProductCardProps) {
  return (
    <Link
      prefetch={true}
      href={`/products/${category_slug}/${product.subcategory_slug}/${product.slug}`}
      className="group block overflow-hidden rounded-lg border p-4 transition-all hover:border-gray-300"
    >
      <div className="relative h-[200px] w-full">
        {product.image_url ? (
          <Image
            loading={imageLoading ?? "eager"}
            decoding="sync"
            src={product.image_url}
            alt={`A picture of ${product.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium truncate">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 font-bold">${product.price}</p>
      </div>
    </Link>
  );
}
