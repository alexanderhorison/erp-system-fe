// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * FilterPanel
 * -------------------------------------------------------------------------------------
 * Collects every filter for a table into a popover anchored beneath the
 * "Filters" button, replacing the always-visible filter rows used by the
 * `Filter*` components.
 *
 * Fields are declared as data so each module can pass the filters it needs:
 *
 *   fields = [
 *     { name: 'categoryId', label: 'Category', type: 'select', options: [{ value, label }] },
 *     { name: 'startDate', label: 'Start Date', type: 'date' },
 *     { name: 'search', label: 'Keyword', type: 'text' }
 *   ]
 *
 * Edits are staged locally and only handed to `onApply` when the user confirms,
 * so the table is not re-queried on every keystroke.
 */
export default function FilterPanel({
  open,
  anchorEl,
  onClose,
  fields = [],
  value = {},
  onApply,
  onReset,
  title = 'Filters',
  applyLabel = 'Apply Filters',
  resetLabel = 'Reset'
}) {
  const [draft, setDraft] = useState(value)

  // ** Re-sync the staged values whenever the panel is reopened, so a dismissed
  // edit does not leak into the next session.
  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const handleChange = event => {
    const { name, value: nextValue } = event.target
    setDraft(prev => ({ ...prev, [name]: nextValue }))
  }

  const handleApply = () => {
    onApply?.(draft)
    onClose?.()
  }

  const handleReset = () => {
    const cleared = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    setDraft(cleared)
    onReset?.(cleared)
    onClose?.()
  }

  const renderField = field => {
    const fieldValue = draft?.[field.name] ?? ''

    if (field.type === 'select') {
      return (
        <CustomTextField
          select
          fullWidth
          name={field.name}
          label={field.label}
          SelectProps={{
            value: fieldValue,
            displayEmpty: true,
            onChange: handleChange,
            name: field.name
          }}
        >
          <MenuItem value=''>{field.placeholder || `All ${field.label}`}</MenuItem>
          {field.options?.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </CustomTextField>
      )
    }

    return (
      <CustomTextField
        fullWidth
        name={field.name}
        label={field.label}
        type={field.type || 'text'}
        value={fieldValue}
        placeholder={field.placeholder || ''}
        onChange={handleChange}
        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
      />
    )
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            mt: 2,
            // ** Two columns of fields rather than one tall stack. Capped so a
            // module with many filters scrolls instead of covering the page.
            width: { xs: 'calc(100vw - 32px)', sm: 520 },
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: `${radii.lg}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.lg,
            backgroundColor: colors.background
          }
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{ px: 4, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexShrink: 0 }}
      >
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size='small' aria-label='close' sx={{ color: colors.foreground, p: 1 }}>
          <Icon icon='tabler:x' fontSize='1rem' />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Fields */}
      <Box sx={{ px: 4, py: 3, overflowY: 'auto', flex: '1 1 auto' }}>
        <Grid container spacing={3}>
          {fields.map(field => (
            <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Footer */}
      <Box sx={{ px: 4, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, flexShrink: 0 }}>
        <Button
          size='small'
          variant='outlined'
          color='secondary'
          onClick={handleReset}
          startIcon={<Icon icon='tabler:rotate-2' fontSize='1rem' />}
          sx={{
            color: colors.foreground,
            borderColor: colors.border3,
            boxShadow: shadows.xs,
            '&:hover': { borderColor: colors.border3 }
          }}
        >
          {resetLabel}
        </Button>
        <Button
          size='small'
          variant='contained'
          onClick={handleApply}
          startIcon={<Icon icon='tabler:filter' fontSize='1rem' />}
        >
          {applyLabel}
        </Button>
      </Box>
    </Popover>
  )
}
