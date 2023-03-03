import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ReactPaginate from "react-paginate";

interface Props {
  pageCount: number;
  onChange: ({ selected }: { selected: number }) => void;
}

export default function Pagination({ pageCount, onChange }: Props) {
  return (
    <ReactPaginate
      onPageChange={onChange}
      pageCount={pageCount}
      className="flex items-center gap-3 rounded-full bg-gray-100 p-1 text-sm dark:bg-gray-700"
      activeClassName="font-bold text-blue-500"
      disabledClassName="text-gray-500"
      nextLabel={<FiChevronRight />}
      previousLabel={<FiChevronLeft />}
    />
  );
}
