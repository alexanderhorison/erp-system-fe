import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailDeliveryOrder } from 'src/store/apps/delivery-order'

export default function DetailDeliveryOrder({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const { detailDeliveryOrder: data } = useSelector(state => state.deliveryOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailDeliveryOrder(id))
    }
  }, [id, dispatch])
  const jsonString = JSON.stringify(data || '', null, 2)

  return (
    <>
      INI DATANYA tinggal disesuaikan sama kebutuhan BE & FE
      <br/>
      {JSON.stringify(jsonString)}
    </>
  )
}
