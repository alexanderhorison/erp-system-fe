import swal from 'src/pages/sweetalert'
import { swalError } from './swalFunction'

// ONLY FOR ADD
export async function swalConfirmationChargePos({ label, text, width = 300, name = 'Data', axiosRequest, dispatchRequest, title }) {
  try {
    const result = await swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      reverseButtons: true,
      confirmButtonColor: '#6F4E37',
      width: width,
    })
    if (result.dismiss) {
    } else {
      const response = await axiosRequest()
      if (dispatchRequest) {
        dispatchRequest(response)
      }
      swal.fire({
        title: response?.data?.message || `${name} berhasil ditambahkan`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    swalError({ error, label })
    throw error
  }
}

export async function swalConfirmationOnly({
  label,
  text,
  name = 'Data',
  onClickYes = () => { },
  onClickNo = () => { },
  title,
  successMessage = 'Sukses'
}) {
  const result = await swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Iya',
    cancelButtonText: 'Tidak',
    reverseButtons: true,
    confirmButtonColor: '#6F4E37',
  });

  if (result.isConfirmed) {
    onClickYes();
    swal.fire({
      title: successMessage,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    })
  } else if (result.dismiss === swal.DismissReason.cancel) {
    onClickNo();
  }
}
