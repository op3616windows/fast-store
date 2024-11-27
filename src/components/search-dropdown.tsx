"use client";

import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Product } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ProductSearchResult } from "@/app/api/search/route";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

type SearchResult = Product & { href: string };

export function SearchDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredItems([]);
    } else {
      setIsLoading(true);
      const searchedFor = searchTerm;
      fetch(`/api/search?q=${searchTerm}`).then(async (results) => {
        const currentSearchTerm = inputRef.current?.value;
        if (currentSearchTerm !== searchedFor) {
          return;
        }
        const json = await results.json();

        setFilteredItems(json as ProductSearchResult);
        setIsLoading(false);
      });
    }
  }, [searchTerm, inputRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (!params.product) {
      const subCategory = params.subcategory;
      setSearchTerm(
        typeof subCategory === "string" ? subCategory.replaceAll("-", " ") : ""
      );
    }
  }, [params]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredItems.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredItems.length - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
        router.push(filteredItems[highlightedIndex].href);
        setSearchTerm(filteredItems[highlightedIndex].name);
        setIsOpen(false);
      }
    } else if (event.key === "Escape") {
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  return (
    <div className="font-sans" ref={dropdownRef}>
      <div className="relative flex-grow">
        <div className="relative">
          <Input
            ref={inputRef}
            autoComplete="off"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(e.target.value.length > 0);
              setHighlightedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="pr-12 font-medium sm:w-[300px] md:w-[375px]"
          />
          <X
            className={cn("absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2", {
              hidden: !isOpen,
            })}
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
              setFilteredItems([]);
              inputRef.current?.focus();
            }}
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full border border-gray-200 bg-white shadow-lg">
            <ScrollArea className="max-h-[300px] overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={item.slug}
                    className={cn("cursor-pointer px-4 py-2 hover:bg-accent2", {
                      "bg-accent2": highlightedIndex === index,
                    })}
                    onClick={() => {
                      router.push(item.href);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {item.name}
                  </div>
                ))
              ) : isLoading ? (
                <div className="px-4 py-2">Loading...</div>
              ) : (
                <div className="px-4 py-2">No results found</div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
