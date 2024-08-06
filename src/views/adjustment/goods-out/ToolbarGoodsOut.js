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
import { updateAdjustmentGoodsOut } from 'src/store/apps/adjustment/goods-out'

const ToolbarGoodsOut = ({ id, status }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const onUpdateSuratBarangKeluar = (code, type, e) => {
    dispatch(updateAdjustmentGoodsOut({ code, type, router }))
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
          href={`/adjustment/goods-out/print/${id}`}
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
              onClick={e => onUpdateSuratBarangKeluar(id, 'approve', e)}
              sx={{ mb: 2, '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:check' />
              Terima Barang Keluar
            </Button>
            <Button
              fullWidth
              variant='contained'
              color='error'
              onClick={e => onUpdateSuratBarangKeluar(id, 'reject', e)}
              sx={{ mb: 2, '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:x' />
              Tolak Barang Keluar
            </Button>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default ToolbarGoodsOut
