import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import { priceFormatWithZero } from 'src/helpers/priceFormatter'
import Icon from 'src/@core/components/icon'
import { swalConfirmationOnly } from "src/helpers/swalFunctionPos";

const fontSizeProduct = "0.75rem";
const fontSizeQuantity = "0.75rem";
const fontSizePrice = "0.875rem";

export default function CartProductPos({
  data,
  control,
  helperTextPrice,
  setOpenEditProduct,
  selectedProductEdit,
  setSelectedProductEdit,
  handleDeleteCustom,
  isMobile,
  isTablet,
  heightBody,
  isLowHeight
}) {
  const viewportHeight = window.innerHeight;

  // Responsive height calculation for cart
  const getCartHeight = () => {
    return {
      minHeight: '200px',
      maxHeight: '100%',
      height: '100%'
    }
  }

  const cartHeight = getCartHeight();

  const handleOpenEditProduct = (item, index) => {
    if (item?.isCustom) {
      swalConfirmationOnly({
        title: `Anda yakin ingin menghapus ${item?.productName} ini?`,
        text: 'Anda tidak dapat mengembalikan produk ini lagi.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Tidak',
        reverseButtons: true,
        confirmButtonColor: '#6F4E37',
        onClickYes: () => {
          handleDeleteCustom(item, index)
        },
      })
    } else {
      setOpenEditProduct(true)
      setSelectedProductEdit({
        ...item,
        index
      })
    }
  }
  return (
    <Card
      sx={{
        border: 1,
        height: cartHeight.height,
        overflowY: 'auto',
        minHeight: cartHeight.minHeight,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {
        data.length === 0 && (
          <CardContent>
            <Typography align='center' variant='h6' sx={{ marginTop: '4px', fontWeight: 'bold', textWrap: 'wrap' }}>
              Belum ada produk
            </Typography>
          </CardContent>
        )
      }
      {data.map((item, index) => (
        <React.Fragment key={item.id}>
          <CardContent onClick={() => {
            if (item?.isCustom) return
            handleOpenEditProduct(item, index)
          }} sx={{ paddingY: isLowHeight ? 1 : { xs: 2, md: 4 } }}>
            <Grid container spacing={isLowHeight ? 1 : { xs: 2, md: 6 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name={`formData[${index}].productName`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div>
                      <Typography fontSize={fontSizeProduct} sx={{ marginTop: '4px', fontWeight: 'bold', textWrap: 'wrap' }}>
                        {value}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='textSecondary'
                        sx={{ marginTop: '4px' }}
                      >
                        {helperTextPrice(index).detailItem}
                      </Typography>
                      {
                        item?.notes && (
                          <Typography
                            variant='body2'
                            color='textSecondary'
                            sx={{ marginTop: '4px' }}
                          >
                            Notes: {item?.notes}
                          </Typography>
                        )
                      }
                    </div>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Controller
                  name={`formData[${index}].quantity`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Typography fontSize={fontSizeQuantity} sx={{ marginTop: '4px', fontWeight: 'bold' }}>
                      x{value}
                    </Typography>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name={`formData[${index}].subTotal`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Typography fontSize={fontSizePrice} sx={{ marginTop: '4px', fontWeight: 'bold', textAlign: 'right' }}>
                      {priceFormatWithZero(value)}
                    </Typography>
                  )}
                />
                {
                  item?.isCustom && (
                    <IconButton
                      disableRipple
                      onClick={e => {
                        if (item?.isCustom) {
                          // e.stopPropagation();
                          handleOpenEditProduct(item, index)
                        }
                      }}
                      sx={{
                        width: '100%',
                        // border: 1,
                        borderRadius: 0,
                        zoom: 0.6,
                        display: 'flex',
                        justifyContent: 'end',
                        color: 'text.primary',
                        ":hover": { backgroundColor: 'transparent' }
                      }}
                    >
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  )
                }
              </Grid>
            </Grid>
          </CardContent>
        </React.Fragment>
      ))}
    </Card>
  )
}