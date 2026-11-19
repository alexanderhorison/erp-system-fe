import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Configs & Helpers
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Shared Components
import {
  mutedSx,
  money,
  productCell,
  OrderLetterhead,
  OrderInfoBoxes,
  OrderItemsTable,
  OrderSummaryRow,
  OrderSignatures
} from 'src/views/common/OrderDocumentParts'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * DetailPagePurchaseOrder
 * -------------------------------------------------------------------------------------
 * The purchase-order document: company letterhead, vendor + due-date boxes, the
 * ordered (and bartered) products, notes / payment info / totals, and both
 * signature blocks. Layout lives in `OrderDocumentParts`, shared with the Sales
 * Order and mirrored by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const DetailPagePurchaseOrder = ({ data }) => {
  const dispatch = useDispatch()
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  if (!data) return null

  const vendorName = data?.vendor?.name?.toUpperCase() || ''
  const hasBarter = data?.listBarterProducts?.length > 0

  const productColumns = [
    { header: 'Gudang', render: item => item?.warehouseName },
    { header: 'Produk', render: productCell },
    { header: 'Qty', align: 'center', render: item => item?.quantity ?? '' },
    { header: 'Harga', align: 'right', nowrap: true, render: item => money(item?.price) },
    { header: 'Modal Baru', align: 'right', render: item => (item?.isNewModal ? 'Ya' : 'Tidak') },
    { header: 'Jumlah', align: 'right', nowrap: true, strong: true, render: item => money(item?.subTotal) }
  ]

  const barterColumns = [
    { header: 'Gudang', render: item => item?.warehouseName },
    { header: 'Produk', render: productCell },
    { header: 'Qty', align: 'center', render: item => item?.quantity ?? '' },
    { header: 'Harga', align: 'right', nowrap: true, render: item => money(item?.price) },
    { header: 'Modal', align: 'right', nowrap: true, render: item => money(item?.modal) },
    { header: 'Jumlah', align: 'right', nowrap: true, strong: true, render: item => money(item?.subTotal) }
  ]

  const paymentSentence =
    data?.grandTotal > 0
      ? `${companyInfo?.ptName} harus melakukan pembayaran sebesar ${money(data?.grandTotal)}`
      : `Vendor ${vendorName} harus melakukan pembayaran sebesar ${money(Math.abs(data?.grandTotal))}`

  return (
    <Card
      elevation={0}
      sx={{
        p: 5,
        gap: 6,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: `${radii['3xl']}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs
      }}
    >
      <OrderLetterhead company={companyInfo} title='Purchase Order' code={data.code} />

      <OrderInfoBoxes
        boxes={[
          {
            title: 'Vendor',
            flex: 3,
            content: (
              <>
                <Typography sx={mutedSx}>
                  {[vendorName, data?.vendor?.phoneNumber].filter(Boolean).join(' - ')}
                </Typography>
                <Typography sx={mutedSx}>{data?.vendor?.address?.toUpperCase() || ''}</Typography>
              </>
            )
          },
          { title: 'Tgl. Jatuh Tempo', content: <Typography sx={mutedSx}>{data.dueDate}</Typography> }
        ]}
      />

      <OrderItemsTable title='Barang Purchase Order' items={data?.listProducts} columns={productColumns} />

      {hasBarter && <OrderItemsTable title='Barang Barter' items={data?.listBarterProducts} columns={barterColumns} />}

      <OrderSummaryRow
        notes={data?.notes}
        payment={[paymentSentence]}
        totals={[
          { label: 'Total Purchase Order', value: money(data?.grandTotalVendor) },
          ...(hasBarter ? [{ label: 'Total Barter', value: `- ${money(data?.grandTotalBarter)}` }] : [])
        ]}
        grandTotal={data?.grandTotal}
      />

      <OrderSignatures leftLabel='Pengirim' company={companyInfo} />
    </Card>
  )
}

export default DetailPagePurchaseOrder
