import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 30;

const bookService = {
  async fetchFilteredBooks(
    selectedAuthors: string[],
    query: string,
    currentPage: number,
  ) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    if (selectedAuthors.length > 0) {
      try {
        const authorsDelimited = selectedAuthors.join('|');

        const books = await sql`
          SELECT ALL 
            id,
            isbn,
            "title",
            "author",
            "year",
            publisher,
            image,
            "description",
            "rating",
            "createdAt"
          FROM books
          WHERE
            "author" = ANY(STRING_TO_ARRAY(${authorsDelimited}, '|')) AND (
              isbn ILIKE ${`%${query}%`} OR
              "title" ILIKE ${`%${query}%`} OR
              "author" ILIKE ${`%${query}%`} OR
              "year"::text ILIKE ${`%${query}%`} OR
              publisher ILIKE ${`%${query}%`}
            )
          ORDER BY "createdAt" DESC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
        return books.rows;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[bookService.fetchFilteredBooks] db error', e);
        throw new Error('An error occurred while fetching books');
      }
    }

    try {
      const books = await sql`
        SELECT ALL
          id,
          isbn,
          "title",
          "author",
          "year",
          publisher,
          "image",
          "description",
          "rating",
          "createdAt"
        FROM books
        WHERE 
          isbn ILIKE ${`%${query}%`} OR          
          "title" ILIKE ${`%${query}%`} OR          
          "author" ILIKE ${`%${query}%`} OR          
          "year"::text ILIKE ${`%${query}%`} OR          
          publisher ILIKE ${`%${query}%`}
        ORDER BY "createdAt" DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return books.rows;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[bookService.fetchFilteredBooks] db error', e);
      throw new Error('An error occurred while fetching books');
    }
  },
  async fetchBook(id: string) {
    const data = await sql`SELECT * FROM books WHERE id = ${id}`;
    return data.rows[0];
  },
  async fetchAuthors() {
    try {
      const authors =
        await sql`SELECT DISTINCT "author" FROM books ORDER BY "author"`;
      return authors.rows?.map(row => row.author);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[bookService.fetchAuthors] db error', e);
      throw new Error('An error occurred while fetching authors');
    }
  },
  async fetchPages(query: string, selectedAuthors: string[]) {
    noStore();
    if (selectedAuthors.length > 0) {
      try {
        const authorsDelimited = selectedAuthors.join('|');

        const count = await sql`
          SELECT COUNT(*)
            FROM books
          WHERE 
            "author" = ANY(STRING_TO_ARRAY(${authorsDelimited}, '|')) AND (
              isbn ILIKE ${`%${query}%`} OR
              "title" ILIKE ${`%${query}%`} OR
              "author" ILIKE ${`%${query}%`} OR
              "year"::text ILIKE ${`%${query}%`} OR
              publisher ILIKE ${`%${query}%`}

            )
        `;

        const totalPages = Math.ceil(
          Number(count.rows[0].count) / ITEMS_PER_PAGE,
        );

        return totalPages;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[bookService.fetchPages] db error', e);
        throw new Error('An error occurred while fetching pages');
      }
    }

    try {
      const count = await sql`
        SELECT COUNT(*)
          FROM books
        WHERE 
          isbn ILIKE ${`%${query}%`} OR
          "title" ILIKE ${`%${query}%`} OR
          "author" ILIKE ${`%${query}%`} OR
          "year"::text ILIKE ${`%${query}%`} OR
          publisher ILIKE ${`%${query}%`}
      `;
      const totalPages = Math.ceil(
        Number(count.rows[0].count) / ITEMS_PER_PAGE,
      );
      return totalPages;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[bookService.fetchPages] db error', e);
      throw new Error('An error occurred while fetching pages');
    }
  },
};

export default bookService;
