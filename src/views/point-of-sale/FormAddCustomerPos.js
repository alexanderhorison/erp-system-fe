// ** MUI Imports
// import Box from '@mui/material/Box'
import {
  Card,
  Grid,
  DialogContent,
  DialogActions,
} from '@mui/material'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

import { useDispatch, useSelector } from 'react-redux'

import { useEffect } from 'react'
import { fetchMasterDataRank } from 'src/store/apps/master/rank'
import FormSelectSimple from 'src/views/common/Form/FormSelectSimple'
import FormInputText from 'src/views/common/Form/FormInputText'

export default function FormAddCustomerPos({
  typeModal = "ADD",
  control,
  errors,
}) {
  const dispatch = useDispatch()
  const { data: dataRank } = useSelector(state => state.masterRank)

  useEffect(() => {
    dispatch(fetchMasterDataRank())
  }, [])

  return (
    <Card sx={{ mt: 4 }}>
      <form >
        <DialogContent
          sx={{
            height: "64vh"
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormInputText
                    label={'Name Customer'}
                    name={'name'}
                    control={control}
                    errors={errors}
                    disabled={typeModal === 'VIEW'}
                    placeholder='Masukkan Name Customer'
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInputText
                    type='number'
                    label={'Nomor Telepon'}
                    name={'phoneNumber'}
                    control={control}
                    errors={errors}
                    disabled={typeModal === 'VIEW'}
                    placeholder='Masukkan Nomor Telepon'
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInputText
                    label={'Email'}
                    name={'email'}
                    control={control}
                    errors={errors}
                    disabled={typeModal === 'VIEW'}
                    placeholder='Masukkan Email'
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelectSimple
                    label={'Pilih Jenis Kelamin'}
                    control={control}
                    errors={errors}
                    disabled={typeModal === 'VIEW'}
                    data={[
                      { value: "Laki-laki", name: 'Laki-laki' },
                      { value: "Perempuan", name: 'Perempuan' },
                      { value: "Lainnya", name: 'Lainnya' }
                    ]}
                    name={'gender'}
                    optionsValue={'value'}
                    optionsLabel={'name'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInputText
                    label={'Alamat Customer'}
                    name={'address'}
                    control={control}
                    errors={errors}
                    disabled={typeModal === 'VIEW'}
                    placeholder='Masukkan Alamat Customer'
                    multiline={true}
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelectSimple
                    label={'Pilih Rank'}
                    control={control}
                    errors={errors}
                    disabled={typeModal === 'VIEW'}
                    data={dataRank}
                    name={'rankId'}
                    optionsValue={'id'}
                    optionsLabel={'name'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInputText
                    label={'Catatan'}
                    name={'notes'}
                    control={control}
                    errors={errors}
                    disabled={typeModal === 'VIEW'}
                    placeholder='Masukkan Catatan'
                    multiline={true}
                    rows={4}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'end',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          }}
        >
        </DialogActions>
      </form>
    </Card>
  )
}
