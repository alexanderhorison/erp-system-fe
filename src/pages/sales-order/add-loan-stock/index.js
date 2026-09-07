import AddSalesOrderLoan from 'src/views/sales-order/AddSalesOrderLoan'
import useCollapsedSidebar from 'src/hooks/useCollapsedSidebar'

export default function AddSalesOrderLoanPage() {
  useCollapsedSidebar()

  return <AddSalesOrderLoan />
}
