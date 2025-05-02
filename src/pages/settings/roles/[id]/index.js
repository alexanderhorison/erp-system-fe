import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Grid,
  Button
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMenus } from 'src/store/apps/menu'
import { editRole, fetchOneRole } from 'src/store/apps/role'
import ButtonBack from 'src/views/common/ButtonBack'
import Icon from 'src/@core/components/icon'

export default function DetailRole() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = useRouter().query.id
  const [checkedMenuIds, setCheckedMenuIds] = useState([])

  const { detailRole, loadingDetail, errorDetail } = useSelector(state => state.role)

  const handleSubmit = async event => {
    event.preventDefault()
    const data = {
      name: detailRole.name,
      description: detailRole.description,
      menuId: checkedMenuIds
    }
    dispatch(editRole({ id, data, router }))
  }

  useEffect(() => {
    dispatch(fetchOneRole(id))
    dispatch(fetchMenus())
  }, [id])

  useEffect(() => {
    setCheckedMenuIds(detailRole.menuId)
  }, [loadingDetail, detailRole])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ButtonBack name='Role Details' />
      <Card sx={{ padding: 2, marginBottom: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='body1' component='p'>
            <strong>Nama:</strong> {detailRole.name}
          </Typography>
          <Typography variant='body1' component='p'>
            <strong>Deskripsi:</strong> {detailRole.description}
          </Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant='h4' component='h2' p={2} borderRadius={2} textAlign={'center'} bgcolor={'#f5f5f5'}>
            Menu Access
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <List sx={{ padding: '1px' }}>
                <MenuTitle name={'Inventory'} />
                <MenuSubTitle name={'Data Inventory'} />
                <MenuItem
                  name={'Produk'}
                  menuId={5}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Tipe Produk'}
                  menuId={4}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Satuan Produk'}
                  menuId={12}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Kategori Produk'}
                  menuId={3}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Gudang'}
                  menuId={6}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Company'}
                  menuId={13}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuSubTitle name={'Manajemen Stock'} />
                <MenuItem
                  name={'List Produk Gudang'}
                  menuId={8}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Penyesuaian Stock Produk'}
                  menuId={9}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Barang Masuk'}
                  menuId={16}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Barang Keluar'}
                  menuId={17}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Internal Transfer'}
                  menuId={18}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Barang Terhapus'}
                  menuId={26}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Stock Opname'}
                  menuId={15}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuSubTitle name={'Surat Jalan'} />
                <MenuItem
                  name={'Surat Jalan'}
                  menuId={10}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Penerimaan Surat Jalan'}
                  menuId={11}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Produk Outstanding'}
                  menuId={19}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
              </List>
            </Grid>
            <Grid item md={4} xs={12}>
              <List sx={{ padding: '1px' }}>
                <MenuTitle name={'Sales Order & Purchase Order'} />
                <MenuSubTitle name={'Data Customer'} />
                <MenuItem
                  name={'Customer'}
                  menuId={21}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Rank'}
                  menuId={22}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuSubTitle name={'Sales Order'} />
                <MenuItem
                  name={'Sales Order'}
                  menuId={23}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuSubTitle name={'Data Vendor'} />
                <MenuItem
                  name={'Vendor'}
                  menuId={24}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuSubTitle name={'Purchase Order'} />
                <MenuItem
                  name={'Purchase Order'}
                  menuId={25}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuTitle name={'Daily Cost Calendar'} />
                <MenuItem
                  name={'Daily Cost Calendar'}
                  menuId={33}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
              </List>
            </Grid>
            <Grid item md={4} xs={12}>
              <List sx={{ padding: '1px' }}>
                <MenuTitle name={'Pengguna & Otoritas'} />
                <MenuItem
                  name={'Pengguna'}
                  menuId={1}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Otoritas'}
                  menuId={2}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Printer Setting'}
                  menuId={28}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuTitle name={'Master'} />
                <MenuItem
                  name={'Category Cost Tak Terduga'}
                  menuId={29}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Karyawan'}
                  menuId={32}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Mobil'}
                  menuId={31}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuTitle name={'Report'} />
                <MenuItem
                  name={'Report'}
                  menuId={30}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuTitle name={'Point Of Sale'} />
                <MenuItem
                  name={'Point Of Sale'}
                  menuId={27}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container sx={{ paddingLeft: '25px', marginTop: '20px' }} display='flex' justifyContent='flex-end' gap={6}>
        <Button variant='tonal' color='secondary' onClick={() => router.back()} startIcon={<Icon icon='tabler:x' />}>
          Cancel
        </Button>
        <Button variant='contained' type='submit' startIcon={<Icon icon='tabler:send' />} onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
    </Box>
  )
}

const MenuItem = ({ name, menuId, setCheckedMenuIds, checkedMenuIds }) => {
  return (
    <ListItem sx={{ padding: '5px' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedMenuIds?.includes(menuId)}
            value={menuId}
            onChange={event => {
              if (event.target.checked) {
                setCheckedMenuIds([...checkedMenuIds, menuId])
              } else {
                setCheckedMenuIds(checkedMenuIds.filter(id => id !== menuId))
              }
            }}
          />
        }
        label={name}
      />
    </ListItem>
  )
}

const MenuTitle = ({ name }) => {
  return (
    <Typography variant='h5' component='h2' py={2}>
      {name}
    </Typography>
  )
}

const MenuSubTitle = ({ name }) => {
  return (
    <Typography variant='h6' component='h2' py={2}>
      {name}
    </Typography>
  )
}
