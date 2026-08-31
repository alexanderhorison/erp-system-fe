import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'

export default function TableHeaderDebtEmployee(props) {
  const { handleClick } = props
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        pb: 2,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}></Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <Button
          size='small'
          color='primary'
          variant='contained'
          startIcon={<Icon icon='tabler:square-plus' />}
          onClick={() => handleClick('PEMINJAMAN')}
        >
          {t('Tambah Kasbon')}
        </Button>
        <Button
          size='small'
          color='primary'
          variant='contained'
          startIcon={<Icon icon='tabler:square-minus' />}
          onClick={() => handleClick('PEMBAYARAN')}
        >
          {t('Bayar Kasbon')}
        </Button>
      </Box>
    </Box>
  )
}
