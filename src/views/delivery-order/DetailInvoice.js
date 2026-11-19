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
 * DetailInvoice
 * -------------------------------------------------------------------------------------
 * The delivery-order (Surat Jalan) document: origin and destination warehouses, the delivered products, notes and the creator signature.
 * Layout comes from `OrderDocumentParts`, shared with the Sales / Purchase Order and
 * mirrored by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const DetailInvoice = ({ data }) => {
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
        title='Surat Jalan'
        code={data.code}
        reference={{
          label: 'Product Request',
          href: `/product-request/${data?.productRequestCode}`,
          code: data?.productRequestCode
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
          { header: 'Rak', render: item => item?.rackName || '-' },
          { header: 'Unit', render: item => item?.unitName || '-' },
          { header: 'Total', render: item => item?.quantity ?? '-' }
        ]}
      />

      <OrderNotes notes={data?.notes} />

      <OrderSignatureRow blocks={[{ label: 'Dibuat Oleh', name: data?.creatorBy?.name, timestamp: data?.createdAt }]} />
    </OrderDocumentCard>
  )
}

export default DetailInvoice
