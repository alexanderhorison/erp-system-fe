// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import DownloadButton from 'src/views/components/buttons/ButtonDownload'
import { useState } from 'react'
import { CardHeader, Chip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CustomChip from 'src/@core/components/mui/chip'


const ToolbarProductRequest = ({ id, data }) => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <>
      <Card>
        <CardContent>
          <DownloadButton url={'product-request'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
        </CardContent>
      </Card>
      <Card sx={{ marginTop: '1rem' }}>
        <CardHeader
          title='Informasi Tambahan'
          action={<CustomChip rounded label={`Important!`} skin='light' color={`warning`} />}
        />
        <CardContent>
          {/* Delivery Order Codes */}
          {data?.deliveryOrderCode?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Surat Jalan:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {data.deliveryOrderCode.map((orderCode, index) => (
                  <Chip
                    key={index}
                    label={orderCode}
                    color="primary"
                    variant="contained"
                    component="a"
                    href={`/delivery-order/${orderCode}`}
                    target="_blank"
                    clickable
                  />
                ))}
              </Box>
            </Box>
          )}
          {data?.status === "APPROVED" && data?.deliveryOrderCode.length == 0 && (
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tidak ada surat jalan yang di proses karna semua product yang diberikan dengan quantity 0
            </Typography>
          )
          }
        </CardContent>
      </Card >
    </>

  )
}

export default ToolbarProductRequest
