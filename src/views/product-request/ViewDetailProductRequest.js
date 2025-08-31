import { Button, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useTheme } from '@mui/material/styles'
import { Status } from "src/@core/components/common"
import { LinkStyled } from 'src/pages/components/swiper'


const ViewDetailProductRequest = ({ data }) => {
  const theme = useTheme()

  return (
    <Card>
      <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>

        {/* Header Row: Gudang Tujuan + Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3, // 🔹 Bigger bottom margin for clear gap
            pr: 4  // 🔹 Slight padding-right to bring Status closer
          }}
        >
          <Typography fontSize={20}>
            Produk Request #{data?.code || '-'}
          </Typography>
          <Box sx={{ flexShrink: 0 }}>
            <Status status={data?.status} />
          </Box>
        </Box>

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
          variant="outlined"
          component="a"
          href={`/delivery-order/${orderCode}`} // 🔹 Adjust this link to your route
          target="_blank"
          clickable
        />
              ))}
            </Box>
          </Box>
        )}

        {/* Product List */}
        {data?.listProducts?.length > 0 ? (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 3 }}>
              Daftar Produk Request:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Produk</Typography>
              </Grid>
              <Grid item xs={3} sm={4}>
                <Typography variant="subtitle2">Unit</Typography>
              </Grid>
              <Grid item xs={3} sm={4}>
                <Typography variant="subtitle2">Request</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 2 }} />
            {data.listProducts.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                <Grid item xs={6} sm={4}>
                  <Typography>{item.productName || '-'}</Typography>
                </Grid>
                <Grid item xs={3} sm={4}>
                  <Typography>{item.unitName || '-'}</Typography>
                </Grid>
                <Grid item xs={3} sm={4}>
                  <Typography>{item.quantityRequested || 0}</Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Tidak ada produk.
          </Typography>
        )}

        {/* Notes */}
        {data?.notes && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Catatan:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {data.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ViewDetailProductRequest