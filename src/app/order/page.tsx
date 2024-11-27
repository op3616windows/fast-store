import { Metadata } from "next";
import { Suspense } from "react";

import { PlaceOrderAuth } from "@/app/auth.server";
import { CartItems, TotalCost } from "./dynamic";

export const metadata: Metadata = {
  title: "Order",
};

export default async function OrderPage() {
  return (
    <div className="min-h-screen sm:p-4">
      <div className="container mx-auto p-1 sm:p-3">
        <div className="flex items-center justify-between border-b border-gray-200">
          <h1 className="text-2xl text-accent1">Order</h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <Suspense>
              <CartItems />
            </Suspense>
          </div>
          <div className="col-span-1">
            <div className="rounded bg-gray-100 p-4 mb-4">
              <p className="font-semibold">
                Merchandise{" "}
                <Suspense>
                  <TotalCost />
                </Suspense>
              </p>
              <p className="text-sm text-gray-500">
                Applicable shipping and tax will be added.
              </p>
            </div>
            <Suspense>
              <PlaceOrderAuth />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
