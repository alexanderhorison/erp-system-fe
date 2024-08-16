import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from "@mui/lab";
import { Card, CardContent, CardHeader, Icon, Typography } from "@mui/material";
import { Box } from "@mui/system";


const TimelineItemHistory = (props) => {

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
            <Typography variant='h6' sx={{ mr: 2 }}>
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
              {props?.infoType || "-"} Sebanyak {props?.quantity} {props?.titleInfo ? "dari" : ""} {props?.titleInfo}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              Stock Akhir : {props?.lastQuantity}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              {props?.formula}
              {props?.goodsIn}
              {props?.goodsOut}
              {props?.deliveryOrder}
            </Typography>
          </Box>
        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}

export default function TableHistoryProduct({ history, product }) {
  console.log(history, product);

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            <Icon fontSize='1.25rem' icon='tabler:list-details' />
            <Typography>History Produk: {product?.productName || "-"} - {product?.unitName || "-"}</Typography>
          </Box>
        }
      // action={
      //   <OptionsMenu
      //     options={['Share timeline', 'Suggest edits', 'Report bug']}
      //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
      //   />
      // }
      />
      <CardContent>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 2,
            },
          }}
        >
          {
            history?.map((item, index) => (
              <TimelineItemHistory
                index={index}
                key={index}
                length={history.length}
                {...item}
              />
            ))
          }
        </Timeline>
      </CardContent>
    </Card>
  )
}