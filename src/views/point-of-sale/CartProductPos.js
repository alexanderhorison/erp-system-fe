import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { priceFormat } from 'src/helpers/priceFormatter'

const fontSizeProduct = "0.75rem";
const fontSizeQuantity = "0.75rem";
const fontSizePrice = "0.875rem";

export default function CartProductPos({
  data,
  control,
  helperTextPrice,
}) {
  return (
    <Card
      sx={{
        border: 1,
        maxHeight: '45vh',
        overflowY: 'auto',
        minHeight: 150
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
          <CardContent>
            <Grid container spacing={6}>
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
                      {priceFormat(value)}
                    </Typography>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </React.Fragment>
      ))}
    </Card>
  )
}