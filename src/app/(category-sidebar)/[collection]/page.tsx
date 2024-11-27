import Image from "next/image";

import { db } from "@/db";
import { collections } from "@/db/schema";
import { getCollectionDetails } from "@/lib/queries";

import { Link } from "@/components/ui/link";

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

export async function generateStaticParams() {
  return await db.select({ collection: collections.slug }).from(collections);
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collectionName = decodeURIComponent((await params).collection);

  const collections = await getCollectionDetails(collectionName);
  let imageCount = 0;

  return (
    <div className="w-full p-4">
      {collections.map((collection) => (
        <div key={collection.name}>
          <h2 className="text-xl font-semibold">{collection.name}</h2>
          <div className="flex flex-row flex-wrap justify-center gap-2 border-b-2 py-4 sm:justify-start">
            {collection.categories.map((category) => (
              <Link
                prefetch={true}
                key={category.name}
                className="w-[125px] flex flex-col flex-wrap items-center justify-center text-center rounded-md border p-2 hover:bg-accent2"
                href={`/products/${category.slug}`}
              >
                <Image
                  loading={imageCount++ < 15 ? "eager" : "lazy"}
                  decoding="sync"
                  src={category.image_url ?? "/placeholder.svg"}
                  alt={`A small picture of ${category.name}`}
                  className="mb-2 h-14 w-14 border hover:bg-accent2"
                  width={48}
                  height={48}
                  quality={65}
                />
                <span className="text-xs">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
