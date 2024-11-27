import { getCollections } from "@/lib/queries";
import { Link } from "@/components/ui/link";

export default async function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCollections = await getCollections();

  return (
    <div className="flex flex-grow font-mono">
      <aside className="hidden w-64 min-w-64 max-w-64 border-r p-4 md:block">
        <h2 className="border-b border-accent1 text-sm font-semibold text-accent1">
          Choose a Category
        </h2>
        <ul className="flex flex-col items-start justify-center">
          {allCollections.map((collection) => (
            <li key={collection.id} className="w-full">
              <Link
                prefetch={true}
                href={`/${collection.slug}`}
                className="block w-full py-1 text-xs hover:bg-accent2 hover:underline"
              >
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main
        className="h-[calc(100vh-113px)] overflow-y-auto p-4 pt-0 w-full"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
