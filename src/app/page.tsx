import Grid from '@frontend/components/Grid';
import { LoadingSkeleton } from '@frontend/components/LoadingSkeleton';
import Pagination from '@frontend/components/Pagination';
import Panel from '@frontend/components/Panel';
import Search from '@frontend/components/Search';
import bookService from '@frontend/services/bookService';
import { Suspense } from 'react';

interface Props {
  searchParams: { query?: string; author?: string | string[]; page?: string };
}

export default async function Page({ searchParams }: Props) {
  const query = searchParams.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const allAuthors = await bookService.fetchAuthors();

  // eslint-disable-next-line no-nested-ternary
  const selectedAuthors = !searchParams.author
    ? []
    : typeof searchParams.author === 'string'
      ? [searchParams.author]
      : searchParams.author;

  const totalPages = await bookService.fetchPages(query, selectedAuthors);

  return (
    <main className="flex flex-col justify-between w-full">
      <Search />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
      <div className="flex flex-col gap-6 py-6 lg:flex-row">
        <Panel authors={selectedAuthors} allAuthors={allAuthors} />
        <Suspense fallback={<LoadingSkeleton />}>
          <Grid
            selectedAuthors={selectedAuthors}
            query={query}
            page={currentPage}
          />
        </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
