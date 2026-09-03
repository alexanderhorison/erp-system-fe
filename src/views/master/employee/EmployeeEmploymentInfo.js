import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

import { colors, stone } from 'src/configs/designTokens'

const fieldLabelSx = {
  fontSize: '0.75rem',
  color: colors.mutedForeground
}

const fieldValueSx = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: colors.foreground
}

const AmountField = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Box
      sx={{
        width: 32,
        height: 32,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stone[100],
        color: colors.mutedForeground
      }}
    >
      <Icon icon={icon} fontSize='1.125rem' />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={fieldLabelSx}>{label}</Typography>
      <Typography sx={fieldValueSx}>{value ? priceFormatWIthCurrency(value) : '-'}</Typography>
    </Box>
  </Box>
)

export default function EmployeeEmploymentInfo({ data }) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={4}>
        <AmountField icon='tabler:cash' label='Gaji' value={data?.salary} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AmountField icon='tabler:gift' label='Bonus' value={data?.bonus} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <AmountField icon='tabler:receipt-2' label='Kasbon' value={data?.debt} />
      </Grid>
    </Grid>
  )
}
