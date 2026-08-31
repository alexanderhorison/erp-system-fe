import { Badge, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useMemo } from 'react'
import Icon from 'src/@core/components/icon'

const MenuBox = ({ icon, title, action, selected, disable, notification = false }) => {
  return (
    <Grid item xs={6} sm={4} md={2}>
      <Box
        border={0}
        bgcolor={disable ? '#f0f0f0' : selected ? `${process.env.NEXT_PUBLIC_ENVIRONTMENT == 'development' ? "#E3F2FD" : "#d6bdab"}` : 'white'}
        boxShadow={1}
        borderRadius={1}
        height={{ xs: '4rem', md: '6rem' }}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        onClick={!disable ? action : undefined} // Hanya panggil action jika tidak disable
        style={{
          opacity: disable ? 0.5 : 1,
          pointerEvents: disable ? 'none' : 'auto',
          cursor: !disable ? 'pointer' : 'default'
        }}
        sx={{
          '&:hover': !disable && {
            boxShadow: 2,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        <Badge
          color='error'
          variant='dot'
          invisible={!notification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          overlap='circular'
        >
          <Icon icon={icon} width={24} height={24} />
        </Badge>
        <Typography variant='body2' fontSize={{ xs: '0.65rem', md: '0.75rem' }} mt={1} textAlign="center">
          {title}
        </Typography>
      </Box>
    </Grid>
  )
}

export default function MenuPosV2({ showFilter, setShowFilter, selectedMenu, setSelectedMenu }) {
  const printer = JSON.parse(localStorage.getItem('printerPos'))

  const notificationBadge = useMemo(() => {
    if (printer) {
      return false
    }
    return true
  }, [printer])

  return (
    <Grid container height={{ xs: 'auto', md: '4rem' }} spacing={{ xs: 1, md: 2 }}>
      <MenuBox
        icon={showFilter ? 'tabler:filter-off' : 'tabler:filter'}
        title={showFilter ? 'Hide Filter' : 'Show Filter'}
        action={() => {
          setShowFilter(!showFilter)
        }}
        disable={selectedMenu.code !== 'POS'}
      />
      <MenuBox
        icon='tabler:http-post'
        title='POS'
        action={() => {
          setSelectedMenu({
            name: 'POS',
            code: 'POS'
          })
        }}
        selected={selectedMenu.code === 'POS'}
      />
      <MenuBox
        icon='tabler:credit-card'
        title='Transaction'
        action={() => {
          setSelectedMenu({
            name: 'Transaction',
            code: 'TRANSACTION'
          })
        }}
        selected={selectedMenu.code === 'TRANSACTION'}
      />
      <MenuBox icon='tabler:building-warehouse' title='Product Request'
        action={() => {
          setSelectedMenu({
            name: 'Product Request',
            code: 'REQUEST_BARANG'
          })
        }}
        selected={selectedMenu.code === 'REQUEST_BARANG'} />
      <MenuBox
        icon='tabler:file-invoice'
        title='Open Bill'
        action={() => {
          setSelectedMenu({
            name: 'Open Bill',
            code: 'OPEN_BILL'
          })
        }}
        selected={selectedMenu.code === 'OPEN_BILL'}
      />
      <MenuBox
        icon='tabler:settings'
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
    </Grid>
  )
}
