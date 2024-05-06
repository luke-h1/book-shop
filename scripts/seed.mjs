/* eslint-disable no-console */
import { db } from '@vercel/postgres';
import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';
import '../env.mjs';

const parseCsv = async filePath => {
  const file = fs.readFileSync(path.resolve(filePath), 'utf-8');
  return new Promise(res => {
    Papa.parse(file, {
      header: true,
      complete: results => {
        res(results.data);
      },
    });
  });
};

async function seed(client) {
  const booksTable = await client.sql`
  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(255) UNIQUE NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "year" INT,
    publisher VARCHAR(255),
    "image" VARCHAR(255),
    "description" TEXT,
    "rating" NUMERIC,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  `;
  console.info('[seed]: Table `books` created');

  const booksData = await parseCsv(path.resolve('./books.csv'));

  const promises = booksData.map((book, index) => {
    if (!book.isbn) {
      console.error(
        `[seed]: Book at index ${index} is missing an ISBN, skipping`,
      );
      return Promise.resolve();
    }
    return client.sql`
    INSERT INTO books (isbn, "title", "author", "year", publisher, "image", "description", "rating")
    VALUES (${book.bookId}, ${book.title}, ${book.author}, ${book.publisherDate}, ${book.Publisher}, ${book.coverImg}, ${book.description}, ${book.rating})
    ON CONFLICT (isbn) DO NOTHING;
    `;
  });

  const results = await Promise.all(promises);
  console.info(`[seed]: Inserted ${results.length} books into DB`);

  return {
    booksTable,
    seededBooks: results.length,
  };
}

async function main() {
  const client = await db.connect();
  await seed(client);
  await client.end();
}

main().catch(e => console.error('[seed]: Error seeding DB', e));
