"use client";

import Masonry from "react-masonry-css";

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
}

const breakpointColumns = {
  default: 3,
  1024: 2,
  640: 1,
};

export function MasonryGrid({ children, className = "" }: MasonryGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className={`flex -ml-4 w-auto ${className}`}
      columnClassName="pl-4 bg-clip-padding"
    >
      {children}
    </Masonry>
  );
}
