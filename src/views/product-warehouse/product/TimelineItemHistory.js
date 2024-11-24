import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { CustomSimpleAccordion } from "src/@core/components/common";
import BoxCode from "./BoxCode";


export default function TimelineItemHistory(props) {

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={props?.adjustmentType === 'MINUS' || props?.deleted ? 'error' : props?.adjustmentType === 'PLUS' ? 'success' : 'info'}
        />
        {props?.index !== props?.length - 1 && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(4)} !important` }}>
        <Box
          sx={{
            mb: 0.5,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box display={'flex'} gap={3}>
            <Box
              sx={{
                mb: 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography variant='h6' fontWeight={700} sx={{ mr: 2 }}>
                {props?.title || '-'}
              </Typography>
              <Typography variant='body2' mb={2} fontSize={12}>
                Dibuat Oleh: {props?.createdBy}
              </Typography>
            </Box>
            {
              !props?.deleted && (
                <AdjustmentBox adjustmentType={props?.adjustmentType} quantity={props?.quantity} />
              )
            }
          </Box>
          <Box
            sx={{
              mb: 0.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}
          >
            <Typography variant='caption' sx={{ color: 'text.disabled', textAlign: 'right' }}>
              {props?.date}
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.disabled', textAlign: 'right' }}>
              {props?.time}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex-column', flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'warning.main' } }}>
            {
              props?.deleted && (
                <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {props?.infoType || '-'}
                </Typography>
              )
            }
            {
              !props?.deleted && (
                <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {props?.infoType || '-'} {`${props?.product?.unitName.toLowerCase()}`}{' '}
                  {props?.titleInfo ? 'dari' : ''} {props?.titleInfo}
                </Typography>
              )
            }
          </Box>
          {props?.description && (
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                Deskripsi : {props?.description}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              Stock Akhir : {props?.lastQuantity} {props?.product?.unitName.toLowerCase()}
            </Typography>
          </Box>
          <BoxCode
            value={props?.outstanding}
            isClickable
            url={`/receipt-order-outstanding/${props?.outstandingCode}`}
          />
          <BoxCode value={props?.formula} />
          <BoxCode value={props?.goodsIn} />
          <BoxCode value={props?.deliveryOrder} isClickable url={`/delivery-order/${props?.deliveryOrderCode}`} />
          <BoxCode value={props?.stockOpname} isClickable url={`/stock-opname/${props?.stockOpnameCode}`} />
          <BoxCode
            value={props?.deliveryOrderReceipt}
            isClickable
            url={`/receive-order/${props?.deliveryOrderReceiptCode}`}
          />
          <BoxCode value={props?.goodsOut} isClickable url={`/adjustment/goods-out/${props?.goodsOutCode}`} />
          <BoxCode value={props?.salesOrder} isClickable url={`/sales-order/${props?.salesOrderCode}`} />
          <BoxCode value={props?.purchaseOrder} isClickable url={`/purchase-order/${props?.purchaseOrderCode}`} />
          {props?.notes && (
            <Grid xs={12} md={5} mt={2}>
              <CustomSimpleAccordion title='Catatan' content={props?.notes} />
            </Grid>
          )}

        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}

const AdjustmentBox = ({ adjustmentType, quantity }) => {
  const adjustmentSign = adjustmentType === 'MINUS' ? '-' : adjustmentType === 'PLUS' ? '+' : '';
  const adjustmentColor = adjustmentType === 'MINUS' ? '#EA5455' : adjustmentType === 'PLUS' ? '#28C76F' : '#00CFE8';

  return (
    <Box
      border={1}
      // bgcolor={adjustmentColor}
      alignContent='center'
      px={1}
      minWidth={40}
      height={35}
      borderRadius={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: adjustmentColor,
        fontWeight: 500,
      }}
    >
      <Typography variant='h6' color={adjustmentColor}>{`${adjustmentSign} ${quantity}`}</Typography>
    </Box>
  );
};