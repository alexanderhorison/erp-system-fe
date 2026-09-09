import { useRouter } from 'next/router'
import RoleForm from 'src/views/settings/roles/RoleForm'

export default function EditRole() {
  const router = useRouter()
  const id = router.query.id

  return <RoleForm mode='EDIT' id={id} />
}
