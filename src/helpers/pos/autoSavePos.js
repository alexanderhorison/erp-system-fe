export const autoSavePos = () => {
  const billId = JSON.parse(localStorage.getItem('billId'))
  const listProduct = JSON.parse(localStorage.getItem('listProductPos')) || []
  const selectedCustomer = JSON.parse(localStorage.getItem('selectedCustomerPos'))
  const selectedWarehouse = JSON.parse(localStorage.getItem('warehousePos'))
  const listOpenBIll = JSON.parse(localStorage.getItem('openBill')) || []

  const subTotalPrices = () => listProduct.reduce((total, item) => total + item.subTotal, 0)
  const totalItem = () => listProduct.reduce((total, item) => total + +item.quantity, 0)

  const newBill = [...listOpenBIll] // Salin data lama
  const index = listOpenBIll.findIndex(bill => bill.id === billId)
  if (index !== -1) {
    newBill[index] = { // Update data yang sudah ada
      id: billId,
      customer: selectedCustomer,
      products: listProduct,
      warehouse: selectedWarehouse,
      subTotalPrice: subTotalPrices(),
      totalItem: totalItem()
    }
  } else {
    newBill.push({ // Tambahkan data baru jika tidak ditemukan
      id: billId, // Pastikan ada ID unik jika belum ada
      customer: selectedCustomer,
      products: listProduct,
      warehouse: selectedWarehouse,
      subTotalPrice: subTotalPrices(),
      totalItem: totalItem()
    })
  }
  localStorage.setItem('openBill', JSON.stringify(newBill))
}


export const generateIdOpenBill = () => {
  const timestamp = Date.now()
  return `BILL-${timestamp}`
}