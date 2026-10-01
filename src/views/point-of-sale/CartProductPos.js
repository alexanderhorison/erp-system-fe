import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { Controller } from 'react-hook-form'

// ** Helpers & Icons
import { priceFormatWithZero } from 'src/helpers/priceFormatter'
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, stone } from 'src/configs/designTokens'

const StepperButton = ({ icon, onClick, disabled, label }) => (
  <IconButton
    size='small'
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    sx={{
      width: 36,
      height: 36,
      color: 'primary.contrastText',
      backgroundColor: 'primary.main',
      '&:hover': { backgroundColor: 'primary.dark' },
      '&.Mui-disabled': { color: 'primary.contrastText', backgroundColor: 'primary.main', opacity: 0.35 }
    }}
  >
    <Icon icon={icon} fontSize='1.125rem' />
  </IconButton>
)

export default function CartProductPos({
  data,
  control,
  helperTextPrice,
  setOpenEditProduct,
  setSelectedProductEdit,
  onChangeQuantity,
  onRequestDelete
}) {
  const handleOpenEditProduct = (item, index) => {
    setOpenEditProduct(true)
    setSelectedProductEdit({
      ...item,
      index
    })
  }

  if (data.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 1,
          px: 4
        }}
      >
        <Icon icon='tabler:basket' fontSize='1.5rem' style={{ color: colors.mutedForeground }} />
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground }}>
          Belum ada produk
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
          Pilih produk di panel kiri lalu tambahkan ke keranjang
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {data.map((item, index) => {
        const isManual = item?.isCustom
        const canDelete = !item?.isDebt
        const stock = Number(item?.qty)
        const quantity = Number(item?.quantity) || 0

        return (
          <Box
            key={item.id}
            sx={{
              px: 4,
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              '&:not(:last-of-type)': { borderBottom: `1px solid ${colors.border}` }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ minWidth: 0 }}>
                <Controller
                  name={`formData[${index}].productName`}
                  control={control}
                  render={({ field: { value } }) => (
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: colors.foreground,
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {value}
                    </Typography>
                  )}
                />
                <Typography sx={{ mt: 0.5, fontSize: '0.8125rem', color: colors.mutedForeground }}>
                  {helperTextPrice(index).detailItem}
                </Typography>
                {item?.notes && (
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                    Notes: {item?.notes}
                  </Typography>
                )}
              </Box>
              {canDelete && (
                <IconButton
                  size='small'
                  aria-label='Hapus dari keranjang'
                  onClick={() => onRequestDelete(item, index)}
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    color: colors.primaryForeground,
                    backgroundColor: colors.destructive,
                    '&:hover': { backgroundColor: colors.destructive, filter: 'brightness(0.92)' }
                  }}
                >
                  <Icon icon='tabler:trash' fontSize='1.125rem' />
                </IconButton>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isManual ? (
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>
                    x{item?.quantity}
                  </Typography>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        px: 1,
                        py: 1,
                        borderRadius: 9999,
                        backgroundColor: stone[100]
                      }}
                    >
                      <StepperButton
                        icon='tabler:minus'
                        label='Kurangi'
                        disabled={quantity <= 1}
                        onClick={() => onChangeQuantity(index, quantity - 1)}
                      />
                      <Controller
                        name={`formData[${index}].quantity`}
                        control={control}
                        render={({ field: { value } }) => (
                          <Typography
                            sx={{
                              minWidth: 24,
                              textAlign: 'center',
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: colors.foreground
                            }}
                          >
                            {value}
                          </Typography>
                        )}
                      />
                      <StepperButton
                        icon='tabler:plus'
                        label='Tambah'
                        disabled={Number.isFinite(stock) && stock > 0 && quantity >= stock}
                        onClick={() => onChangeQuantity(index, quantity + 1)}
                      />
                    </Box>
                    <IconButton
                      size='small'
                      aria-label='Ubah produk'
                      onClick={() => handleOpenEditProduct(item, index)}
                      sx={{ width: 40, height: 40, color: colors.foreground, border: `1px solid ${colors.border3}` }}
                    >
                      <Icon icon='tabler:edit' fontSize='1.125rem' />
                    </IconButton>
                  </>
                )}
              </Box>
              <Controller
                name={`formData[${index}].subTotal`}
                control={control}
                render={({ field: { value } }) => (
                  <Typography
                    sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, textAlign: 'right' }}
                  >
                    {priceFormatWithZero(value)}
                  </Typography>
                )}
              />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
