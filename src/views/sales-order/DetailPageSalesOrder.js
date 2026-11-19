import { useMemo } from 'react'
import { useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Configs & Helpers
import { UseAuth } from 'src/hooks/useAuth'
import { returnToLocaleDateString } from 'src/helpers/formatDate'

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
 * DetailPageSalesOrder
 * -------------------------------------------------------------------------------------
 * The sales-order document: company letterhead, billing + date boxes, the ordered
 * (and bartered) products, notes / payment info / totals, and both signature blocks.
 * Layout lives in `OrderDocumentParts`, shared with the Purchase Order and mirrored
 * by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const DetailPageSalesOrder = ({ data }) => {
  const { user } = UseAuth()
  const isAdmin = useMemo(() => user?.roleId === 1, [user])

  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  if (!data) return null

  const customerName = data?.customer?.name?.toUpperCase() || ''
  const hasBarter = data?.listBarterProducts?.length > 0

  const productColumns = [
    { header: 'Gudang', render: item => item?.warehouseName },
    { header: 'Produk', render: productCell },
    { header: 'Qty', align: 'center', render: item => item?.quantity ?? '' },
    { header: 'Harga', align: 'right', nowrap: true, render: item => money(item?.price) },
    ...(isAdmin ? [{ header: 'Modal', align: 'right', nowrap: true, render: item => money(item?.modal) }] : []),
    { header: 'Jumlah', align: 'right', nowrap: true, strong: true, render: item => money(item?.subTotal) }
  ]

  const barterColumns = [
    { header: 'Gudang', render: item => item?.warehouseName },
    { header: 'Produk', render: productCell },
    { header: 'Qty', align: 'center', render: item => item?.quantity ?? '' },
    { header: 'Harga', align: 'right', nowrap: true, render: item => money(item?.price) },
    { header: 'Modal Baru', align: 'right', render: item => (item?.isNewModal ? 'Ya' : 'Tidak') },
    { header: 'Jumlah', align: 'right', nowrap: true, strong: true, render: item => money(item?.subTotal) }
  ]

  const paymentSentence =
    data?.grandTotal < 0
      ? `${companyInfo?.ptName} harus melakukan pembayaran sebesar ${money(Math.abs(data?.grandTotal))}`
      : `Customer ${customerName} harus melakukan pembayaran sebesar ${money(data?.grandTotal)}`

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
      <OrderLetterhead
        company={companyInfo}
        title='Sales Order'
        code={data.code}
        note={data?.isLoanStockSO ? 'Loan Stock SO' : null}
      />

      <OrderInfoBoxes
        boxes={[
          {
            title: 'Tagihan Kepada',
            flex: 2,
            content: (
              <>
                <Typography sx={mutedSx}>
                  {[customerName, data?.customer?.phoneNumber].filter(Boolean).join(' - ')}
                </Typography>
                <Typography sx={mutedSx}>{data?.customer?.address?.toUpperCase() || ''}</Typography>
              </>
            )
          },
          {
            title: 'Tgl. Pengiriman',
            content: <Typography sx={mutedSx}>{returnToLocaleDateString(data.shippingDate) || data.dueDate}</Typography>
          },
          { title: 'Tgl. Jatuh Tempo', content: <Typography sx={mutedSx}>{data.dueDate}</Typography> }
        ]}
      />

      <OrderItemsTable title='Barang Sales Order' items={data?.listProducts} columns={productColumns} />

      {hasBarter && <OrderItemsTable title='Barang Barter' items={data?.listBarterProducts} columns={barterColumns} />}

      <OrderSummaryRow
        notes={data?.notes}
        payment={[paymentSentence, companyInfo?.bank].filter(Boolean)}
        totals={[
          { label: 'Total Sales', value: money(data?.grandTotalCustomer) },
          ...(hasBarter ? [{ label: 'Total Barter', value: `- ${money(data?.grandTotalBarter)}` }] : [])
        ]}
        grandTotal={data?.grandTotal}
      />

      <OrderSignatures leftLabel='Penerima' company={companyInfo} />
    </Card>
  )
}

export default DetailPageSalesOrder
