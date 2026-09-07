import AddPurchaseOrder from 'src/views/purchase-order/AddPurchaseOrder'
import useCollapsedSidebar from 'src/hooks/useCollapsedSidebar'

export default function HomeAddPurchaseOrder() {
  useCollapsedSidebar()

  return <AddPurchaseOrder />
}
