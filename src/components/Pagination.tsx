'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const generatePagination = (
  currentPage: number,
  totalPages: number,
): (string | number)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

interface ArrowProps {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}

function PaginationArrow({ direction, href, isDisabled }: ArrowProps) {
  const className = clsx('flex h-10 w-10 items-center justify-center', {
    'pointer-events-none text-gray-300': isDisabled,
    'hover:text-black dark:hover:text-white': !isDisabled,
    'mr-2 md:mr-4': direction === 'left',
    'ml-2 md:ml-4': direction === 'right',
  });

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

interface PaginationNumberProps {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}

function PaginationNumber({
  href,
  isActive,
  page,
  position,
}: PaginationNumberProps) {
  const className = clsx('flex h-10 w-10 items-center justify-center text-sm', {
    'rounded-l-md': position === 'first' || position === 'single',
    'rounded-r-md': position === 'last' || position === 'single',
    'z-10 dark:text-white text-black font-bold': isActive,
    'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white':
      !isActive && position !== 'middle',
    '': position === 'middle',
  });

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

interface Props {
  totalPages: number;
}

export default function Pagination({ totalPages }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageUrl = (pageNumber: number | string): string => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageUrl(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />
      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) {
            position = 'first';
          }

          if (index === allPages.length - 1) {
            position = 'last';
          }

          if (allPages.length === 1) {
            position = 'single';
          }

          if (page === '...') {
            position = 'middle';
          }

          return (
            <PaginationNumber
              key={page}
              href={createPageUrl(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>
      <PaginationArrow
        direction="right"
        href={createPageUrl(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}
