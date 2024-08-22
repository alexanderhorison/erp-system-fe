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


export default function TimelineItemHistory(props) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={
          props?.adjustmentType === "MINUS" ? "error" :
            props?.adjustmentType === "PLUS" ? "success" :
              "info"
        } />
        {
          props?.index !== props?.length - 1 && (
            <TimelineConnector />
          )
        }
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
          <Box
            sx={{
              mb: 0.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant='h6' fontWeight={700} sx={{ mr: 2 }}>
              {props?.title || "-"}
            </Typography>
            <Typography variant="body2" mb={2} fontSize={12}>
              Dibuat Oleh: {props?.createdBy}
            </Typography>
          </Box>
          <Box
            sx={{
              mb: 0.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
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
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              {props?.infoType || "-"} Sebanyak {props?.quantity} {`${props?.product?.unitName.toLowerCase()}`} {props?.titleInfo ? "dari" : ""} {props?.titleInfo}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              Stock Akhir : {props?.lastQuantity} {props?.product?.unitName.toLowerCase()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              {props?.formula}
              {props?.goodsIn}
              {props?.deliveryOrder}
            </Typography>
            <Typography
              variant='body2'
              sx={{ fontWeight: 500, color: 'text.primary', ":hover": { cursor: "pointer", color: "blue" } }}
              // onClick={() => props.router.push(`/adjustment/goods-out/${props?.goodsOutCode}`)}
              onClick={() => {
                const url = `/adjustment/goods-out/${props?.goodsOutCode}`;
                window.open(url, '_blank');
              }}
            >
              {props?.goodsOut}
            </Typography>
          </Box>
          {
            props?.notes && (
              <Grid xs={12} md={5} mt={2}>
                <CustomSimpleAccordion
                  title="Catatan"
                  content={props?.notes}
                />
              </Grid>
            )
          }
        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}