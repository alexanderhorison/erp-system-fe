import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useDispatch, useSelector } from 'react-redux'
import { addMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { fetchDetailProductPos } from 'src/store/apps/pos'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

// Thousand separators for display ("2.500.000"); empty (0) shows the "0" placeholder instead.
const formatPrice = value => {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (!digits || Number(digits) === 0) return ''

  return Number(digits)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const gridSx = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', alignItems: 'center', gap: 4 }

export default function ModalAddBasePrice({ open, setOpen, product, setSelected }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => state.masterProductPrice)

  // Unit → typed price, staged until Save. Cancel throws the edits away.
  const [edits, setEdits] = useState({})
  const [saving, setSaving] = useState(false)

  const rows = (data || []).slice(0, 10).map(row => ({
    ...row,
    productName: product?.productName,
    productId: product?.productId
  }))

  const handleClose = () => {
    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
    dispatch(fetchDetailProductPos({ warehouseId: warehouse?.warehouseId, productId: product?.productId }))
    setEdits({})
    setSelected(null)
    setOpen(false)
  }

  // Only rows whose price actually changed are sent, the same as the old per-cell commit.
  const handleSave = async event => {
    event.preventDefault()

    const changed = rows
      .filter(row => edits[row.unitId] !== undefined && edits[row.unitId] !== Number(row.basePricePos || 0))
      .map(row => ({ ...row, basePricePos: edits[row.unitId] }))

    setSaving(true)
    await Promise.all(changed.map(row => dispatch(addMasterDataProductPrice(row))))
    setSaving(false)
    handleClose()
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSave}
      title='Add Base Price'
      size='md'
      showClose={false}
      loading={saving}
    >
      <Box
        sx={{
          p: 5,
          borderRadius: `${radii['3xl']}px`,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.xs
        }}
      >
        <Typography sx={{ mb: 4, fontSize: '1.25rem', fontWeight: 600, lineHeight: '28px', color: colors.foreground }}>
          {product?.productName}
        </Typography>

        <Box sx={{ borderRadius: `${radii['3xl']}px`, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <Box
            sx={{
              ...gridSx,
              px: 4,
              py: 3,
              backgroundColor: stone[100],
              fontSize: '0.875rem',
              fontWeight: 500,
              color: colors.foreground
            }}
          >
            <Box>Unit</Box>
            <Box>Base Price POS</Box>
          </Box>

          {rows.map(row => (
            <Box
              key={row.unitId}
              sx={{ ...gridSx, px: 4, py: 2, borderTop: `1px solid ${colors.border}`, fontSize: '0.875rem' }}
            >
              <Box sx={{ color: colors.foreground, overflowWrap: 'anywhere' }}>{row.unitName}</Box>
              <CustomTextField
                fullWidth
                placeholder='0'
                inputMode='numeric'
                value={formatPrice(edits[row.unitId] ?? row.basePricePos)}
                onChange={event =>
                  setEdits(prev => ({ ...prev, [row.unitId]: Number(event.target.value.replace(/\D/g, '')) }))
                }
              />
            </Box>
          ))}
        </Box>
      </Box>
    </AppModal>
  )
}
