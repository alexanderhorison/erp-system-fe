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
import { updateAdjustmentGoodsIn } from 'src/store/apps/adjustment/goods-in'
import { CardHeader, Typography } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { useState } from 'react'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

const ToolbarGoodsIn = ({ id, status }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onUpdateSuratBarangMasuk = (code, type, e) => {
    dispatch(updateAdjustmentGoodsIn({ code, type, router }))
  }

  return (
    <>
      <Card>
        <CardContent>
          <DownloadButton url={'adjustment-goods-in'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
          {/* <Button
            fullWidth
            sx={{ mb: 2, '& svg': { mr: 2 } }}
            target='_blank'
            variant='contained'
            component={Link}
            href={`/adjustment/goods-in/print/${id}`}
          >
            <Icon fontSize='1.125rem' icon='tabler:printer' />
            Cetak / Print
          </Button> */}
          {[1, 3].includes(auth?.user?.roleId) && status == 'PENDING' ? (
            <>
              <Button
                fullWidth
                variant='contained'
                color='success'
                onClick={e => onUpdateSuratBarangMasuk(id, 'approve', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:check' />
                Terima Barang Masuk
              </Button>
              <Button
                fullWidth
                variant='contained'
                color='error'
                onClick={e => onUpdateSuratBarangMasuk(id, 'reject', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:x' />
                Tolak Barang Masuk
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
            1. Jika barang sudah ada di gudang, maka barang akan masuk ke rak yg sama.
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            2. Jika barang tidak ada di gudang, maka barang akan masuk ke rak default.
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default ToolbarGoodsIn
