import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { fetchCompanyInfo, updateCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'
import FormInputText from 'src/views/common/Form/FormInputText'
import FormFileUpload from 'src/views/common/Form/FormFileUpload'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

export default function EditConfigurationSetting() {
  const router = useRouter()
  const dispatch = useDispatch()

  const { companyInfo, loadingCompanyInfo, loadingUpdateCompanyInfo } = useSelector(state => state.companyConfig)
  const companyData = companyInfo?.value_json ? companyInfo.value_json : companyInfo

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  const schema = yup.object().shape({
    companyName: yup.string().required('Nama company harus diisi'),
    companyNamePos: yup.string().optional(),
    ptName: yup.string().required('Nama PT harus diisi'),
    address: yup.string().required('Alamat harus diisi'),
    city: yup.string().required('Kota harus diisi'),
    phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    ownerName: yup.string().required('Approval SO harus diisi'),
    ownerTitle: yup.string().required('Jabatan Approval SO harus diisi'),
    bank: yup.string().required('Informasi bank harus diisi'),
    ppn: yup.string().optional(),
    logo: yup.mixed().optional().nullable(true)
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: {
      companyName: companyData?.companyName || '',
      companyNamePos: companyData?.companyNamePos || '',
      ptName: companyData?.ptName || '',
      address: companyData?.address || '',
      city: companyData?.city || '',
      phoneNumber: companyData?.phoneNumber || '',
      ownerName: companyData?.ownerName || '',
      ownerTitle: companyData?.ownerTitle || '',
      bank: companyData?.bank || '',
      ppn: companyData?.ppn || '',
      logo: null
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const configData = {
      key: 'COMPANY_INFO',
      value: '',
      category: 'COMPANY_INFO',
      value_json: {
        companyName: data.companyName,
        companyNamePos: data.companyNamePos,
        ptName: data.ptName,
        address: data.address,
        city: data.city,
        phoneNumber: data.phoneNumber,
        ownerName: data.ownerName,
        ownerTitle: data.ownerTitle,
        bank: data.bank,
        ppn: data.ppn,
        ...(companyData?.logoUrl && { logoUrl: companyData.logoUrl })
      },
      description: 'Company Info'
    }

    let payload

    if (data.logo && data.logo instanceof File) {
      const formData = new FormData()

      Object.keys(configData).forEach(key => {
        if (key === 'value_json') {
          Object.keys(configData[key]).forEach(jsonKey => {
            formData.append(`value_json.${jsonKey}`, configData[key][jsonKey])
          })
        } else {
          formData.append(key, configData[key])
        }
      })

      formData.append('logo', data.logo)
      payload = formData
    } else {
      payload = configData
    }

    dispatch(updateCompanyInfo({ id: companyInfo.id, payload, router }))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title='Ubah Informasi Company'
        onBack={() => router.back()}
        breadcrumbs={[
          { label: 'Users & Permissions' },
          { label: 'Configuration Setting', href: '/settings/configuration-setting' },
          { label: 'Edit' }
        ]}
      />

      <Grid container>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}>
            <CardContent sx={{ p: 5 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='companyName'
                    control={control}
                    label='Company Name'
                    placeholder='Enter company name'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='companyNamePos'
                    control={control}
                    label='Company Name POS'
                    placeholder='Enter POS company name (optional)'
                    errors={errors}
                    loading={loadingCompanyInfo}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='ptName'
                    control={control}
                    label='PT Name'
                    placeholder='Enter PT name'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='ownerName'
                    control={control}
                    label='Approval SO & PO'
                    placeholder='Michael'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='ownerTitle'
                    control={control}
                    label='Approval SO & PO Title'
                    placeholder='Finance Dept'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='city'
                    control={control}
                    label='City'
                    placeholder='Enter city'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='phoneNumber'
                    control={control}
                    label='Phone Number'
                    placeholder='Enter phone number'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInputText
                    name='ppn'
                    control={control}
                    label='PPN'
                    placeholder='10%'
                    errors={errors}
                    loading={loadingCompanyInfo}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormInputText
                    name='bank'
                    control={control}
                    label='Bank Information'
                    placeholder='Enter bank information'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormInputText
                    name='address'
                    control={control}
                    label='Address'
                    placeholder='Enter company address'
                    errors={errors}
                    loading={loadingCompanyInfo}
                    required
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormFileUpload
                    name='logo'
                    control={control}
                    label='Company Logo'
                    accept='image/*'
                    currentImageUrl={companyData?.logoUrl}
                    errors={errors}
                    loading={loadingUpdateCompanyInfo}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <FormActionBar
            onCancel={() => router.back()}
            loading={loadingUpdateCompanyInfo}
            submitLabel='Submit'
            cancelLabel='Cancel'
            loadingLabel='Submitting...'
          />
        </Grid>
      </Grid>
    </form>
  )
}
