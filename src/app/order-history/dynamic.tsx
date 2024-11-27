import { getUser } from "@/lib/queries";

export async function OrderHistoryDynamic() {
  const user = await getUser();
  return user ? (
    <div className="border-t border-gray-200 pt-6 rounded-lg shadow-sm bg-white">
      <table className="w-full">
        <thead>
          <tr className="text-left font-medium text-gray-600 border-b border-gray-100">
            <th className="w-1/2 pb-4 px-6">Product</th>
            <th className="w-1/4 pb-4 px-6">Last Order Date</th>
            <th className="w-1/4 pb-4 px-6">Purchase Order</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="py-12 text-center">
              <div className="space-y-2">
                <p className="text-gray-500">You have no previous orders.</p>
                <p className="text-gray-400 text-sm">
                  When you place an order, it will appear here.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <p className="font-semibold text-gray-800">
        Log in to view order history
      </p>
    </div>
  );
}
