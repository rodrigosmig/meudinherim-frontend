import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./primitives/button";
import Icon from "./primitives/icon";

type PaginationProps = {
  from: number,
  to: number,
  lastPage: number,
  totalRegisters: number;
  currentPage?: number;
  onPageChange: (page: number) => void
}

export default function Pagination({ }: PaginationProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
      <div className="text-sm">
        <span className="font-bold">1 - 10</span> de <span
          className="font-bold">45</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="pagination">
          <Icon icon={ChevronLeft} />
        </Button>
        <Button variant="pagination">1</Button>
        <Button variant="pagination" className="bg-primary text-default-text">2</Button>

        <span className="px-3 py-2 text-sm text-gray-400">...</span>
        <Button variant="pagination">7</Button>
        <Button variant="pagination">8</Button>
        <Button variant="pagination">
          <Icon icon={ChevronRight} />
        </Button>
      </div>
    </div>
  )
}