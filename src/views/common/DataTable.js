// ** React Imports
import { useCallback, useEffect, useMemo, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Shared Components
import TablePagination from 'src/views/common/TablePagination'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const SortAscIcon = props => <Icon icon='tabler:arrow-up' fontSize='0.875rem' {...props} />
const SortDescIcon = props => <Icon icon='tabler:arrow-down' fontSize='0.875rem' {...props} />
const SortUnsortedIcon = props => <Icon icon='tabler:arrows-sort' fontSize='0.875rem' {...props} />

/**
 * DataTable
 * -------------------------------------------------------------------------------------
 * Card-wrapped DataGrid carrying the shared table styling (Figma: table Card).
 *
 * A thin presentational wrapper: every DataGrid prop is forwarded untouched, so
 * columns, rows and slot wiring stay owned by the calling module. `toolbar` is
 * rendered above the grid rather than through `slots.toolbar`, which keeps
 * toolbar state out of the grid's prop plumbing.
 *
 * The grid's own footer is replaced by `TablePagination` to match the design;
 * pass `itemLabel` to name the rows in the summary line ("... of 100 products").
 *
 * Sortable columns always show their state: up/down arrows when unsorted, a
 * single up arrow ascending, a single down arrow descending.
 *
 * NOTE: DataGrid measures its container through scroll-based resize triggers and
 * debounces the result by 60ms, while the sidebar animates its width over 250ms.
 * The debounced measurement therefore lands mid-animation and is never revised,
 * so the columns keep a stale width and the grid renders a filler cell for the
 * leftover space. `apiRef.current.resize()` is called once the animation has
 * settled to force a fresh measurement (a synthetic window resize event does not
 * reach the grid's own triggers).
 */
export default function DataTable({ toolbar = null, itemLabel = 'items', sx, slots, columns, ...dataGridProps }) {
  const { paginationModel, onPaginationModelChange, rows = [] } = dataGridProps
  const { settings } = useSettings()
  const { navCollapsed } = settings
  const apiRef = useGridApiRef()
  const cardRef = useRef(null)

  // ** Force the grid to re-measure and rebuild its column widths.
  //
  // `resize()` alone is not always enough: `handleGridSizeChange` only rehydrates
  // the columns when the reported viewport width differs from the previous one,
  // so a measurement taken mid-animation can be cached and then suppress the
  // corrective pass. Re-upserting the columns runs `hydrateColumnsWidth` against
  // the current viewport regardless of that guard.
  const remeasure = useCallback(() => {
    const api = apiRef.current
    if (!api?.resize) return
    api.resize()
    if (api.getAllColumns && api.updateColumns) {
      api.updateColumns(api.getAllColumns())
    }
  }, [apiRef])

  // ** Re-measure whenever the card's own width changes. DataGrid's internal
  // scroll-trigger detection misses the sidebar animation, so the grid keeps a
  // stale viewport width and its flex columns are never redistributed.
  useEffect(() => {
    const node = cardRef.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined

    let timer = null
    const observer = new ResizeObserver(() => {
      // Coalesce the bursts emitted during the sidebar's width animation.
      if (timer) clearTimeout(timer)
      timer = setTimeout(remeasure, 50)
    })
    observer.observe(node)

    return () => {
      if (timer) clearTimeout(timer)
      observer.disconnect()
    }
  }, [apiRef, remeasure])

  // ** Belt-and-braces for the collapse toggle: fires once the 250ms width
  // animation has settled, in case the observer coalesced too early.
  useEffect(() => {
    const timeout = setTimeout(remeasure, 300)

    return () => clearTimeout(timeout)
  }, [navCollapsed, remeasure])

  // ** Rescale flex columns so the declared values total 1 and the grid fills
  // its container. DataGrid shares out free space in proportion to that total,
  // so a set summing to less than 1 (e.g. 0.92) leaves a permanent gap on the
  // right. Fixed-width columns are left untouched.
  const normalisedColumns = useMemo(() => {
    if (!columns?.length) return columns
    const flexTotal = columns.reduce((sum, column) => sum + (column.flex || 0), 0)
    if (!flexTotal || Math.abs(flexTotal - 1) < 0.001) return columns

    return columns.map(column => (column.flex ? { ...column, flex: column.flex / flexTotal } : column))
  }, [columns])

  return (
    <Card
      ref={cardRef}
      sx={{
        width: '100%',
        minWidth: 0,
        borderRadius: `${radii.lg}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs,
        overflow: 'hidden'
      }}
      elevation={0}
    >
      {toolbar}

      <DataGrid
        apiRef={apiRef}
        autoHeight
        disableRowSelectionOnClick
        columnHeaderHeight={36}
        rowHeight={36}
        sx={{
          border: 0,
          width: '100%',
          '& .MuiDataGrid-main': {
            width: '100%'
          },
          '& .MuiDataGrid-virtualScroller': {
            overflowX: 'auto'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: stone[100],
            borderBottom: `1px solid ${colors.border}`
          },
          '& .MuiDataGrid-iconButtonContainer': {
            visibility: 'visible',
            width: 'auto'
          },
          '& .MuiDataGrid-sortIcon': {
            opacity: '1 !important',
            color: colors.mutedForeground
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: 0,
            textTransform: 'none',
            color: colors.foreground
          },
          '& .MuiDataGrid-cell': {
            fontSize: '0.875rem',
            borderColor: colors.border,
            color: colors.foreground
          },
          // ** When the columns do not fill the viewport DataGrid appends a
          // filler `.MuiDataGrid-cell` with no content. It inherits the border
          // colour above but not a bottom border, so row separators would stop
          // at the last real column.
          '& .MuiDataGrid-row .MuiDataGrid-cell:empty': {
            borderBottom: `1px solid ${colors.border}`
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: stone[50]
          },
          '& .MuiDataGrid-footerContainer': {
            display: 'none'
          },
          ...sx
        }}
        hideFooter
        columns={normalisedColumns}
        {...dataGridProps}
        slots={{
          columnSortedAscendingIcon: SortAscIcon,
          columnSortedDescendingIcon: SortDescIcon,
          columnUnsortedIcon: SortUnsortedIcon,
          ...slots
        }}
      />

      {paginationModel && (
        <TablePagination
          page={paginationModel.page}
          pageSize={paginationModel.pageSize}
          rowCount={rows.length}
          itemLabel={itemLabel}
          onPageChange={nextPage => onPaginationModelChange?.({ ...paginationModel, page: nextPage })}
        />
      )}
    </Card>
  )
}
