import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'
import SectionHeading from 'src/views/common/SectionHeading'
import RoleMenuAccess from 'src/views/settings/roles/RoleMenuAccess'

// ** Store
import { addRole, editRole, fetchOneRole } from 'src/store/apps/role'

// ** Helpers
import { enumActions } from 'src/helpers/enumActions'
import { showErrors } from 'src/helpers/validationMessages'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const schema = yup.object({
  name: yup
    .string()
    .min(3, obj => showErrors('Nama Otoritas', obj.value.length, obj.min))
    .required('Nama Otoritas harus diisi'),
  description: yup.string().optional()
})

const defaultValues = { name: '', description: '' }

/**
 * RoleForm
 * -------------------------------------------------------------------------------------
 * Shared body for the role add and edit pages — a full-page form (Figma:
 * "Pembuatan Otoritas") replacing the old modal + fixed three-column checklist.
 * Name/Description live in their own card (①), the menu access grid in another
 * (②) via `RoleMenuAccess`; only the submit thunk and initial values differ
 * between add and edit.
 */
export default function RoleForm({ mode, id }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { loadingDetail, loadingAdd, loadingEdit } = useSelector(state => state.role)

  const [checkedMenuIds, setCheckedMenuIds] = useState([])
  const [checkedActions, setCheckedActions] = useState([])
  const [menuError, setMenuError] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (mode === 'EDIT' && id) {
      dispatch(fetchOneRole(id)).then(result => {
        const data = result.payload?.data
        if (data) {
          reset({ name: data.name ?? '', description: data.description ?? '' })
          setCheckedMenuIds(data.menuId || [])
          setCheckedActions((data.actions || []).map(action => action.name))
        }
      })
    }
  }, [mode, id, dispatch, reset])

  const onSubmit = formValues => {
    if (checkedMenuIds.length === 0) {
      setMenuError(true)
      return
    }
    setMenuError(false)

    const listActions = checkedActions.map(actionName => ({
      menuId: enumActions[actionName]?.menuId,
      name: actionName
    }))

    const data = { ...formValues, menuId: checkedMenuIds, actions: listActions }

    if (mode === 'EDIT') {
      dispatch(editRole({ id, data, router }))
    } else {
      dispatch(addRole({ data, router }))
    }
  }

  const loading = mode === 'EDIT' ? loadingEdit : loadingAdd

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title={mode === 'EDIT' ? 'Ubah Otoritas' : 'Pembuatan Otoritas'}
        onBack={() => router.back()}
        breadcrumbs={[
          { label: 'Users & Permissions' },
          { label: 'Permissions', href: '/settings/roles' },
          { label: mode === 'EDIT' ? 'Ubah' : 'Tambah' }
        ]}
      />

      {/* No `spacing` on this container — see `FormActionBar`'s note on the
          content column's edges. */}
      <Grid container>
        <Grid item xs={12}>
          <SectionHeading number={1} title='Informasi Otoritas' />
          <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
            <CardContent sx={{ p: 5 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        label='Nama Otoritas*'
                        onChange={onChange}
                        placeholder='Admin'
                        disabled={mode === 'EDIT' && loadingDetail}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={3}
                        value={value}
                        label='Deskripsi'
                        onChange={onChange}
                        placeholder='Type your message here...'
                        disabled={mode === 'EDIT' && loadingDetail}
                        error={Boolean(errors.description)}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <SectionHeading number={2} title='Menu Akses' />
          <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
            <CardContent sx={{ p: 5 }}>
              <RoleMenuAccess
                checkedMenuIds={checkedMenuIds}
                setCheckedMenuIds={ids => {
                  setMenuError(false)
                  setCheckedMenuIds(ids)
                }}
                checkedActions={checkedActions}
                setCheckedActions={setCheckedActions}
              />
              {menuError && (
                <Typography sx={{ mt: 2, fontSize: '0.75rem', color: 'error.main' }}>Pilih minimal 1 menu</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <FormActionBar onCancel={() => router.back()} loading={loading} submitLabel='Submit' cancelLabel='Cancel' />
        </Grid>
      </Grid>
    </form>
  )
}
