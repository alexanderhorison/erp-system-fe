import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchListProductTransformation,
  fetchProductWarehouseDetail,
  transformProductFromPointOfSale
} from 'src/store/apps/product-warehouse'
import AppModal from 'src/views/common/AppModal'
import TransformationFields, { useTransformation } from 'src/views/common/TransformationFields'

export default function TransformProductPointOfSale({ open, setOpen, transformationData, setSelectedProductPos }) {
  const dispatch = useDispatch()

  const [formulaError, setFormulaError] = useState('')

  const { detailProductWarehouse, listTransformation } = useSelector(state => state.productWarehouse)

  // ** The quantity is the cart line's, so it is shown but not editable here.
  const { formula, selectFormula, qty, result } = useTransformation({
    formulas: listTransformation,
    product: detailProductWarehouse,
    initialQty: transformationData?.qty
  })

  useEffect(() => {
    dispatch(fetchProductWarehouseDetail(transformationData?.id))
    dispatch(fetchListProductTransformation(transformationData?.id))
  }, [transformationData?.id])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = event => {
    event?.preventDefault()

    if (!formula) {
      setFormulaError('Rumus harus dipilih')

      return
    }
    if (result.error) return

    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
    const sendData = {
      masterTransformationId: formula.id,
      productWarehouseId: detailProductWarehouse.id,
      qtyTransformation: Number(qty),
      warehouseRackId: detailProductWarehouse.warehouseRackId,
      productId: transformationData.productId,
      warehouseId: warehouse?.warehouseId
    }
    dispatch(transformProductFromPointOfSale(sendData))
    setSelectedProductPos(null)
    handleClose()
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={onSubmit}
      title='Transformasi Produk'
      size='sm'
      showActions
      submitDisabled={Boolean(formula) && Boolean(result.error)}
    >
      <TransformationFields
        product={detailProductWarehouse}
        formulas={listTransformation}
        formula={formula}
        onSelectFormula={item => {
          setFormulaError('')
          selectFormula(item)
        }}
        qty={qty}
        onQtyChange={() => {}}
        qtyReadOnly
        result={result}
        rowLabel='POS'
        priceKey='targetBasePricePos'
        formulaError={formulaError}
      />
    </AppModal>
  )
}
