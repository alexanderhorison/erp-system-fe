import { useMemo, useState } from 'react'

// ** MUI Imports
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

// ** Data
import { allRoleMenuItems, roleMenuGroups } from './roleMenuGroups'

const countChipSx = allChecked => ({
  height: 22,
  borderRadius: `${radii.full}px`,
  border: `1px solid ${allChecked ? statusTokens.success.border : colors.border3}`,
  backgroundColor: allChecked ? statusTokens.success.bg : colors.background,
  '& .MuiChip-label': {
    px: 1.5,
    fontSize: '0.6875rem',
    fontWeight: 600,
    lineHeight: '16px',
    color: allChecked ? statusTokens.success.fg : colors.mutedForeground
  }
})

const MASONRY_COLUMNS = 2

// Rough card height (header + section titles + rows) from the full item list — not from the
// expanded state, so cards don't jump between columns when one is collapsed.
const groupWeight = group =>
  2 +
  (group.items?.length || 0) +
  (group.sections || []).reduce((sum, section) => sum + 1 + section.items.length, 0)

// Walks the groups in order, always dropping the next one into the currently shortest column.
const splitIntoColumns = groups => {
  const columns = Array.from({ length: MASONRY_COLUMNS }, () => ({ items: [], weight: 0 }))

  groups.forEach((group, order) => {
    const target = columns.reduce((shortest, column) => (column.weight < shortest.weight ? column : shortest))
    target.items.push({ group, order })
    target.weight += groupWeight(group)
  })

  return columns.map(column => column.items)
}

const matchesQuery = (item, query) => item.name.toLowerCase().includes(query)

