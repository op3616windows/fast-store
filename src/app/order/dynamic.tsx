import { X } from "lucide-react";
import { cache } from "react";
import Image from "next/image";

import { removeFromCart } from "@/lib/actions";
import { detailedCart } from "@/lib/cart";

import { Link } from "@/components/ui/link";

const getCartItems = cache(() => detailedCart());
type CartItem = Awaited<ReturnType<typeof getCartItems>>[number];

export async function CartItems() {
  const cart = await getCartItems();

  return (
    <>
      {cart.length > 0 && (
        <div className="pb-4">
          <p className="font-semibold text-accent1">Delivers in 2-4 weeks</p>
          <p className="text-sm text-gray-500">Need this sooner?</p>
        </div>
      )}
      {cart.length > 0 ? (
        <div className="flex flex-col space-y-10">
          {cart.map((item) => (
            <CartItem key={item.slug} product={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-lg font-semibold text-gray-700">
            No items in cart
          </p>
          <p className="text-sm text-gray-500">Add some items to get started</p>
        </div>
      )}
    </>
  );
}

function CartItem({ product }: { product: CartItem }) {
  if (!product) {
    return null;
  }

  const cost = (Number(product.price) * product.quantity).toFixed(2);

  return (
    <div className="flex flex-row items-center justify-between border-t border-gray-200 pt-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4">
      <Link
        prefetch={true}
        href={`/products/${product.subcategory.subcollection.category_slug}/${product.subcategory.slug}/${product.slug}`}
        className="flex-1"
      >
        <div className="flex flex-row space-x-4">
          <div className="flex h-32 w-32 items-center justify-center bg-white rounded-lg shadow-sm overflow-hidden">
            <Image
              loading="eager"
              decoding="sync"
              src={product.image_url ?? "/placeholder.svg"}
              alt="Product"
              width={256}
              height={256}
              quality={90}
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col justify-center flex-1">
            <h2 className="font-semibold text-lg mb-2 text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {product.description}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Quantity:</span>
            <p className="font-medium text-gray-800">{product.quantity}</p>
          </div>

          <div className="text-sm text-gray-600">
            <p>${Number(product.price).toFixed(2)} each</p>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            <p>${cost}</p>
          </div>
        </div>
        <form action={removeFromCart}>
          <button
            type="submit"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <input type="hidden" name="productSlug" value={product.slug} />
            <X className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors duration-200" />
          </button>
        </form>
      </div>
    </div>
  );
}

export async function TotalCost() {
  const cart = await getCartItems();

  const totalCost = cart.reduce(
    (acc, item) => acc + item.quantity * Number(item.price),
    0
  );

  return <span> ${totalCost.toFixed(2)}</span>;
}
