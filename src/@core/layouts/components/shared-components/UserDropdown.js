// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { UseAuth } from 'src/hooks/useAuth'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()
  const { logout, user } = UseAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  function stringToColor(string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name) {
    let splitName = name.split(' ')
    if (splitName.length > 1) {
      splitName = `${splitName[0][0]}${splitName[1][0]}`
    } else {
      splitName = name[0]
    }

    return {
      sx: {
        bgcolor: stringToColor(name)
      },
      children: splitName.toUpperCase()
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt={user?.name}
          {...stringAvatar(user?.name)}
          onClick={handleDropdownOpen}
          sx={{ width: 38, height: 38 }}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar alt={user?.name} {...stringAvatar(user?.name)} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>{user?.name.toUpperCase()}</Typography>
              <Typography variant='body2'>{user?.email}</Typography>
              <Typography variant='body2'>{user?.Master_Role?.name}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />

        {process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
          <>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/user-profile/profile')}>
              <Box sx={styles}>
                <Icon icon='tabler:user-check' />
                My Profile
              </Box>
            </MenuItemStyled>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings/account')}>
              <Box sx={styles}>
                <Icon icon='tabler:settings' />
                Settings
              </Box>
            </MenuItemStyled>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings/billing')}>
              <Box sx={styles}>
                <Icon icon='tabler:credit-card' />
                Billing
              </Box>
            </MenuItemStyled>
            <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/help-center')}>
              <Box sx={styles}>
                <Icon icon='tabler:lifebuoy' />
                Help
              </Box>
            </MenuItemStyled>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/faq')}>
              <Box sx={styles}>
                <Icon icon='tabler:info-circle' />
                FAQ
              </Box>
            </MenuItemStyled>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')}>
              <Box sx={styles}>
                <Icon icon='tabler:currency-dollar' />
                Pricing
              </Box>
            </MenuItemStyled>
            <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
          </>
        )}
        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            Sign Out
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
