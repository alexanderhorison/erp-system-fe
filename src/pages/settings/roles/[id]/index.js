import { Box, Card, CardContent, Typography, Checkbox, FormControlLabel, List, ListItem, Grid, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenus } from 'src/store/apps/menu';
import { editRole, fetchOneRole } from 'src/store/apps/role';
import ButtonBack from 'src/views/common/ButtonBack';
import Icon from 'src/@core/components/icon'

export default function DetailRole() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = useRouter().query.id
  const [checkedMenuIds, setCheckedMenuIds] = useState([]);

  const menuList = useSelector(state => state.menu.dataMenus)
  const { detailRole, loadingDetail, errorDetail } = useSelector(state => state.role)

  const handleSubmit = async (event) => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
      <ButtonBack name='Role Details' />
      <Card sx={{ padding: 2, marginBottom: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1" component="p">
            <strong>Nama:</strong> {detailRole.name}
          </Typography>
          <Typography variant="body1" component="p">
            <strong>Deskripsi:</strong> {detailRole.description}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ padding: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h2">
            Menu Access
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <List sx={{ padding: '1px' }}>
                {menuList.slice(0, Math.ceil(menuList.length / 2)).map((menu, index) => (
                  <ListItem key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedMenuIds?.includes(menu.menuId)}
                          value={menu.menuId}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setCheckedMenuIds([...checkedMenuIds, menu.menuId]);
                            } else {
                              setCheckedMenuIds(checkedMenuIds.filter((id) => id !== menu.menuId));
                            }
                          }}
                        />
                      }
                      label={menu.name}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6}>
              <List sx={{ padding: '1px' }}>
                {menuList.slice(Math.ceil(menuList.length / 2)).map((menu, index) => (
                  <ListItem key={index}>
                    <FormControlLabel
                      control={<Checkbox
                        checked={checkedMenuIds?.includes(menu.menuId)}
                        value={menu.menuId}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setCheckedMenuIds([...checkedMenuIds, menu.menuId]);
                          } else {
                            setCheckedMenuIds(checkedMenuIds.filter((id) => id !== menu.menuId));
                          }
                        }}
                      />}
                      label={menu.name}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid
        container
        sx={{ paddingLeft: '25px', marginTop: '20px' }}
        display='flex'
        justifyContent='flex-end'
        gap={6}
      >
        <Button
          variant='tonal'
          color='secondary'
          onClick={() => router.back()}
          startIcon={<Icon icon='tabler:x' />}
        >
          Cancel
        </Button>
        <Button variant='contained' type='submit' startIcon={<Icon icon='tabler:send' />} onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
    </Box>
  );
}