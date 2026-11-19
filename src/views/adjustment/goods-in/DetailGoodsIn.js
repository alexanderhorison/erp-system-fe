import { useSelector } from 'react-redux'

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
 * DetailGoodsIn
 * -------------------------------------------------------------------------------------
 * The goods-in document: destination warehouse, the product table, notes and both signatures.
 * Layout comes from `OrderDocumentParts`, shared with the Sales / Purchase Order and
 * mirrored by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const DetailGoodsIn = ({ data }) => {
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  if (!data) return null

  return (
    <OrderDocumentCard>
      <OrderLetterhead company={companyInfo} title='Barang Masuk' code={data.code} />

      <OrderInfoBoxes
        boxes={[
          {
            title: 'Gudang Tujuan',
            content: <WarehouseInfo name={data?.warehouseDestinationName} location={data?.warehouseLocation} />
          }
        ]}
      />

      <OrderItemsTable
        title='Daftar Produk'
        items={data?.listProduct}
        columns={[
          { header: 'Produk', render: item => item?.productName },
          { header: 'Unit', render: item => item?.unitName || '-' },
          { header: 'Total', render: item => item?.quantity ?? '-' }
        ]}
      />

      <OrderNotes notes={data?.notes} />

      <OrderSignatureRow
        blocks={[
          { label: 'Dibuat Oleh', name: data?.createdBy, timestamp: data?.createdAt },
          { label: 'Diterima Oleh', name: data?.approvedBy, timestamp: data?.approvedAt }
        ]}
      />
    </OrderDocumentCard>
  )
}

export default DetailGoodsIn
