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
      reverseButtons: true,
      confirmButtonColor: '#6F4E37'
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
        icon: 'success',
        confirmButtonColor: '#6F4E37'
      })
    }
  } catch (error) {
    swalError({ error, label })
    throw error
  }
}

// ONLY FOR ADD
export async function swalConfirmationAdd({
  label,
  name = 'Data',
  axiosRequest,
  dispatchRequest,
  title,
  cancelAction,
  paymentSelection = false // NEW: optional flag
}) {
  try {
    const result = await swal.fire({
      title: title ? title : `Anda akan menambahkan produk?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      reverseButtons: true,
      confirmButtonColor: '#6F4E37',
      ...(paymentSelection && {
        // Use built-in input radio to avoid custom preConfirm issues
        input: 'radio',
        inputOptions: {
          NO_PAYMENT: 'Tanpa Pembayaran',
          FULL_PAYMENT: 'Pembayaran Lunas'
        },
        inputValue: 'NO_PAYMENT', // default selection
        // optional client-side validation
        inputValidator: value => {
          if (!value) return 'Silakan pilih Terms of Payment'
          return null
        },
        didOpen: () => {
        // Force vertical layout dynamically if you don't want external CSS
        const container = document.querySelector('.swal2-radio');
        if (container) {
          container.style.display = 'flex';
          container.style.flexDirection = 'column';
          container.style.alignItems = 'center';
          container.style.gap = '8px';
        }
      }
      })
    })
    if (result.dismiss) {
      cancelAction && cancelAction()
    } else {
      const response = paymentSelection ? await axiosRequest(result.value === 'FULL_PAYMENT') : await axiosRequest()

      if (dispatchRequest) {
        dispatchRequest()
      }
      swal.fire({
        title: response?.data?.message || `${name} berhasil ditambahkan`,
        icon: 'success',
        confirmButtonColor: '#6F4E37'
      })
      return response
    }
  } catch (error) {
    swalError({ error, label })
    throw error
  }
}

// ONLY FOR EDIT
export async function swalConfirmationEdit({
  label,
  name = 'Data',
  axiosRequest,
  dispatchRequest,
  title,
  cancelAction
}) {
  try {
    const result = await swal.fire({
      title: title ? title : `Anda akan merubah produk?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      reverseButtons: true,
      confirmButtonColor: '#6F4E37'
    })
    if (result.dismiss) {
      cancelAction && cancelAction()
    } else {
      const response = await axiosRequest()
      if (dispatchRequest) {
        dispatchRequest()
      }
      swal.fire({
        title: response?.data?.message || `${name} berhasil diubah`,
        icon: 'success',
        confirmButtonColor: '#6F4E37'
      })
      return response
    }
  } catch (error) {
    swalError({ error, label })
    throw error
  }
}

// ONLY FOR RESTORE
export async function swalConfirmationRestore({ label, name = 'Data', axiosRequest, dispatchRequest, title }) {
  try {
    const result = await swal.fire({
      title: title ? title : `Anda akan mengembalikan produk?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      reverseButtons: true,
      confirmButtonColor: '#6F4E37'
    })
    if (result.dismiss) {
    } else {
      const response = await axiosRequest()
      if (dispatchRequest) {
        dispatchRequest()
      }
      swal.fire({
        title: response?.data?.message || `${name} berhasil dikembalikan`,
        icon: 'success',
        confirmButtonColor: '#6F4E37'
      })
      return response
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
    icon: 'success',
    confirmButtonColor: '#6F4E37'
  })
}

// DEFAULT SWAL ERROR
export function swalError({ error, label }) {
  return swal.fire({
    icon: 'error',
    title: error?.response?.data?.message || `Gagal melakukan aksi pada ${label}`,
    // timer: 2000,
    confirmButtonColor: '#6F4E37'
  })
}

// DEFAULT SWAL TOAST ERROR
export function swalToastError({ error, label }) {
  return swal.fire({
    icon: 'error',
    title: error?.response?.data?.message || `Gagal melakukan aksi pada ${label}`,
    timer: 2000,
    confirmButtonColor: '#6F4E37'
  })
}

export function swalNotifSuccess({ message }) {
  return swal.fire({
    title: message || `berhasil`,
    icon: 'success',
    confirmButtonColor: '#6F4E37',
    timer: 1500
  })
}

export function swalNotifError({ message, timer = 1500 }) {
  return swal.fire({
    icon: 'error',
    title: message || `Gagal`,
    timer,
    confirmButtonColor: '#6F4E37'
  })
}

export function swalInfo(message) {
  return swal.fire({
    icon: 'info',
    title: message || `Email Telah Dikirim`,
    timer: 1000,
    confirmButtonColor: '#6F4E37'
  })
}

// export async function swalConfirmationAddPayment({
//   label,
//   name = 'Data',
//   axiosRequest,
//   dispatchRequest,
//   title,
//   cancelAction,
//   paymentSelection = false // NEW: optional flag
// }) {
//   try {
//     const result = await swal.fire({
//       title: title ? title : `Anda akan menambahkan produk?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Iya',
//       cancelButtonText: 'Tidak',
//       reverseButtons: true,
//       confirmButtonColor: '#6F4E37',
//       ...(paymentSelection && {
//         html: `
//           <div style="text-align: left">
//             <label><strong>Pilih Terms of Payment:</strong></label>
//             <div style="margin-top: 8px">
//               <label>
//                 <input type="radio" name="payment" value="NO_PAYMENT" checked />
//                 Tanpa Pembayaran
//               </label><br/>
//               <label>
//                 <input type="radio" name="payment" value="FULL_PAYMENT" />
//                 Pembayaran Lunas
//               </label>
//             </div>
//           </div>
//         `,
//         preConfirm: () => {
//           const selected = document.querySelector('input[name="payment"]:checked')?.value
//           if (!selected) {
//             swal.showValidationMessage('Silakan pilih Terms of Payment')
//             return false
//           }
//           return selected
//         }
//       })
//     })

//     if (result.dismiss) {
//       cancelAction && cancelAction()
//     } else {
//       // Pass paymentType if selection was enabled
//       const response = paymentSelection ? await axiosRequest(result.value) : await axiosRequest()

//       if (dispatchRequest) {
//         dispatchRequest(result.value)
//       }

//       swal.fire({
//         title: response?.data?.message || `${name} berhasil ditambahkan`,
//         icon: 'success',
//         confirmButtonColor: '#6F4E37'
//       })

//       return response
//     }
//   } catch (error) {
//     swalError({ error, label })
//     throw error
//   }
// }
