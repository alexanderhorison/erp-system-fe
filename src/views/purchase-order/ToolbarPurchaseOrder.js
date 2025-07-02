// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { UseAuth } from 'src/hooks/useAuth'
import { CardHeader, Typography } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { updatePurchaseOrder } from 'src/store/apps/purchase-order'
import { priceFormat } from 'src/helpers/priceFormatter'
import { useEffect, useRef, useState } from 'react'
import { swalInfo, swalNotifError, swalNotifSuccess } from 'src/helpers/swalFunction'
import { pdfFormData } from 'src/helpers/generatePdfFormData'
import { sendEmail } from 'src/store/apps/sales-order'
import GeneratePdfPurchaseOrder from './GeneratePdfPurchaseOrder'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

const ToolbarPurchaseOrder = ({ id, data }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()
  const [sending, setIsSending] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const cardRef = useRef(null) // Create a ref for the element
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsShow(true)
  }

  const generatePdf = async cardElement => {
    if (!sending && cardElement) {
      console.log('Generating PDF...')
      const additionSubjectText = `Vendor ${data?.vendor?.name}`
      const generatePdf = await pdfFormData(cardElement, 'Purchase Order', id, 'purchase-order', additionSubjectText)
      dispatch(sendEmail(generatePdf))
      setIsSending(true)
    }
    setIsShow(false) // Hide the component after capture
    if (sending) {
      swalInfo() // info that email has been sent
    }
  }

  useEffect(() => {
    if (isShow) {
      const timer = setTimeout(() => {
        if (cardRef.current) {
          swalNotifSuccess({ message: 'Generating PDF...' })
          generatePdf(cardRef.current)
        } else {
          swalNotifError({ message: 'Gagal generate pdf' })
        }
      }, 300) // Delay to allow rendering, adjust if necessary

      return () => clearTimeout(timer)
    }
  }, [isShow]) // Run this effect when isShow changes

  const onUpdatePurchaseOrder = (code, type, e) => {
    dispatch(updatePurchaseOrder({ code, type, router }))
  }

  return (
    <>
      <Card>
        <CardContent>
          <DownloadButton url={'purchase-order'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
          {/* <Button
            fullWidth
            sx={{ mb: 2, '& svg': { mr: 2 } }}
            target='_blank'
            variant='contained'
            component={Link}
            href={`/purchase-order/print/${id}`}
          >
            <Icon fontSize='1.125rem' icon='tabler:printer' />
            Cetak / Print
          </Button> */}
          <Button fullWidth sx={{ mb: 2, '& svg': { mr: 2 } }} variant='contained' onClick={handleClick}>
            <Icon fontSize='1.125rem' icon='tabler:mail' />
            Kirim Email
          </Button>
          {[1, 3].includes(auth?.user?.roleId) && data?.status == 'PENDING' ? (
            <>
              <Button
                fullWidth
                variant='contained'
                color='success'
                onClick={e => onUpdatePurchaseOrder(id, 'approve', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:check' />
                Terima Purchase Order
              </Button>
              <Button
                fullWidth
                variant='contained'
                color='error'
                onClick={e => onUpdatePurchaseOrder(id, 'reject', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:x' />
                Tolak Purchase Order
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
      <Card sx={{ marginTop: '1rem' }}>
        <CardHeader
          title='Informasi Tambahan'
          action={<CustomChip rounded label={`Important!`} skin='light' color={`warning`} />}
        />
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            Jika purchase order diterima, maka barang akan langsung masuk ke gudang. Jika barang tidak ada, maka barang
            akan di inisialisasi.
          </Typography>
        </CardContent>
      </Card>
      {data?.status === 'APPROVED' && data?.id && (
        <Card sx={{ marginTop: '1rem' }}>
          <CardHeader
            title='Status Pembayaran'
            action={
              <CustomChip
                rounded
                label={
                  data?.amountDebt == 0
                    ? 'LUNAS'
                    : data?.grandTotal === data?.amountDebt
                    ? 'BELUM LUNAS'
                    : 'SEBAGIAN LUNAS'
                }
                skin='light'
                color={data?.amountDebt == 0 ? 'success' : data?.grandTotal === data?.amountDebt ? 'error' : 'warning'}
              />
            }
          />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              Total yang sudah dibayar: Rp. {priceFormat(data?.amountPaid)}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Total yang belum dibayar: Rp. {priceFormat(data?.amountDebt)}
            </Typography>
          </CardContent>
        </Card>
      )}
      {isShow && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <GeneratePdfPurchaseOrder id='print-purchase-order' data={data} ref={cardRef} />
        </div>
      )}
    </>
  )
}

export default ToolbarPurchaseOrder
