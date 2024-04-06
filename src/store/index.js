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
import masterProduct from './apps/master/product'
import menu from 'src/store/apps/menu'
import unit from './apps/master/unit'
import warehouse from './apps/master/warehouse'
//import store from './src/store'; // Use relative path //


export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    role,
    category,
    type,
    unit,
    warehouse,
    masterProduct,
    menu
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
