import Swal from 'sweetalert2'

const swal = Swal.mixin({
  customClass: {
    container: 'my-swal-container'
  },
  allowOutsideClick: true
})

export default swal
