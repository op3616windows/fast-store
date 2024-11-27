"use client";

import { useActionState } from "react";

import { addToCart } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function AddToCart({ productSlug }: { productSlug: string }) {
  const [message, formAction, isPending] = useActionState(addToCart, null);

  return (
    <form className="flex flex-col gap-2" action={formAction}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <Button
        type="submit"
        className="max-w-[150px] rounded-[2px] bg-accent1 hover:bg-accent1/90 px-5 py-1 text-sm font-semibold text-white"
        disabled={isPending}
      >
        {isPending ? "Adding..." : "Add to cart"}
      </Button>
      {!isPending && message && <p>{message}</p>}
    </form>
  );
}
