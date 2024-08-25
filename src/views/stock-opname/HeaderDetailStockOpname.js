import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import CustomTextField from "src/@core/components/mui/text-field";
import Icon from 'src/@core/components/icon'
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import CustomAvatar from 'src/@core/components/mui/avatar'

const BoxData = (props) => {
  return (
    <Grid item xs={6} sm={5} md={2.8} >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' color={props?.color || 'primary'} sx={{ mr: 4, width: 42, height: 42 }}>
          <Icon icon={props.icon || ''} fontSize='1rem' />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h7'>{props?.title}</Typography>
          <Typography variant='body2'>{props?.value || "-"}</Typography>
        </Box>
      </Box>
    </Grid>
  )
}

export default function HeaderDetailStockOpname(props) {
  const router = useRouter()

  return (
    <Grid item xs={12} >
      <Card>
        <CardContent>
          <Grid container>
            <Grid container flexDirection={'row'} gap={4}>
              <BoxData
                title={'Nama Gudang'}
                value={props?.warehouseName || "-"}
                icon={'tabler:building-warehouse'}
                color={'primary'}
              />
              <BoxData
                title={'Tanggal Stock Opname'}
                value={props?.createdAt || "-"}
                icon={'tabler:clock'}
                color={'primary'}
              />
              <BoxData
                title={'Code'}
                value={props?.code || "-"}
                icon={'tabler:scan'}
                color={'primary'}
              />
              <BoxData
                title={'Dibuat Oleh'}
                value={props?.creatorName || "-"}
                icon={'tabler:user'}
                color={'primary'}
              />
              {
                props?.status !== 'DRAFT' && (
                  <BoxData
                    title={`${props?.status === 'APPROVED' ? 'Diterima Oleh' :
                      props?.status === 'REJECTED' ? 'Ditolak Oleh' : 'Stock Opname Pending'}`}
                    value={props?.updaterName || "-"}
                    icon={'tabler:eye-check'}
                    color={'primary'}
                  />
                )
              }
              <BoxData
                title={'Status'}
                value={props?.status || "-"}
                icon={
                  props?.status === 'APPROVED' ? 'tabler:check' :
                    props?.status === 'REJECTED' ? 'tabler:x' :
                      props?.status === 'PENDING' ? 'tabler:clock'
                        : 'tabler:notes'}
                color={
                  props?.status === 'APPROVED' ? 'success' :
                    props?.status === 'REJECTED' ? 'error' :
                      props?.status === 'PENDING' ? 'info' :
                        'warning'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}