import { Badge, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useMemo } from "react";
import Icon from 'src/@core/components/icon';

const MenuBox = ({ icon, title, action, selected, disable, notification = false }) => {
  return (
    <Grid item xs={2}>
      <Box
        border={0}
        bgcolor={disable ? '#f0f0f0' : selected ? '#d6bdab' : 'white'}
        boxShadow={1}
        borderRadius={1}
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        onClick={!disable ? action : undefined} // Hanya panggil action jika tidak disable
        style={{
          opacity: disable ? 0.5 : 1,
          pointerEvents: disable ? 'none' : 'auto',
        }}
      >
        <Badge
          color="error"
          variant="dot"
          invisible={!notification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          overlap="circular"
        >
          <Icon icon={icon} width={24} height={24} />
        </Badge>
        <Typography variant="body2" fontSize={'0.75rem'} mt={1}>
          {title}
        </Typography>
      </Box>
    </Grid>
  );
};

export default function MenuPosV2({
  showFilter,
  setShowFilter,
  selectedMenu,
  setSelectedMenu,
}) {
  const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
  const printer = JSON.parse(localStorage.getItem("printerPos"))

  const notificationBadge = useMemo(() => {
    if (warehouse && printer) {
      return false
    }
    return true
  }, [warehouse, printer])

  return (
    <Grid container height={'100%'} columnSpacing={2} >
      <MenuBox
        icon={showFilter ? 'tabler:filter-off' : 'tabler:filter'}
        title={showFilter ? 'Hide Filter' : 'Show Filter'}
        action={() => {
          setShowFilter(!showFilter)
        }}
        disable={selectedMenu.code !== 'POS'}
      />
      <MenuBox
        icon="tabler:http-post"
        title="POS"
        action={() => {
          setSelectedMenu({
            name: 'POS',
            code: 'POS'
          })
        }}
        selected={selectedMenu.code === 'POS'}
      />
      <MenuBox
        icon="tabler:credit-card-pay"
        title="Transaction"
        action={() => {
          setSelectedMenu({
            name: 'Transaction',
            code: 'TRANSACTION'
          })
        }}
        selected={selectedMenu.code === 'TRANSACTION'}
      />
      <MenuBox
        icon="tabler:file-invoice"
        title="Open Bill"
        action={() => {
          setSelectedMenu({
            name: 'Open Bill',
            code: 'OPEN_BILL'
          })
        }}
        selected={selectedMenu.code === 'OPEN_BILL'}
      />
      <MenuBox
        icon="tabler:settings"
        title={'Setting'}
        action={() => {
          setSelectedMenu({
            name: 'Setting',
            code: 'SETTING'
          })
        }}
        selected={selectedMenu.code === 'SETTING'}
        notification={notificationBadge}
      />
      <MenuBox
        icon="tabler:credit-card-pay"
        title="Other"
        selected={selectedMenu.code === 'OTHER'}
        disable
      />
    </Grid>
  )
}