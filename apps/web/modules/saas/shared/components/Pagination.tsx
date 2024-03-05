import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";

export interface PaginatioProps {
  className?: string;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onChangeCurrentPage: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  className,
  onChangeCurrentPage,
}: PaginatioProps) => {
  const numberOfPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onChangeCurrentPage(currentPage - 1)}
        >
          <Icon.chevronLeft />
        </Button>
        <span className="text-sm text-gray-500">
          {currentPage * itemsPerPage - itemsPerPage + 1} -{" "}
          {currentPage * itemsPerPage > totalItems
            ? totalItems
            : currentPage * itemsPerPage}{" "}
          of {totalItems}
        </span>
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === numberOfPages}
          onClick={() => onChangeCurrentPage(currentPage + 1)}
        >
          <Icon.chevronRight />
        </Button>
      </div>
    </div>
  );
};
Pagination.displayName = "Pagination";

export { Pagination };
