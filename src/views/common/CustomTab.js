import { TabContext } from "@mui/lab";
import { Grid, Tab } from "@mui/material";
import { Box } from "@mui/system";
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'


const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
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
      <Grid container spacing={6}>
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
