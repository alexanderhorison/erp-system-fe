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
 * PageDetailInternalTransfer
 * -------------------------------------------------------------------------------------
 * The internal-transfer document: the warehouse, products moving between racks, notes and both signatures.
 * Layout comes from `OrderDocumentParts`, shared with the Sales / Purchase Order and
 * mirrored by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const PageDetailInternalTransfer = ({ data }) => {
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  if (!data) return null

  return (
    <OrderDocumentCard>
      <OrderLetterhead company={companyInfo} title='Internal Transfer' code={data.code} />

      <OrderInfoBoxes
        boxes={[
          {
            title: 'Gudang Asal',
            content: <WarehouseInfo name={data?.warehouseName} location={data?.warehouseLocation} />
          }
        ]}
      />

      <OrderItemsTable
        title='Daftar Produk'
        items={data?.listProduct}
        columns={[
          { header: 'Produk', render: item => item?.productName },
          { header: 'Unit', render: item => item?.unitName || '-' },
          { header: 'Company', render: item => item?.companyName || '-' },
          { header: 'Rak Asal', render: item => item?.warehouseRackFrom || '-' },
          { header: 'Rak Tujuan', render: item => item?.warehouseRackTo || '-' }
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

export default PageDetailInternalTransfer
