import { Button, Divider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useMemo, useState } from 'react'
import { Status } from 'src/@core/components/common'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import TablePorductOpenBill from './TableProductOpenBill'
import { generateIdProduct } from 'src/helpers/pos/autoSavePos'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import ModalSendEmailCustomer from '../ModalSendEmailCustomer'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'

// ** Design Tokens
import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

// ** One label/value line: muted label at the left, value at the right.
const DetailRow = ({ label, children }) => (
  <Box sx={{ py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
    <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>{label}</Typography>
    <Box sx={{ textAlign: 'right', minWidth: 0 }}>{children}</Box>
  </Box>
)

const valueSx = { fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }

const SummaryRow = ({ label, value, strong = false, color = colors.foreground }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
    <Typography
      sx={{ fontSize: strong ? '0.9375rem' : '0.8125rem', fontWeight: strong ? 700 : 500, color: colors.foreground }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: strong ? '0.9375rem' : '0.8125rem', fontWeight: strong ? 700 : 500, color }}>
      {value}
    </Typography>
  </Box>
)

export default function DetailOpenBillAndTransaction({ data, type, disableActions = false }) {
  const [openModalEmail, setOpenModalEmail] = useState(false)

  const mappedData = useMemo(() => {
    let temp = {
      ...data,
      id: data?.id,
      customer: data?.customer
    }
    if (type === 'openBill') {
      temp.products = data?.products.map(item => {
        return {
          ...item,
          id: item?.id || generateIdProduct()
        }
      })
      temp.warehouseName = data?.warehouse?.warehouseName
      temp.status = 'OPEN'
      temp.code = data?.id
      temp.totalQuantity = data?.totalItem
      temp.subTotal = data?.subTotalPrice
      temp.grandTotal = data?.subTotalPrice
      temp.totalDiscount = data?.totalDiscount || 0
      ;(temp.createdAt = new Date(+data?.id.split('-')[1])), (temp.createdBy = data?.createdBy || 'Unknown User')
    }
    if (type === 'transaction') {
      temp.products = data?.listProducts
      temp.warehouseName = data?.warehouseName
      temp.status = data?.status
      temp.code = data?.code
      temp.queueNumber = data?.queueNumber
      temp.totalQuantity = data?.totalItems
      temp.change = data?.totalPayment - data?.grandTotal
      temp.createdAt = data?.createdAt
      temp.createdBy = data?.createdBy || 'Unknown User'
    }
    return temp
  }, [data, type])

  const handleEmailReceipt = () => {
    setOpenModalEmail(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 4 }}>
          <HeaderedCard
            title='Details'
            action={
              type !== 'openBill' && !disableActions ? (
                <Button size='small' variant='contained' onClick={handleEmailReceipt}>
                  Email Receipt
                </Button>
              ) : null
            }
          >
            <Box sx={{ px: 4, py: 2 }}>
              <DetailRow label={type === 'openBill' ? 'Bill ID' : 'POS Code'}>
                <Typography sx={valueSx}>{mappedData?.code}</Typography>
              </DetailRow>
              <DetailRow label='Gudang'>
                <Typography sx={valueSx}>{mappedData?.warehouseName}</Typography>
              </DetailRow>
              <DetailRow label='Cashier'>
                <Typography sx={valueSx}>{mappedData?.createdBy || 'Unknown Cashier'}</Typography>
              </DetailRow>
              <DetailRow label='Tanggal'>
                <Typography sx={valueSx}>
                  {returnFormatDate(mappedData?.createdAt)} - {returnFormatTime(mappedData?.createdAt)}
                </Typography>
              </DetailRow>
              <DetailRow label='Status'>
                <Status status={mappedData.status} />
              </DetailRow>
            </Box>
          </HeaderedCard>

          <HeaderedCard title='Customer Information'>
            <Box sx={{ px: 4, py: 3 }}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: mappedData?.customer?.name ? colors.foreground : colors.mutedForeground
                }}
              >
                {mappedData?.customer?.name || '-'}
              </Typography>
            </Box>
          </HeaderedCard>
        </Box>

        <TablePorductOpenBill data={mappedData?.products} />

        {/* Ringkasan */}
        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: `${radii['3xl']}px`,
            border: `1px solid ${statusTokens.success.border}`,
            backgroundColor: statusTokens.success.bg
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>Ringkasan</Typography>
          <SummaryRow label='Total Barang' value={mappedData?.totalQuantity} />
          <SummaryRow label='Sub Total' value={priceFormatWIthCurrency(mappedData?.subTotal)} />
          <SummaryRow label='Discount' value={priceFormatWIthCurrency(mappedData?.totalDiscount)} />
          {type === 'transaction' && (
            <>
              <SummaryRow label='Total Payment' value={priceFormatWIthCurrency(mappedData?.totalPayment)} />
              <SummaryRow
                label={mappedData?.change >= 0 ? 'Change' : 'Sisa Hutang'}
                value={priceFormatWIthCurrency(Math.abs(mappedData?.change))}
                color={mappedData?.change >= 0 ? colors.foreground : colors.destructive}
              />
            </>
          )}
          <Divider sx={{ borderColor: colors.foreground }} />
          <SummaryRow label='Grand Total' value={priceFormatWIthCurrency(mappedData?.grandTotal)} strong />
        </Box>
      </Box>
      {openModalEmail && (
        <ModalSendEmailCustomer
          open={openModalEmail}
          setOpen={setOpenModalEmail}
          customer={mappedData.customer}
          code={mappedData.code}
        />
      )}
    </>
  )
}
