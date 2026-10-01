import { useMemo } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, shadows, stone } from 'src/configs/designTokens'

const menus = [
  { icon: 'tabler:basket', title: 'POS', code: 'POS' },
  { icon: 'tabler:list-details', title: 'Transaction', code: 'TRANSACTION' },
  { icon: 'tabler:clipboard-list', title: 'Product Request', code: 'REQUEST_BARANG' },
  { icon: 'tabler:file-text', title: 'Open Bill', code: 'OPEN_BILL' },
  { icon: 'tabler:settings', title: 'Setting', code: 'SETTING' }
]

// ** POS navigation: a pill-shaped segmented control, the active page raised on white.
export default function MenuPosV2({ selectedMenu, setSelectedMenu }) {
  const printer = JSON.parse(localStorage.getItem('printerPos'))

  const notificationBadge = useMemo(() => {
    if (printer) {
      return false
    }
    return true
  }, [printer])

  return (
    <Box
      component='nav'
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        maxWidth: '100%',
        overflowX: 'auto',
        borderRadius: 9999,
        border: `1px solid ${colors.border}`,
        backgroundColor: stone[100]
      }}
    >
      {menus.map(menu => {
        const selected = selectedMenu.code === menu.code

        return (
          <ButtonBase
            key={menu.code}
            onClick={() => setSelectedMenu({ name: menu.title, code: menu.code })}
            sx={{
              flexShrink: 0,
              gap: 1.5,
              px: 3,
              height: 32,
              borderRadius: 9999,
              color: colors.foreground,
              border: '1px solid transparent',
              ...(selected && {
                backgroundColor: colors.background,
                borderColor: colors.border,
                boxShadow: shadows.xs
              }),
              '&:hover': { backgroundColor: selected ? colors.background : stone[200] }
            }}
          >
            <Badge
              color='error'
              variant='dot'
              invisible={!(menu.code === 'SETTING' && notificationBadge)}
              overlap='circular'
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Icon icon={menu.icon} fontSize='1rem' />
            </Badge>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'inherit', whiteSpace: 'nowrap' }}>
              {menu.title}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}
