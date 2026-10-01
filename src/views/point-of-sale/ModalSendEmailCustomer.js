import { useForm } from 'react-hook-form'
import FormInputText from '../common/Form/FormInputText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { sendEmailPos } from 'src/store/apps/pos'
import AppModal from 'src/views/common/AppModal'

export default function ModalSendEmailCustomer({ open, setOpen, customer, code }) {
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    email: yup.string().email().required('Email harus diisi')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: {
      email: customer?.email || ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = val => {
    // Send Email
    const formData = new FormData()
    formData.append('email', val.email)
    formData.append('module', 'Point of Sale')
    formData.append('filename', code)
    dispatch(sendEmailPos(formData))
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title='Email Receipt'
      size='xs'
      cancelLabel='Batal'
      submitLabel='Kirim Email'
      submitIcon='tabler:mail'
    >
      <FormInputText label={'Email'} name={'email'} control={control} errors={errors} placeholder='Masukkan Email' />
    </AppModal>
  )
}
