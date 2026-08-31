import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardActionArea from '@mui/material/CardActionArea'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import HandleSearh from 'src/helpers/handleSearch'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * WarehouseCard
 * -------------------------------------------------------------------------------------
 * One warehouse as a clickable card: an icon chip beside the name and its
 * location. Replaces the row this list used to render in a DataTable — the set
 * is small and every row only ever led to the same detail page, so a card grid
 * reads better than a three-column table with a single action.
 */
const WarehouseCard = ({ warehouse, onClick }) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: `${radii.lg}px`,
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.xs,
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        borderColor: colors.border3,
        boxShadow: shadows.sm
      }
    }}
  >
    <CardActionArea
      onClick={onClick}
      sx={{
        height: '100%',
        p: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 3,
        borderRadius: `${radii.lg}px`
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: `${radii.full}px`,
          backgroundColor: stone[100],
          color: stone[500]
        }}
      >
        <Icon icon='tabler:building-warehouse' fontSize='1.25rem' />
      </Box>

      {/* minWidth:0 lets a long name ellipsize instead of stretching the card */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: '24px',
            color: colors.foreground,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {warehouse.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            lineHeight: '20px',
            color: colors.mutedForeground,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {warehouse.location || '-'}
        </Typography>
      </Box>
    </CardActionArea>
  </Card>
)

export default function WarehouseCardList({}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const { data } = useSelector(state => state.warehouse)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'location'], searchValue, setData: setFilteredData })
  }

  const handleOpen = warehouseId => {
    router.push(`/product-warehouse/warehouse/${warehouseId}`)
  }

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
    // eslint-disable-next-line
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
    // eslint-disable-next-line
  }, [data])

  const warehouses = filteredData || []

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <CustomTextField
          value={searchText}
          placeholder='Search warehouse or location'
          onChange={event => handleSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon fontSize='1.125rem' icon='tabler:search' />
              </InputAdornment>
            ),
            endAdornment: searchText ? (
              <InputAdornment position='end'>
                <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => handleSearch('')}>
                  <Icon fontSize='1.125rem' icon='tabler:x' />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          sx={{ width: { xs: '100%', sm: 360 } }}
        />
      </Box>

      {warehouses.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: `${radii.lg}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.xs
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
            {searchText ? 'No warehouses match your search.' : 'No warehouses found.'}
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {warehouses.map(warehouse => (
            <Grid item xs={12} sm={6} lg={4} key={warehouse.id}>
              <WarehouseCard warehouse={warehouse} onClick={() => handleOpen(warehouse.id)} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
