// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { IconButton, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataType } from 'src/store/apps/master/type'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

export default function ModalAddMasterProduct({ open, setOpen, handleSubmitAdd }) {
  const dispatch = useDispatch()
  // ** States
  const [input, setInput] = useState({
    name: '',
    CategoryId: '',
    TypeId: '',
    description: ''
  })

  const { data: masterDataCategory } = useSelector(state => state.category)
  const { data: masterDataType } = useSelector(state => state.type)

  const handleInputChange = ({ target }) => {
    const { name, value } = target

    setInput(prevInput => ({
      ...prevInput,
      [name]: value
    }))
  }

  const handleClose = () => {
    setOpen(false)
    setInput({ name: '', CategoryId: '', TypeId: '', description: '' })
  }

  const handleSubmit = () => {
    const formData = input
    handleSubmitAdd(formData)
  }

  useEffect(() => {
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataType())
  }, [])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={() => setOpen(false)}
        onBackdropClick={() => setOpen(false)}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Tambahkan Produk Baru
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    fullWidth
                    name='name'
                    value={input.name}
                    autoComplete='off'
                    label='Nama Produk'
                    placeholder=''
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    select
                    fullWidth
                    name='CategoryId'
                    label='Kategori'
                    value={input.category}
                    onChange={handleInputChange}
                    id='form-layouts-tabs-select'
                    defaultValue=''
                  >
                    {masterDataCategory.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    select
                    fullWidth
                    name='TypeId'
                    label='Tipe'
                    value={input.type}
                    onChange={handleInputChange}
                    id='form-layouts-tabs-select'
                    defaultValue=''
                  >
                    {masterDataType.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={handleSubmit}>
            Tambahkan
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Batal
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
