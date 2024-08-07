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

const ToolbarGoodsIn = ({ id, status }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const onUpdateSuratBarangMasuk = (code, type, e) => {
    dispatch(updateAdjustmentGoodsIn({ code, type, router }))
  }

  return (
    <Card>
      <CardContent>
        <Button fullWidth sx={{ mb: 2 }} color='secondary' variant='tonal'>
          Unduh
        </Button>
        <Button
          fullWidth
          sx={{ mb: 2, '& svg': { mr: 2 } }}
          target='_blank'
          variant='contained'
          component={Link}
          href={`/adjustment/goods-in/print/${id}`}
        >
          <Icon fontSize='1.125rem' icon='tabler:printer' />
          Cetak / Print
        </Button>
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
  )
}

export default ToolbarGoodsIn
