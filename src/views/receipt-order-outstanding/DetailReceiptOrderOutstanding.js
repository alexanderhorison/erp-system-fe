import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Configs & Helpers
import { Status } from 'src/@core/components/common'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Shared Components
import {
  mutedSx,
  OrderDocumentCard,
  OrderLetterhead,
  OrderInfoBoxes,
  OrderItemsTable,
  OrderNotes,
  OrderSignatureRow,
  WarehouseInfo
} from 'src/views/common/OrderDocumentParts'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * DetailReceiptOrderOutstanding
 * -------------------------------------------------------------------------------------
 * The outstanding-receipt document. While it is not yet approved the per-product
 * status and the notes are editable (the parent owns `data` via `setData`); once
 * approved they render read-only.
 * Layout comes from `OrderDocumentParts`, shared with the Sales / Purchase Order and
 * mirrored by the backend PDF (`TemplatePdfOrderDocument.js`).
 */
const DetailReceiptOrderOutstanding = ({ data, setData }) => {
  const dispatch = useDispatch()

  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  const isApproved = useMemo(() => data?.status === 'APPROVED', [data?.status])

  const handleStatusChange = (index, newStatus) => {
    const updatedProductOutstandings = data.productOutstandings.map((product, i) =>
      i === index ? { ...product, status: newStatus } : product
    )
    setData({ ...data, productOutstandings: updatedProductOutstandings })
  }

  if (!data) return null

  return (
    <OrderDocumentCard>
      <OrderLetterhead
        company={companyInfo}
        title='Surat Outstanding'
        code={data.code}
        reference={{
          label: 'Penerimaan Surat Jalan',
          href: `/receive-order/${data?.deliveryOrderReceiptCode}`,
          code: data?.deliveryOrderReceiptCode
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
        items={data?.productOutstandings}
        columns={[
          {
            header: 'Produk & Rak',
            render: item => (
              <>
                <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                  {item?.productName} - {item?.unitName || ''}
                </Typography>
                <Typography sx={mutedSx}>{item?.rackName}</Typography>
              </>
            )
          },
          { header: 'Kuantiti Asal', render: item => item?.quantityFrom },
          { header: 'Kuantiti Diterima', render: item => item?.quantityReceived },
          { header: 'Kuantiti Outstanding', render: item => item?.quantityOutstanding },
          {
            header: 'Status',
            render: (item, index) =>
              isApproved ? (
                <Status status={item?.status === 'solved' ? 'APPROVED' : 'PENDING'} />
              ) : (
                <CustomTextField
                  select
                  size='small'
                  fullWidth
                  sx={{ minWidth: 160 }}
                  value={item?.status}
                  onChange={e => handleStatusChange(index, e.target.value)}
                >
                  <MenuItem value='outstanding'>Outstanding</MenuItem>
                  <MenuItem value='solved'>Solved</MenuItem>
                </CustomTextField>
              )
          }
        ]}
      />

      <OrderNotes notes={data?.notes}>
        {!isApproved && (
          <CustomTextField
            fullWidth
            multiline
            rows={3}
            placeholder='Catatan...'
            value={data?.notes || ''}
            onChange={e => setData({ ...data, notes: e.target.value })}
          />
        )}
      </OrderNotes>

      <OrderSignatureRow
        blocks={[
          { label: 'Dibuat Oleh', name: data?.creatorBy?.name, timestamp: data?.createdAt },
          { label: 'Diselesaikan Oleh', name: data?.approverBy?.name, timestamp: data?.approvedAt }
        ]}
      />
    </OrderDocumentCard>
  )
}

export default DetailReceiptOrderOutstanding
