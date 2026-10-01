import { Box } from '@mui/system'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'
import { Status } from 'src/@core/components/common'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import HeaderedCard from 'src/views/common/HeaderedCard'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

// ** One label/value line: muted label at the left, value at the right.
const DetailRow = ({ label, children }) => (
  <Box sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
    <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>{label}</Typography>
    <Box sx={{ textAlign: 'right', minWidth: 0 }}>{children}</Box>
  </Box>
)

const valueSx = { fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }

export default function DetailRequestProduct({ data }) {
  const mappedData = useMemo(() => {
    return {
      code: data?.code,
      dateCreated: data?.dateCreated,
      createdAt: data?.createdAt,
      createdBy: data?.createdBy,
      status: data?.status,
      notes: data?.notes,
      listProducts: data?.listProducts || []
    }
  }, [data])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <HeaderedCard title='Details'>
        <Box sx={{ px: 4, py: 2 }}>
          <DetailRow label='Request Code'>
            <Typography sx={valueSx}>{mappedData?.code}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
              {returnFormatDate(mappedData?.createdAt)} - {returnFormatTime(mappedData?.createdAt)}
            </Typography>
          </DetailRow>
          <DetailRow label='Status'>
            <Status status={mappedData?.status} />
          </DetailRow>
          <DetailRow label='Dibuat Oleh'>
            <Typography sx={valueSx}>
              {mappedData?.createdBy?.name || '-'}
              {mappedData?.createdBy?.role ? ` (${mappedData.createdBy.role})` : ''}
            </Typography>
          </DetailRow>
        </Box>
      </HeaderedCard>

      <HeaderedCard title='Catatan'>
        <Box sx={{ px: 4, py: 3 }}>
          <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground, whiteSpace: 'pre-wrap' }}>
            {mappedData?.notes || '-'}
          </Typography>
        </Box>
      </HeaderedCard>

      <DataTable
        columns={[
          { flex: 0.5, minWidth: 180, field: 'productName', headerName: 'Nama Produk' },
          { flex: 0.25, minWidth: 100, field: 'unitName', headerName: 'Satuan' },
          { flex: 0.25, minWidth: 100, field: 'quantityRequested', headerName: 'Kuantiti' }
        ]}
        rows={mappedData.listProducts.map((product, index) => ({ ...product, id: index }))}
        localeText={{ noRowsLabel: 'Tidak ada produk' }}
      />
    </Box>
  )
}
