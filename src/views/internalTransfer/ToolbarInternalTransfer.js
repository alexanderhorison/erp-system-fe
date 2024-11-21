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
import { updateInternalTransfer } from 'src/store/apps/internal-transfer'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'
import { useState } from 'react'

const ToolbarInternalTransfer = ({ id, status }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const onUpdateInternalTransfer = (code, type, e) => {
    dispatch(updateInternalTransfer({ code, type, router }))
  }
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Card>
        <CardContent>
          <DownloadButton url={'internal-transfer'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
          <Button
            fullWidth
            sx={{ mb: 2, '& svg': { mr: 2 } }}
            target='_blank'
            variant='contained'
            component={Link}
            href={`/internal-transfer/print/${id}`}
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
                onClick={e => onUpdateInternalTransfer(id, 'approve', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:check' />
                Terima Internal Transfer
              </Button>
              <Button
                fullWidth
                variant='contained'
                color='error'
                onClick={e => onUpdateInternalTransfer(id, 'reject', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:x' />
                Tolak Internal Transfer
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
      <Card sx={{ marginTop: '1rem', maxWidth: 345 }}>
        <CardHeader
          title='Informasi Tambahan'
          action={<CustomChip rounded label={`Important!`} skin='light' color={`warning`} />}
        />
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            Jika internal transfer diterima, barang akan langsung berpindah ke rak tujuan
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default ToolbarInternalTransfer
