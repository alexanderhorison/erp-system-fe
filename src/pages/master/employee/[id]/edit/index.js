import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import { fetchMasterDataEmployeeDetail } from 'src/store/apps/master/employee'
import EmployeeForm from 'src/views/master/employee/EmployeeForm'

export default function EditMasterEmployee() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataEmployeeDetail(id))
    }
  }, [id, dispatch])

  return <EmployeeForm mode='EDIT' id={id} />
}
