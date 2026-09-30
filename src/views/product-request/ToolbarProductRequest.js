import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

// ** Design Tokens
import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

const ToolbarProductRequest = ({ id, data }) => {
  const [isLoading, setIsLoading] = useState(false)

  const deliveryOrders = data?.deliveryOrderCode || []
  const noDeliveryOrder = data?.status === 'APPROVED' && deliveryOrders.length === 0
  const hasExtraInfo = deliveryOrders.length > 0 || noDeliveryOrder

  return (
    <>
      <HeaderedCard title='Action'>
        <DownloadButton url={'product-request'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
      </HeaderedCard>

      {/* Only rendered when there is something to say — an empty panel is noise. */}
      {hasExtraInfo && (
        <HeaderedCard
          title='Informasi Tambahan'
          action={
            <Chip
              size='small'
              label='Important!'
              sx={{
                height: 20,
                borderRadius: `${radii.full}px`,
                backgroundColor: statusTokens.warning.bg,
                border: `1px solid ${statusTokens.warning.border}`,
                '& .MuiChip-label': {
                  px: 1.5,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  lineHeight: '16px',
                  color: statusTokens.warning.fg
                }
              }}
            />
          }
          sx={{ mt: 4 }}
        >
          {deliveryOrders.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
                Surat Jalan:
              </Typography>
              {deliveryOrders.map((orderCode, index) => (
                <Typography
                  key={index}
                  component='a'
                  href={`/delivery-order/${orderCode}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    lineHeight: '20px',
                    color: colors.link,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': { color: colors.linkHover }
                  }}
                >
                  {orderCode}
                </Typography>
              ))}
            </Box>
          )}

          {noDeliveryOrder && (
            <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
              Tidak ada surat jalan yang di proses karna semua product yang diberikan dengan quantity 0
            </Typography>
          )}
        </HeaderedCard>
      )}
    </>
  )
}

export default ToolbarProductRequest
