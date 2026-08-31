// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Util Imports
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { handleURLQueries } from 'src/@core/layouts/utils'

// ** Redux
import { useSelector } from 'react-redux'

// ** Design Tokens
import { layout, radii, sidebar } from 'src/configs/designTokens'

// ** Styled Components
// ** Nav items render as a subtle stone pill when active (Figma: Sidebar Menu item),
// rather than the template's filled gradient.
const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  minHeight: layout.navItemHeight,
  borderRadius: radii['3xl'],
  color: sidebar.foreground,
  transition: 'padding-left .25s ease-in-out, padding-right .25s ease-in-out',
  '&:hover': {
    backgroundColor: sidebar.activeBg
  },
  '&.active': {
    '&, &:hover': {
      backgroundColor: sidebar.activeBg,
      borderLeft: `2px solid ${sidebar.activeAccent}`
    },
    '& .MuiTypography-root': {
      color: `${sidebar.activeFg} !important`,
      fontWeight: 500
    },
    '& svg': {
      color: `${sidebar.activeFg} !important`
    }
  }
}))

const MenuItemTextMetaWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}))

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth
}) => {
  // ** Hooks
  const router = useRouter()
  const pendingCounts = useSelector(state => state.notification?.pendingCounts ?? {})

  // ** Vars
  const { navCollapsed } = settings
  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 1, px: '0 !important' }}
      >
        <MenuNavLink
          component={Link}
          {...(item.disabled && { tabIndex: -1 })}
          className={isNavLinkActive() ? 'active' : ''}
          href={item.path === undefined ? '/' : `${item.path}`}
          {...(item.openInNewTab ? { target: '_blank' } : null)}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
            if (navVisible) {
              toggleNavVisibility()
            }
          }}
          sx={{
            py: 2,
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            px: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 22 - 28) / 8 : 4,
            '& .MuiTypography-root, & svg': {
              color: sidebar.foreground
            }
          }}
        >
          <ListItemIcon
            sx={{
              transition: 'margin .25s ease-in-out',
              ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2 }),
              ...(parent ? { ml: 1.5, mr: 3.5 } : {}),
              '& svg': {
                fontSize: '0.625rem',
                ...(!parent ? { fontSize: '1.375rem' } : {}),
                ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
              }
            }}
          >
            {!parent && pendingCounts[item.menuId] > 0 ? (
              <Badge
                badgeContent={pendingCounts[item.menuId]}
                color='warning'
                overlap='circular'
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    minWidth: 16,
                    height: 16,
                    padding: '0 3px',
                    fontWeight: 700,
                    transform: 'translate(8px, -8px)' // agak jauhan
                  }
                }}
              >
                <UserIcon icon={icon} />
              </Badge>
            ) : (
              <UserIcon icon={icon} />
            )}
          </ListItemIcon>

          <MenuItemTextMetaWrapper
            sx={{
              ...(isSubToSub ? { ml: 2 } : {}),
              ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography
                {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                  noWrap: true
                })}
              >
                <Translations text={item.title} />
              </Typography>
              {parent && pendingCounts[item.menuId] > 0 && (
                <Badge
                  badgeContent={pendingCounts[item.menuId]}
                  color='warning'
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      minWidth: 16,
                      height: 16,
                      padding: '0 3px',
                      fontWeight: 700
                    }
                  }}
                />
              )}
            </Box>
            {item.badgeContent ? (
              <Chip
                size='small'
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{ height: 22, minWidth: 22, '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' } }}
              />
            ) : null}
          </MenuItemTextMetaWrapper>
        </MenuNavLink>
      </ListItem>
    </CanViewNavLink>
  )
}

export default VerticalNavLink
