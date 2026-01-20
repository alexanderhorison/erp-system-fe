import swal from 'src/pages/sweetalert'
import { swalError } from './swalFunction'
import { environtmentColor } from 'src/helpers/getEnvirontmentColor'

// ONLY FOR ADD
export async function swalConfirmationChargePos({
  label,
  text,
  width = 300,
  name = 'Data',
  axiosRequest,
  dispatchRequest,
  title
}) {
  try {
    const result = await swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      reverseButtons: true,
      confirmButtonColor: environtmentColor(),
      width: width,
    })
    if (result.dismiss) {
    } else {
      // Show loading state
      swal.fire({
        title: 'Processing...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
          swal.showLoading()
        }
      })

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
  text,
  onClickYes = () => { },
  onClickNo = () => { },
  title,
  successMessage = 'Sukses',
  autoSuccess = true
}) {
  const result = await swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Iya',
    cancelButtonText: 'Tidak',
    reverseButtons: true,
    confirmButtonColor: environtmentColor(),
  });

  if (result.isConfirmed) {
    try {
      // show loading
      swal.fire({
        title: 'Processing...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
          swal.showLoading()
        }
      })

      // await caller's async operation
      await onClickYes()

      // close loading
      swal.close()

      // show success if caller didn't handle it
      if (autoSuccess) {
        await swal.fire({
          title: successMessage,
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      // close loading then show error modal so user knows what failed
      try { swal.close() } catch (e) { }
      const message = error?.response?.data?.message || error?.message || 'Terjadi kesalahan'
      try {
        await swal.fire({
          title: 'Error',
          text: message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } catch (e) { }
      throw error
    }
  } else if (result.dismiss === swal.DismissReason.cancel) {
    onClickNo();
  }
}
