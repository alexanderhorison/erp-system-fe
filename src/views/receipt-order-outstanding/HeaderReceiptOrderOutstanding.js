import { Grid, Table, TableBody, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { LinkStyled } from "src/pages/components/swiper";
import { styled, useTheme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

export default function HeaderReceiptOrderOutstanding({ data }) {
  const theme = useTheme()

  return (
    <Grid item sm={6} xs={12}>
      <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
        <Table sx={{ maxWidth: '15rem' }}>
          <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
            {
              data?.code && (
                <TableRow>
                  <MUITableCell>
                    <Typography variant='h6'>Surat Outstanding</Typography>
                    <Typography variant='h6'>
                      <LinkStyled href={`/receipt-order-outstanding/${data.code}`} target='_blank'>
                        {`#${data.code}`}
                      </LinkStyled>
                    </Typography>
                  </MUITableCell>
                </TableRow>
              )
            }
            {
              data?.deliveryOrderReceiptCode && (
                <TableRow>
                  <MUITableCell>
                    <Typography variant='h6'>Penerimaan Surat Jalan</Typography>
                    <Typography variant='h6'>
                      <LinkStyled href={`/receive-order/${data.deliveryOrderReceiptCode}`} target='_blank'>
                        {`#${data.deliveryOrderReceiptCode}`}
                      </LinkStyled>
                    </Typography>
                  </MUITableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </Box>
    </Grid>
  )
}