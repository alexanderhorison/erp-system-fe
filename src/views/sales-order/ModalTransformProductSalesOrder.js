import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchListProductTransformation,
  fetchProductWarehouseDetail,
  transformProductFromSalesOrder
} from 'src/store/apps/product-warehouse'
import AppModal from 'src/views/common/AppModal'
import TransformationFields, { useTransformation } from 'src/views/common/TransformationFields'

export default function ModalTransformProductSalesOrder({
  open,
  setOpen,
  warehouseProductId,
  quantity,
  setValue,
  getValues,
  indexForm,
  update,
  listProduct,
  warehouseId,
  handleTransformProductUpdate,
  setDataWarehouseIds,
  rowLabel = 'SO'
}) {
  const dispatch = useDispatch()

  const [formulaError, setFormulaError] = useState('')

  const { detailProductWarehouse, listTransformation } = useSelector(state => state.productWarehouse)

  const { formula, selectFormula, qty, changeQty, result } = useTransformation({
    formulas: listTransformation,
    product: detailProductWarehouse,
    initialQty: quantity
  })

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    dispatch(fetchProductWarehouseDetail(warehouseProductId))
    dispatch(fetchListProductTransformation(warehouseProductId))
  }, [warehouseProductId])

  // ON SUBMIT
  const onSubmit = event => {
    event?.preventDefault()

    if (!formula) {
      setFormulaError('Rumus harus dipilih')

      return
    }
    if (result.error) return

    const sendData = {
      masterTransformationId: formula.id,
      productWarehouseId: detailProductWarehouse.id,
      qtyTransformation: Number(qty),
      warehouseRackId: detailProductWarehouse.warehouseRackId
    }

    dispatch(
      transformProductFromSalesOrder({
        id: detailProductWarehouse.id,
        data: sendData,
        setOpen: setOpen,
        setValue: setValue,
        getValues: getValues,
        indexForm: indexForm,
        update: (i, row) => update(i, { ...row, quantity: result.to }),
        listProduct: listProduct,
        warehouseId: warehouseId,
        handleTransformProductUpdate: (...args) => {
          // hasil transformasi menjadi kuantiti di form
          setValue(`data[${indexForm}].quantity`, result.to)
          setValue(`data[${indexForm}].subTotal`, '')
          handleTransformProductUpdate(...args)
        },
        setDataWarehouseIds: setDataWarehouseIds
      })
    )
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
        onQtyChange={changeQty}
        result={result}
        rowLabel={rowLabel}
        formulaError={formulaError}
      />
    </AppModal>
  )
}
