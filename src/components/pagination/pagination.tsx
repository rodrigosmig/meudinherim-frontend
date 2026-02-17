import { Button } from "../primitives/button";

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
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400">
        <span className="font-medium text-white">1 - 10</span> de <span
          className="font-medium text-white">45</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="pagination">
          &lt;
        </Button>
        <Button variant="pagination">1</Button>
        <Button variant="pagination">2</Button>

        <span className="px-3 py-2 text-sm text-gray-400">...</span>
        <Button variant="pagination">7</Button>
        <Button variant="pagination">8</Button>
        <Button variant="pagination">
          &gt;
        </Button>
      </div>
    </div>
  )
}