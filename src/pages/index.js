import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { UseAuth } from 'src/hooks/useAuth'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = UseAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home') // Jika sudah login, pindah ke /home
    } else {
      router.replace('/login') // Jika belum login, pindah ke /login
    }
  }, [isAuthenticated])

  return <p>Redirecting...</p> // Tambahkan elemen untuk mencegah halaman kosong
}
