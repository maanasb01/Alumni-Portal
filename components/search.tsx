"use client";

import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Input } from "./ui/input";
import { searchUsers } from "@/data/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { RotatingLines } from "react-loader-spinner";

export default function Search() {
  const [results, setResults] = useState<any[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // At initial render check if the url has any search query and if it is present, search it.
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has("query")) {
      const q = params.get("query");
      if (q) {
        handleSearch(q);
      }
    }
  }, []);

  // To fetch more results for the searched query
  async function showMoreResults() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams(searchParams);
      if (params.has("query")) {
        const q = params.get("query");
        if (q) {
          const moreEntries = await searchUsers(q, page + 1);
          setPage(page + 1);
          if (moreEntries.length === 0 || moreEntries.length < 10) {
            setShowMore(false);
          } else {
            setResults((prevRes) => [...prevRes, ...moreEntries]);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        "An error occurred while loading more results. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(term: string) {
    try {
      setPage(0);
      setShowMore(true);
      setLoading(true);
      setError(null);
      const params = new URLSearchParams(searchParams);
      if (term.length > 0 && term.length < 3) {
        // A quick fix to notify user
        setResults([
          {
            organization: {
              name: "Please write at least 3 characters to search.",
            },
          },
        ]);
      } else if (term.length >= 3) {
        params.set("query", term);
        router.replace(`${pathname}?${params.toString()}`);
        const results = await searchUsers(term, 0);
        setResults(results);
        if (results.length < 10) setShowMore(false);
        setHighlightedIndex(null);
      } else {
        params.delete("query");
        router.replace(`${pathname}?${params.toString()}`);
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Debounce function to optimize searching
  const debouncedHandleSearch = debounce(handleSearch, 300);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex === results.length - 1
          ? 0
          : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex === 0
          ? results.length - 1
          : prevIndex - 1
      );
    } else if (e.key === "Enter" && highlightedIndex !== null) {
      const selectedUser = results[highlightedIndex];
      redirectToUser(selectedUser);
    }
  };

  // Redirect to user page after selecting the user
  function redirectToUser(selectedUser: any) {
    router.push(`/profile/${selectedUser.id}`);
  }

  return (
    <div
      className="flex flex-col w-full p-4 outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="sticky top-0 z-10 bg-gray-200 w-full pt-1 pb-5">
        <Input
          className="p-2 h-16 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-lg"
          placeholder="Search Users by Name, Organization or Email"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => debouncedHandleSearch(e.target.value)}
          tabIndex={0}
        />
      </div>
      {!error ? (
        <div className="mt-4 space-y-2">
          {results.length !== 0 ? (
            results.map((user, index) => (
              <div
                onClick={() => redirectToUser(user)}
                key={user.id}
                className={`p-4 border bg-white cursor-pointer border-gray-200 rounded-md shadow-sm transition-colors hover:bg-blue-200 ${
                  highlightedIndex === index ? "bg-blue-300" : ""
                }`}
              >
                <div className="text-lg font-semibold">{user.name}</div>
                {user.organization && (
                  <div className="text-sm text-gray-600">
                    {user.organization.name}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-400">
              No Entries to Display
            </p>
          )}

          {results && results.length !== 0 && showMore && (
            <Button className="flex mx-auto" onClick={showMoreResults}>
              Show More
            </Button>
          )}
          {loading && (
            <div className=" flex justify-center h-10 ">
              <RotatingLines strokeColor="gray" visible={true} />
            </div>
          )}
          {results && results.length !== 0 && !showMore && (
            <p className="text-sm text-gray-500 text-center">No More Entries</p>
          )}
        </div>
      ) : (
        <div className="text-red-500 text-center py-2">{error}</div>
      )}
    </div>
  );
}
