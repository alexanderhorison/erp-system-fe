// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import role from 'src/store/apps/role'
import category from './apps/master/category'
import type from './apps/master/type'
import company from './apps/master/company'
import masterProduct from './apps/master/product'
import menu from 'src/store/apps/menu'
import unit from './apps/master/unit'
import masterProductPrice from './apps/master/product-price'
import warehouse from './apps/master/warehouse'
import productWarehouse from './apps/product-warehouse/'
import deliveryOrder from './apps/delivery-order'
import receiveOrder from './apps/receive-order'
import masterTransformation from './apps/master/transformation'
import stockOpname from './apps/stock-opname'
//import store from './src/store'; // Use relative path //
import masterWarehouseRack from './apps/master/warehouse-rack'
import adjustmentGoodsOut from './apps/adjustment/goods-out'
import adjustmentGoodsIn from './apps/adjustment/goods-in'
import internalTransfer from './apps/internal-transfer'
import deliveryOrderReceiptOutstanding from './apps/receipt-order-outstanding'
import masterCustomer from './apps/master/customer'
import masterRank from './apps/master/rank'
import dashboard from './apps/dashboard'
import salesOrder from './apps/sales-order'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    role,
    category,
    company,
    type,
    unit,
    warehouse,
    masterProduct,
    productWarehouse,
    deliveryOrder,
    menu,
    receiveOrder,
    masterTransformation,
    masterWarehouseRack,
    stockOpname,
    adjustmentGoodsOut,
    adjustmentGoodsIn,
    internalTransfer,
    deliveryOrderReceiptOutstanding,
    masterCustomer,
    masterRank,
    dashboard,
    salesOrder,
    masterProductPrice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
