import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Configs & Helpers
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Shared Components
import {
  OrderDocumentCard,
  OrderLetterhead,
  OrderInfoBoxes,
  OrderItemsTable,
  OrderNotes,
  OrderSignatureRow,
  WarehouseInfo
} from 'src/views/common/OrderDocumentParts'

/**
 * DetailReceiveOrder
 * -------------------------------------------------------------------------------------
 * The delivery-order receipt document: origin and destination warehouses, original vs received quantities, notes and both signatures.
 * Layout comes from `OrderDocumentParts`, shared with the Sales / Purchase Order and
 * mirrored by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const DetailReceiveOrder = ({ data }) => {
  const dispatch = useDispatch()
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  if (!data) return null

  return (
    <OrderDocumentCard>
      <OrderLetterhead
        company={companyInfo}
        title='Penerimaan Surat Jalan'
        code={data.codeReceipt}
        reference={{
          label: 'Surat Jalan',
          href: `/delivery-order/${data?.codeDeliveryOrder}`,
          code: data?.codeDeliveryOrder
        }}
      />

      <OrderInfoBoxes
        boxes={[
          {
            title: 'Gudang Asal',
            content: <WarehouseInfo name={data?.warehouseOrigin?.name} location={data?.warehouseOrigin?.location} />
          },
          {
            title: 'Gudang Tujuan',
            content: (
              <WarehouseInfo name={data?.warehouseDestination?.name} location={data?.warehouseDestination?.location} />
            )
          }
        ]}
      />

      <OrderItemsTable
        title='Daftar Produk'
        items={data?.listProducts}
        columns={[
          { header: 'Produk', render: item => item?.productName },
          { header: 'Unit', render: item => item?.unitName || '-' },
          { header: 'Rak', render: item => item?.rackName || '-' },
          { header: 'Kuantiti Asal', render: item => item?.quantity ?? '-' },
          { header: 'Kuantiti Diterima', render: item => item?.receiveQuantity ?? '-' }
        ]}
      />

      <OrderNotes notes={data?.notes} />

      <OrderSignatureRow
        blocks={[
          { label: 'Dibuat Oleh', name: data?.creatorBy?.name, timestamp: data?.createdAt },
          { label: 'Diterima Oleh', name: data?.receiverBy?.name, timestamp: data?.receivedAt }
        ]}
      />
    </OrderDocumentCard>
  )
}

export default DetailReceiveOrder
