/* eslint-disable no-shadow */

'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition, useState } from 'react';

interface ExpandedSections {
  [key: string]: boolean;
}

interface Props {
  authors: string[];
  allAuthors: string[];
}

export default function Panel({ allAuthors, authors }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimisticAuthors, setOptimisticAuthors] = useOptimistic(authors);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>(
    {},
  );

  const authorGroups = allAuthors.reduce(
    (acc: { [key: string]: string[] }, author: string) => {
      const firstLetter = author[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(author);
      return acc;
    },
    {} as { [key: string]: string[] },
  );

  const toggleSection = (letter: string): void => {
    setExpandedSections((prev: Record<string, boolean>) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
  };

  return (
    <div className="mb-auto bg-white rounded-md shadow-md lg:w-60 dark:shadow-gray-950/30 dark:bg-white/10">
      <div
        data-pending={pending ? '' : undefined}
        className="lg:h-[70vh] md:h-80 overflow-auto"
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold tracking-tight dark:text-gray-100">
            Authors
          </h2>
          {Object.entries(authorGroups).map(([letter, authors]) => (
            <div key={letter}>
              <button
                type="button"
                onClick={() => toggleSection(letter)}
                className="flex items-center justify-between w-ull p-1 mb-1 text-left rounded hover:bg-stone-100 dark:hover:bg-white/20"
              >
                <div>
                  {letter} <span className="text-xs">({authors.length})</span>
                </div>
                <ChevronDownIcon
                  className={`w-4 ${expandedSections[letter] ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-max-height duration-300 ease-in-out flex flex-col gap-1 ${expandedSections[letter] ? '' : 'max-h-0'}`}
              >
                {expandedSections[letter] &&
                  authors.map(author => (
                    <button
                      type="button"
                      onClick={() => {
                        const newAuthors = !optimisticAuthors.includes(author)
                          ? [...optimisticAuthors, author]
                          : optimisticAuthors.filter(a => a !== author);

                        const newParams = new URLSearchParams(
                          // eslint-disable-next-line no-shadow
                          newAuthors.sort().map(author => ['author', author]),
                        );

                        startTransition(() => {
                          setOptimisticAuthors(newAuthors.sort());
                          router.push(`?${newParams}`);
                        });
                      }}
                      key={author}
                      className="flex items-center space-x-2 text-xs text-left"
                    >
                      <input
                        type="checkbox"
                        className=""
                        checked={optimisticAuthors.includes(author)}
                      />
                      <div>{author}</div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {optimisticAuthors.length > 0 && (
        <div className="p-1 bg-white border-t dark:border-black dark:bg-white/10">
          <div className="p-2 text-xs">
            {optimisticAuthors.map(author => (
              <p key={author}>{author}</p>
            ))}
          </div>
          <button
            className="w-full py-2 text-sm font-medium text-center rounded dark:hover:bg-gray-600 hover:bg-black hover:text-white"
            onClick={() =>
              startTransition(() => {
                setOptimisticAuthors([]);
                router.push('/');
              })
            }
            type="button"
          >
            Clear Authors
          </button>
        </div>
      )}
    </div>
  );
}
