import { TabContext } from "@mui/lab";
import { Grid, Tab } from "@mui/material";
import { Box } from "@mui/system";
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'


// ** Pill tabs (Figma: segmented control). The selected tab is a filled pill and
// the rest are outlined, matching the button treatment used across the redesign.
const TabList = styled(MuiTabList)(({ theme }) => ({
  minHeight: 0,
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box'
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(2)
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    minWidth: 0,
    minHeight: 34,
    padding: theme.spacing(1.5, 3.5),
    lineHeight: 1,
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: radii.full,
    border: `1px solid ${colors.border}`,
    color: colors.foregroundAlt,
    backgroundColor: colors.background,
    transition: theme.transitions.create(['background-color', 'border-color', 'color']),
    '&:hover': {
      borderColor: colors.border3,
      backgroundColor: stone[50]
    }
  },
  '& .Mui-selected': {
    boxShadow: shadows.xs,
    borderColor: `${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  }
}))

export default function CustomTab({
  hideText = false,
  activeTab,
  setActiveTab,
  tabContentList,
}) {
  const handleChange = (event, value) => {
    setActiveTab(value)
  }
  return (
    <TabContext value={activeTab}>
      <Grid container>
        <Grid item xs={12}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='customized tabs example'
          >
            {
              tabContentList &&
              tabContentList?.map((item, index) => (
                <Tab
                  value={item?.value}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon fontSize='1.125rem' icon={item?.icon} />
                      {!hideText && item?.label}
                    </Box>
                  }
                  key={index}
                />
              ))
            }
          </TabList>
        </Grid>
      </Grid>
    </TabContext>
  )
}
