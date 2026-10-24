// ** React Imports
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { transformProduct } from 'src/store/apps/product-warehouse'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import TransformationFields, { useTransformation } from 'src/views/common/TransformationFields'

export default function ModalTransformationProduct({ open, setOpen, typeModal, warehouseId }) {
  const dispatch = useDispatch()
  const [formulaError, setFormulaError] = useState('')

  const { detailProductWarehouse, listTransformation, loadingListTransformation, loadingTransformProduct } =
    useSelector(state => state.productWarehouse)

  const { formula, selectFormula, qty, changeQty, result } = useTransformation({
    formulas: listTransformation,
    product: detailProductWarehouse
  })

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

    dispatch(
      transformProduct({
        id: detailProductWarehouse.id,
        data: {
          masterTransformationId: formula.id,
          productWarehouseId: detailProductWarehouse.id,
          qtyTransformation: Number(qty),
          warehouseRackId: detailProductWarehouse.warehouseRackId
        },
        warehouseId,
        setOpen
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
      showActions={typeModal !== 'VIEW'}
      loading={loadingTransformProduct}
      loadingPage={loadingListTransformation}
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
        formulaError={formulaError}
      />
    </AppModal>
  )
}
