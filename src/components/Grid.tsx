import bookService from '@frontend/services/bookService';
import Link from 'next/link';
import Tile from './Tile';

interface Props {
  selectedAuthors: string[];
  query: string;
  page: number;
}

export default async function Grid({ page, query, selectedAuthors }: Props) {
  const books = await bookService.fetchFilteredBooks(
    selectedAuthors,
    query,
    page,
  );
  return (
    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {books.length === 0 ? (
        <p className="text-center text-gray-400 col-span-full">
          No books found.
        </p>
      ) : (
        books.map(book => (
          <Link
            href={`/${book.id}`}
            key={book.id}
            className="mb-auto transition ease-in-out hover:scale-110 bg-black/10 dark:bg-white/10 rounded-lg"
          >
            <div className="relative w-full aspect-[2/3]">
              <Tile src={book.image} title={book.title} />
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
