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
import CustomTextField from 'src/@core/components/mui/text-field'
import { enumActions } from 'src/helpers/enumActions'

export default function DetailRole() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = useRouter().query.id
  const [checkedMenuIds, setCheckedMenuIds] = useState([])
  const [checkedActions, setCheckedActions] = useState([])

  const { detailRole, loadingDetail, errorDetail } = useSelector(state => state.role)

  const [inputField, setInputField] = useState({
    name: '',
    description: ''
  })

  const handleSubmit = async event => {
    event.preventDefault()
    if (!inputField.name) {
    } else {
      const listActions = checkedActions.map(actionName => ({
        menuId: enumActions[actionName]?.menuId,
        name: actionName
      }))
      const data = {
        ...inputField,
        menuId: checkedMenuIds,
        actions: listActions
      }
      dispatch(editRole({ id, data, router }))
    }
  }

  useEffect(() => {
    dispatch(fetchOneRole(id)).then(result => {
      setInputField({
        name: result.payload.data.name ?? '',
        description: result.payload.data.description ?? ''
      })
    })
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
          <CustomTextField
            fullWidth
            value={inputField.name}
            sx={{ mb: 4 }}
            label='Nama'
            onChange={e => setInputField(prev => ({ ...prev, name: e.target.value }))}
            error={Boolean(!inputField.name)}
            {...(!inputField.name && { helperText: 'Nama Role harus ada' })}
          />
          <CustomTextField
            fullWidth
            value={inputField.description}
            sx={{ mb: 4 }}
            label='Deskripsi'
            onChange={e => setInputField(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={3}
          />
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
                <MenuTitle name={'Dashboard'} />
                <MenuItem
                  name={'Inventory'}
                  menuId={40}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Sales Order'}
                  menuId={41}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Purchase Order'}
                  menuId={42}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Finance'}
                  menuId={43}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuTitle name={'Inventory'} />
                <MenuItem
                  name={'Stock Opname'}
                  menuId={15}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Product Request'}
                  menuId={44}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Loan Stock'}
                  menuId={45}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
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
                <MenuTitle name={'Asset'} />
                <MenuItem
                  name={'Aset Lancar Bulanan'}
                  menuId={34}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Master Aset Tidak Lancar'}
                  menuId={35}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Aset Tidak Lancar Bulanan'}
                  menuId={36}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuTitle name={'Liabilitas Bulanan'} />
                <MenuItem
                  name={'Jangka Pendek Bulanan'}
                  menuId={37}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuItem
                  name={'Jangka Panjang Bulanan'}
                  menuId={38}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                />
                <MenuTitle name={'Ekuitas Bulanan'} />
                <MenuItem
                  name={'Ekuitas Bulanan'}
                  menuId={39}
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
                <MenuItem
                  name={'Configuration Setting'}
                  menuId={45}
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
                  actions={[enumActions.EDIT_POS_BASE_PRICE]}
                  setCheckedMenuIds={setCheckedMenuIds}
                  checkedMenuIds={checkedMenuIds}
                  setCheckedActions={setCheckedActions}
                  checkedActions={checkedActions}
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

const MenuItem = ({
  name,
  menuId,
  setCheckedMenuIds,
  checkedMenuIds,
  actions = [],
  checkedActions = [], // ✅ default fallback
  setCheckedActions = () => {} // ✅ no-op if not passed
}) => {
  const { detailRole } = useSelector(state => state.role)

  useEffect(() => {
    if (detailRole) {
      // If role has this menuId, check it
      const hasMenu = detailRole.menuId?.includes(menuId)
      if (hasMenu && !checkedMenuIds?.includes(menuId)) {
        setCheckedMenuIds((prev = []) => [...prev, menuId])
      }

      // Find which actions belong to this menuId
      const roleActionsForMenu = detailRole.actions?.filter(a => a.menuId === menuId)?.map(a => a.name)

      // Initialize checkedActions for this menu
      if (roleActionsForMenu?.length) {
        setCheckedActions(roleActionsForMenu)
      }
    }
  }, [detailRole, menuId])

  const handleMenuChange = event => {
    if (event.target.checked) {
      setCheckedMenuIds([...checkedMenuIds, menuId])
    } else {
      setCheckedMenuIds(checkedMenuIds.filter(id => id !== menuId))
      setCheckedActions([]) // uncheck actions if menu unchecked
    }
  }

  const handleActionChange = action => {
    if (checkedActions.includes(action)) {
      setCheckedActions(checkedActions.filter(a => a !== action))
    } else {
      setCheckedActions([...checkedActions, action])
    }
  }

  return (
    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 1 }}>
      {/* Main menu checkbox */}
      <FormControlLabel
        control={<Checkbox checked={checkedMenuIds?.includes(menuId)} onChange={handleMenuChange} />}
        label={name}
      />

      {/* Render nested actions if menu is checked and actions exist */}
      {checkedMenuIds?.includes(menuId) && actions.length > 0 && (
        <Box sx={{ pl: 4 }}>
          {actions.map(action => (
            <FormControlLabel
              key={action?.value}
              control={
                <Checkbox
                  checked={checkedActions.includes(action.value)}
                  onChange={() => handleActionChange(action.value)}
                />
              }
              label={action?.label}
            />
          ))}
        </Box>
      )}
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
