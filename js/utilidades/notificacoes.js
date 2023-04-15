import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const notificacaoErro = msg => Toast.fire({ icon: 'error', title: msg ? msg : 'Houve um erro, tente novamente mais tarde...' })
