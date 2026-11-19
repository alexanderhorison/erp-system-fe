// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Shared Components
import TablePagination from 'src/views/common/TablePagination'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * CardList
 * -------------------------------------------------------------------------------------
 * The card-layout counterpart of `DataTable`: the same Card chrome, the same toolbar
 * slot and the same numbered footer, with a responsive grid of cards in the middle.
 *
 * Grid: 1 column on phones, 2 on tablets, 3 from `lg`. Pass `pageSize` 9 so a page
 * always fills whole rows of three. Paging is server-side, like the table: the
 * caller fetches on `onPageChange` and passes `rowCount` from the API.
 */
export default function CardList({
  toolbar = null,
  items = [],
  renderItem,
  getItemKey,
  loading = false,
  paginationModel,
  onPaginationModelChange,
  rowCount,
  itemLabel = 'items',
  emptyText = 'Tidak ada data'
}) {
  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        minWidth: 0,
        borderRadius: `${radii['3xl']}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs,
        overflow: 'hidden'
      }}
    >
      {toolbar}

      <Box sx={{ px: 4, pb: 4, pt: toolbar ? 0 : 4, position: 'relative', minHeight: 160 }}>
        {loading && items.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box
            sx={{
              py: 8,
              gap: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: colors.mutedForeground
            }}
          >
            <Icon icon='tabler:inbox' fontSize='2rem' />
            <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>{emptyText}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              gap: 4,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                md: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))'
              },
              // Keep the previous page visible (dimmed) while the next one loads.
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 150ms',
              pointerEvents: loading ? 'none' : 'auto'
            }}
          >
            {items.map((item, index) => (
              <Box key={getItemKey ? getItemKey(item) : index} sx={{ display: 'flex', minWidth: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
                  {renderItem(item)}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {paginationModel && (
        <TablePagination
          page={paginationModel.page}
          pageSize={paginationModel.pageSize}
          rowCount={rowCount ?? items.length}
          itemLabel={itemLabel}
          onPageChange={nextPage => onPaginationModelChange?.({ ...paginationModel, page: nextPage })}
        />
      )}
    </Card>
  )
}
