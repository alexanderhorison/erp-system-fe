import AddSalesOrder from 'src/views/sales-order/AddSalesOrder'
import useCollapsedSidebar from 'src/hooks/useCollapsedSidebar'

export default function HomeAddSalesOrder() {
  useCollapsedSidebar()

  return <AddSalesOrder />
}
