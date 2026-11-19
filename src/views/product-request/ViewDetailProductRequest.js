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
 * ViewDetailProductRequest
 * -------------------------------------------------------------------------------------
 * The product-request document: letterhead, the requested products, notes and the creator signature.
 * Layout comes from `OrderDocumentParts`, shared with the Sales / Purchase Order and
 * mirrored by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const ViewDetailProductRequest = ({ data }) => {
  const dispatch = useDispatch()
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  if (!data) return null

  return (
    <OrderDocumentCard>
      <OrderLetterhead company={companyInfo} title='Surat Product Request' code={data.code} />

      <OrderItemsTable
        title='Daftar Produk'
        items={data?.listProducts}
        columns={[
          { header: 'Produk', render: item => item?.productName },
          { header: 'Unit', render: item => item?.unitName || '-' },
          { header: 'Request', render: item => item?.quantityRequested ?? '-' }
        ]}
      />

      <OrderNotes notes={data?.notes} />

      <OrderSignatureRow blocks={[{ label: 'Dibuat Oleh', name: data?.createdBy?.name, timestamp: data?.createdAt }]} />
    </OrderDocumentCard>
  )
}

export default ViewDetailProductRequest
