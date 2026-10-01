import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormInputText from '../common/Form/FormInputText'
import { useForm } from 'react-hook-form'
import { Grid } from '@mui/material'
import { priceFormatWithZero } from 'src/helpers/priceFormatter'
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, stone } from 'src/configs/designTokens'

const saveToLocalStorage = data => localStorage.setItem('listProductPos', JSON.stringify(data))

export default function ProductCustomField({ append, fields }) {
  const {
    control,
    watch,
    formState: { errors },
    getValues,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      title: 'Custom Amount',
      quantity: 1,
      price: 0,
      productName: 'Custom Amount'
    }
  })

  const handleAppend = () => {
    let value = getValues()
    const subTotal = value.quantity * value.price
    value = { ...value, productName: value.title, isCustom: true, subTotal, warehouseProductId: null }
    append(value)
    saveToLocalStorage([...fields, value])
    autoSavePos()
    reset()
  }

  const handleButtonClick = value => {
    const currentPrice = watch('price')
    if (value === 'C') {
      setValue('price', 0)
    } else if (value === 'Del') {
      const newPrice = currentPrice.toString().slice(0, -1)
      setValue('price', newPrice ? parseInt(newPrice, 10) : 0)
    } else {
      const newPrice = `${currentPrice}${value}`
      setValue('price', parseInt(newPrice, 10))
    }
  }

  return (
    <Box
      sx={{
        margin: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        gap: 3
      }}
    >
      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <FormInputText control={control} errors={errors} placeholder='Custom Amount' name='title' label='Judul' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormInputNumberPos control={control} errors={errors} placeholder='Quantity' name='quantity' min={1} />
          </Grid>
        </Grid>

        {/* Amount typed so far */}
        <Box
          sx={{
            py: 3,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            borderRadius: `${radii['3xl']}px`,
            backgroundColor: stone[100],
            border: `1px solid ${colors.border}`
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>Harga</Typography>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2, color: colors.foreground }}>
            Rp. {priceFormatWithZero(watch('price'))}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {/* HERE THE NUMBER */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 3 }}>
          {[1, 2, 3, 0, 4, 5, 6, `00`, 7, 8, 9, `000`].map((value, index) => (
            <Button
              key={index}
              onClick={() => handleButtonClick(value)}
              sx={{
                height: 64,
                fontSize: '1.25rem',
                fontWeight: 600,
                color: colors.foreground,
                backgroundColor: stone[100],
                border: `1px solid ${stone[400]}`,
                borderRadius: `${radii['3xl']}px`,
                '&:hover': { backgroundColor: stone[200] }
              }}
            >
              {value}
            </Button>
          ))}
          <Button
            variant='outlined'
            color='error'
            onClick={() => handleButtonClick('C')}
            sx={{ gridColumn: 'span 2', height: 52, fontSize: '1rem', fontWeight: 600 }}
          >
            C
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => handleButtonClick('Del')}
            startIcon={<Icon icon='tabler:backspace' fontSize='1.25rem' />}
            sx={{
              gridColumn: 'span 2',
              height: 52,
              fontSize: '1rem',
              fontWeight: 600,
              color: colors.foreground,
              borderColor: colors.border3,
              '&:hover': { borderColor: colors.border3, backgroundColor: stone[50] }
            }}
          >
            Del
          </Button>
          <Button
            variant='contained'
            onClick={handleAppend}
            startIcon={<Icon icon='tabler:plus' fontSize='1.25rem' />}
            sx={{ gridColumn: '1 / -1', height: 56, fontSize: '1rem', fontWeight: 600 }}
          >
            Tambahkan
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