function GroupItem({ item, checked, onToggle, checkedActions, onToggleAction }) {
  return (
    <Box sx={{ pl: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          size='small'
          checked={checked}
          onChange={e => onToggle(item.menuId, e.target.checked)}
          sx={{ p: 1 }}
        />
        <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>{item.name}</Typography>
      </Box>

      {checked && item.actions?.length > 0 && (
        <Box sx={{ pl: 8, display: 'flex', flexDirection: 'column' }}>
          {item.actions.map(action => (
            <Box key={action.value} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                size='small'
                checked={checkedActions.includes(action.value)}
                onChange={() => onToggleAction(action.value)}
                sx={{ p: 1 }}
              />
              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>{action.label}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

function GroupCard({ group, expanded, onToggleExpand, checkedMenuIds, checkedActions, onToggle, onToggleAction, onToggleAll }) {
  const flatItems = useMemo(
    () => [...(group.items || []), ...(group.sections || []).flatMap(section => section.items)],
    [group]
  )
  const checkedCount = flatItems.filter(item => checkedMenuIds.includes(item.menuId)).length
  const total = flatItems.length
  const allChecked = total > 0 && checkedCount === total
  const someChecked = checkedCount > 0 && !allChecked

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpand}
      disableGutters
      elevation={0}
      sx={{
        borderRadius: `${radii['3xl']}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs,
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 0 }
      }}
    >
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' fontSize='1.125rem' />}
        sx={{
          px: 4,
          py: 1,
          flexDirection: 'row-reverse',
          gap: 2,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            my: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <Icon icon={group.icon} fontSize='1.25rem' style={{ color: colors.mutedForeground, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }} noWrap>
            {group.title}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              size='small'
              checked={allChecked}
              indeterminate={someChecked}
              onChange={e => onToggleAll(flatItems, e.target.checked)}
              sx={{ p: 1 }}
            />
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>All</Typography>
          </Box>
          <Chip size='small' label={`${checkedCount}/${total}`} sx={countChipSx(allChecked)} />
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 4, pb: 4, pt: 0 }}>
        {group.items?.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {group.items.map(item => (
              <GroupItem
                key={item.menuId}
                item={item}
                checked={checkedMenuIds.includes(item.menuId)}
                onToggle={onToggle}
                checkedActions={checkedActions}
                onToggleAction={action => onToggleAction(item, action)}
              />
            ))}
          </Box>
        )}

        {group.sections?.map((section, index) => (
          <Box key={section.title} sx={{ mt: index === 0 && !group.items?.length ? 0 : 3 }}>
            <Typography
              sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.mutedForeground, mb: 1 }}
            >
              {section.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {section.items.map(item => (
                <GroupItem
                  key={item.menuId}
                  item={item}
                  checked={checkedMenuIds.includes(item.menuId)}
                  onToggle={onToggle}
                  checkedActions={checkedActions}
                  onToggleAction={action => onToggleAction(item, action)}
                />
              ))}
            </Box>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  )
}

/**
 * RoleMenuAccess
 * -------------------------------------------------------------------------------------
 * "Menu Akses" card grid for the role add/edit page. Each `roleMenuGroups` entry
 * renders as a collapsible card with its own "All" checkbox and a `checked/total`
 * count chip, laid out as a masonry grid; a search box filters which groups/items are visible (matched items
 * stay, groups with no match collapse out of view) and Buka Semua/Tutup Semua
 * expand or collapse every card at once.
 */
export default function RoleMenuAccess({ checkedMenuIds, setCheckedMenuIds, checkedActions, setCheckedActions }) {
  const [search, setSearch] = useState('')
  const [expandedKeys, setExpandedKeys] = useState(() => roleMenuGroups.map(group => group.key))

  const totalSelected = checkedMenuIds?.length || 0
  const totalMenus = allRoleMenuItems.length

  const query = search.trim().toLowerCase()

  const visibleGroups = useMemo(() => {
    if (!query) return roleMenuGroups

    return roleMenuGroups.filter(group => {
      if (group.title.toLowerCase().includes(query)) return true
      const flatItems = [...(group.items || []), ...(group.sections || []).flatMap(section => section.items)]
      return flatItems.some(item => matchesQuery(item, query))
    })
  }, [query])

  const masonryColumns = useMemo(() => splitIntoColumns(visibleGroups), [visibleGroups])

  const handleToggleExpand = key => () => {
    setExpandedKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]))
  }

  const handleExpandAll = () => setExpandedKeys(roleMenuGroups.map(group => group.key))
  const handleCollapseAll = () => setExpandedKeys([])

  const handleToggle = (menuId, checked) => {
    if (checked) {
      setCheckedMenuIds(prev => (prev.includes(menuId) ? prev : [...prev, menuId]))
    } else {
      setCheckedMenuIds(prev => prev.filter(id => id !== menuId))
      const item = allRoleMenuItems.find(entry => entry.menuId === menuId)
      if (item?.actions?.length) {
        setCheckedActions(prev => prev.filter(action => !item.actions.some(a => a.value === action)))
      }
    }
  }

  const handleToggleAll = (flatItems, checked) => {
    const ids = flatItems.map(item => item.menuId)
    if (checked) {
      setCheckedMenuIds(prev => Array.from(new Set([...prev, ...ids])))
    } else {
      setCheckedMenuIds(prev => prev.filter(id => !ids.includes(id)))
      const actionValues = flatItems.flatMap(item => item.actions?.map(a => a.value) || [])
      if (actionValues.length) {
        setCheckedActions(prev => prev.filter(action => !actionValues.includes(action)))
      }
    }
  }

  const handleToggleAction = (item, actionValue) => {
    setCheckedActions(prev =>
      prev.includes(actionValue) ? prev.filter(a => a !== actionValue) : [...prev, actionValue]
    )
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>Menu Akses</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
            {totalSelected} dari {totalMenus} akses menu dipilih
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <CustomTextField
            size='small'
            value={search}
            placeholder='Search Menu'
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon='tabler:search' fontSize='1.125rem' />
                </InputAdornment>
              )
            }}
            sx={{ width: { xs: '100%', sm: 220 } }}
          />
          <Button
            size='small'
            variant='outlined'
            color='secondary'
            onClick={handleExpandAll}
            sx={{ color: colors.foreground, borderColor: colors.border3, whiteSpace: 'nowrap' }}
          >
            Buka Semua
          </Button>
          <Button
            size='small'
            variant='outlined'
            color='secondary'
            onClick={handleCollapseAll}
            sx={{ color: colors.foreground, borderColor: colors.border3, whiteSpace: 'nowrap' }}
          >
            Tutup Semua
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: colors.border }} />

      {/* Masonry: two flex columns, so a short card on the left lets the next card slide up
          into the gap instead of leaving a blank row beside a tall one. Below `md` the column
          wrappers use `display: contents` and `order` restores the original sequence. */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', gap: 4 }}>
        {masonryColumns.map((column, columnIndex) => (
          <Box
            key={columnIndex}
            sx={{ display: { xs: 'contents', md: 'flex' }, flexDirection: 'column', flex: 1, minWidth: 0, gap: 4 }}
          >
            {column.map(({ group, order }) => (
              <Box key={group.key} sx={{ order: { xs: order, md: 0 }, width: '100%' }}>
                <GroupCard
                  group={group}
                  expanded={expandedKeys.includes(group.key)}
                  onToggleExpand={handleToggleExpand(group.key)}
                  checkedMenuIds={checkedMenuIds || []}
                  checkedActions={checkedActions || []}
                  onToggle={handleToggle}
                  onToggleAction={handleToggleAction}
                  onToggleAll={handleToggleAll}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
