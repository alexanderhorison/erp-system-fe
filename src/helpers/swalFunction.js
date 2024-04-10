import swal from 'src/pages/sweetalert'

// ONLY FOR DELETE
export async function swalConfirmationDelete({ label, name = 'Data', axiosRequest, dispatchRequest, title }) {
  try {
    const result = await swal.fire({
      title: title ? title : `Yakin menghapus ${label} "${name}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      reverseButtons: true
    })
    if (result.dismiss === swal.DismissReason.cancel) {
      swal.fire({
        title: `"${name}" batal dihapus`,
        icon: 'error',
        showConfirmButton: false,
        timer: 2000
      })
    } else {
      const response = await axiosRequest()
      if (dispatchRequest) {
        dispatchRequest()
      }
      swal.fire({
        title: response?.data?.message || `"${name}" berhasil dihapus`,
        icon: 'success'
      })
    }
  } catch (error) {
    swalError({ error, label })
    throw error
  }
}

// DEFAULT SWAL SUCCESS
export function swalSuccess({ name, response }) {
  return swal.fire({
    title: response?.data?.message || `"${name}" berhasil dihapus`,
    icon: 'success'
  })
}

// DEFAULT SWAL ERROR
export function swalError({ error, label }) {
  return swal.fire({
    icon: 'error',
    title: error?.response?.data?.message || `Gagal melakukan aksi pada ${label}`,
    timer: 2000
  })
}

// DEFAULT SWAL TOAST ERROR
export function swalToastError({ error, label }) {
  return swal.fire({
    toast: true,
    icon: 'error',
    title: error?.response?.data?.message || `Gagal database ${label}`,
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener('mouseenter', swal.stopTimer)
      toast.addEventListener('mouseleave', swal.resumeTimer)
    }
  })
}
