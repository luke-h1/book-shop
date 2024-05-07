import StarRating from '@frontend/components/StarRating';
import Tile from '@frontend/components/Tile';
import bookService from '@frontend/services/bookService';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const book = await bookService.fetchBook(params.id);

  return (
    <div className="flex flex-col items-center w-full">
      <Link
        className="p-3 mb-8 mr-auto rounded dark:text-white hover:font-bold hover:opacity-80"
        href="/"
      >
        ← Back to all books
      </Link>
      <div className="flex flex-col w-full md:flex-row">
        <div className="w-1/4 mr-6 flex-none relative aspect-[2/3] mb-6">
          <Tile src={book.image} title={book.title} />
        </div>
        <div>
          <div className="mb-2 text-5xl font-bold">{book.title}</div>
          <div className="mb-4 text-lg">{book.author}</div>
          <StarRating rating={book.rating} />
          <div className="mt-4 opacity-80">{book.description}</div>
        </div>
      </div>
    </div>
  );
}
