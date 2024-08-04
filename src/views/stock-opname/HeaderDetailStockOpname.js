import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import CustomTextField from "src/@core/components/mui/text-field";
import Icon from 'src/@core/components/icon'
import { useRouter } from "next/router";



export default function HeaderDetailStockOpname(props) {
  const router = useRouter()
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container gap={4}>
            <Grid container display='flex' gap={4} justifyContent={'space-between'}>
              <Grid item xs={12} md={5.9}>
                <CustomTextField
                  fullWidth
                  value={props?.warehouseName || "-"}
                  label='Nama Gudang'
                  disabled
                  aria-describedby='validation-schema-name'
                />
              </Grid>
              <Grid item xs={12} md={5.9}>
                <CustomTextField
                  fullWidth
                  value={props?.createdAt || "-"}
                  label='Tanggal Stock Opname'
                  placeholder=''
                  disabled
                  aria-describedby='validation-schema-name'
                />
              </Grid>
            </Grid>
            <Grid container flexDirection={'row'} justifyContent={'space-between'}>
              <Grid item gap={2} flexDirection={'column'}>
                <Typography fontWeight={600} variant="body2" sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '3.5rem' }}>Code</span>: {props?.code || "-"}
                </Typography>
                <Typography fontWeight={600} variant="body2" sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '1rem' }}>Dibuat Oleh</span>: {props?.creatorName || "-"}
                </Typography>
                <Typography fontWeight={600} variant="body2" sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '3rem' }}>Status</span>: {props?.status}
                </Typography>
              </Grid>
              {props.type === 'DETAIL' && props?.status === 'DRAFT' && <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant='tonal'
                  color='primary' onClick={() => router.push(`/stock-opname/${props?.id}/edit`)}
                  startIcon={<Icon icon='tabler:edit' />}>
                  Edit
                </Button>
              </Grid>}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}