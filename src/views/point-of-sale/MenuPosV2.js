import { Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import Icon from 'src/@core/components/icon';

const MenuBox = ({ icon, title, action, selected, disable }) => {
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
        <Icon icon={icon} />
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
        disable
        icon="tabler:x"
        title={'Disable'}
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