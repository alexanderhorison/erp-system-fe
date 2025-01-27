import { Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";
import { Status } from "src/@core/components/common";
import { priceFormat, priceFormatWIthCurrency } from "src/helpers/priceFormatter";
import TablePorductOpenBill from "./TableProductOpenBill";
import { generateIdProduct } from "src/helpers/pos/autoSavePos";
import { returnFormatDate, returnFormatDateDay, returnFormatTime } from "src/helpers/formatDate";


export default function DetailOpenBillAndTransaction({ data, type }) {

  const title = {
    openBill: 'Bill Details',
    transaction: 'Transaction Details'
  }

  const mappedData = useMemo(() => {
    let temp = {
      ...data,
      id: data?.id,
      customer: data?.customer,
    }
    if (type === 'openBill') {
      temp.products = data?.products.map(item => {
        return {
          ...item,
          id: item?.id || generateIdProduct()
        }
      })
      temp.warehouseName = data?.warehouse?.warehouseName
      temp.status = "OPEN"
      temp.code = data?.id
      temp.totalQuantity = data?.totalItem
      temp.subTotal = data?.subTotalPrice
      temp.grandTotal = data?.subTotalPrice
      temp.totalDiscount = data?.totalDiscount || 0
      temp.createdAt = new Date(+data?.id.split('-')[1])

    }
    if (type === 'transaction') {
      temp.products = data?.listProducts
      temp.warehouseName = data?.warehouseName
      temp.status = data?.status
      temp.code = data?.code
      temp.totalQuantity = data?.totalQuantity
      temp.change = data?.totalPayment - data?.grandTotal
      temp.createdAt = data?.createdAt
    }
    return temp
  }, [data, type])

  return (
    <Box sx={{ height: "90%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {title[type]}
      </Typography>
      <Grid container spacing={2}>
        {/* ID */}
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle" fontWeight="bold">
            {
              type === 'openBill' ? 'Bill ID' : 'POS Code'
            }
          </Typography>
          <Typography variant="body1">{mappedData?.code}</Typography>
          <Typography variant="body2">{returnFormatDate(mappedData?.createdAt)} - {returnFormatTime(mappedData?.createdAt)} </Typography>
          {/* <Typography variant="body2"></Typography> */}
        </Grid>
        {/* Warehouse */}
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle" fontWeight="bold">
            Warehouse Name
          </Typography>
          <Typography variant="body1">{mappedData?.warehouseName}</Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant='subtitle1' fontWeight='bold'>
            Status
          </Typography>
          <Status status={mappedData.status} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant='subtitle1' fontWeight='bold'>
            Cashier
          </Typography>
          <Typography variant='body1'>Michael Santoso</Typography>
        </Grid>
        <Divider style={{ width: "100%", margin: "20px 0" }} />

        <Grid item xs={12}>
          <Typography variant='h6' gutterBottom>
            Customer Information
          </Typography>
          {!mappedData?.customer?.name ? (
            <Typography variant='body2' color='textSecondary'>
              No customer details available.
            </Typography>
          ) : (
            <Typography variant='body1'>{JSON.stringify(mappedData?.customer?.name)}</Typography>
          )}
        </Grid>

        <Divider style={{ width: "100%", margin: "20px 0" }} />

        <Grid item xs={12} height={'auto'}>
          <Typography variant="h6" gutterBottom>
            Products
          </Typography>
          <TablePorductOpenBill data={mappedData?.products} />
        </Grid>
        <Divider style={{ width: "100%", margin: "2px 0" }} />

        <Grid item xs={12}>
          <Grid container >
            {/* Left Column */}
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='subtitle1' >
                  Total Items: {mappedData?.totalQuantity}
                </Typography>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle1'>Sub Total:</Typography>
                  <Typography variant='body1'>{priceFormatWIthCurrency(mappedData?.subTotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle1'>Discount:</Typography>
                  <Typography variant='body1'>{priceFormatWIthCurrency(mappedData?.totalDiscount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle1'>Total Price:</Typography>
                  <Typography variant='body1'>{priceFormatWIthCurrency(mappedData?.grandTotal)}</Typography>
                </Box>
                {
                  type === 'transaction' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='subtitle1'>Change:</Typography>
                      <Typography variant='body1'>{priceFormatWIthCurrency(mappedData?.change)}</Typography>
                    </Box>
                  )
                }
                {
                  type === 'transaction' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='subtitle1'>Total Payment:</Typography>
                      <Typography variant='body1'>{priceFormatWIthCurrency(mappedData?.totalPayment)}</Typography>
                    </Box>
                  )
                }
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}