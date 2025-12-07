import { Card, CardContent, Typography, CircularProgress } from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import axios from 'src/configs/axios'
import { swalToastError, swalToastSuccess } from 'src/helpers/swalFunction'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'

export default function CardTestPrinter({ printer }) {
  const [loading, setLoading] = useState(false)

  const handleClickCard = () => {
    if (loading) return

    swalConfirmationOnly({
      title: `Test Print ${printer.description}`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Printer:</strong> ${printer.description}</p>
          <p><strong>IP Address:</strong> ${printer.value_json.ip || printer.value_json.printerHost}</p>
          <p style="margin-top: 15px;">Apakah Anda ingin melakukan test print?</p>
        </div>
      `,
      confirmButtonText: 'Ya, Test Print',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      icon: 'question',
      onClickYes: handleTestPrint
    })
  }

  const handleTestPrint = async () => {
    setLoading(true)
    try {
      const response = await axios({
        method: 'POST',
        url: '/health-check/printer/test-print',
        data: {
          ip: printer.value_json.ip || printer.value_json.printerHost,
          name: printer.description
        }
      })

      if (response.data.success) {
        swalToastSuccess({
          label: 'Test Print',
          response: {
            data: {
              message: 'Test print berhasil dikirim!'
            }
          }
        })
      }
    } catch (error) {
      swalToastError({
        label: 'Test Print',
        error
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid #e0e0e0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: loading ? 'background.paper' : '#f5f5f5',
          boxShadow: loading ? 1 : 3
        }
      }}
      onClick={handleClickCard}
    >
      <CardContent
        sx={{
          py: 2,
          px: 2,
          '&:last-child': { pb: 2 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: 1
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={24} />
            <Typography variant='body2' sx={{ fontWeight: 500, textAlign: 'center' }}>
              Printing...
            </Typography>
          </>
        ) : (
          <>
            <Icon icon='tabler:printer' width={32} height={32} />
            <Typography variant='body2' sx={{ fontWeight: 500, textAlign: 'center' }}>
              Test Print
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  )
}
