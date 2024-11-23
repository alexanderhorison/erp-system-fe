import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'

import {
  swalConfirmationRestore,
  swalToastError
} from 'src/helpers/swalFunction'

const label = 'produk terhapus'

// GET ALL LIST DELETED PRODUCT WAREHOUSE
export const fetchListDeletedProductWarehouse = createAsyncThunk(
  'appDeletedProduct/fetchListDeletedProductWarehouse',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/deleted',
        params: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return error
    }
  }
)

// RESTORE DELETED PRODUCT
export const restoreDeletedProduct = createAsyncThunk(
  'appDeletedProduct/fetchRestoreDeletedProduct',
  async ({ query, id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationRestore({
        label: "Produk Terhapus",
        title: `Anda akan mengembalikan produk ${name}?`,
        name: name,
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/product-warehouse/restore/' + id,
          })
        },
        dispatchRequest: () => {
          dispatch(fetchListDeletedProductWarehouse({ query }))
        }
      })
      return true
    } catch (error) {
      swalToastError({ label, error })
      return error
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'appDeletedProduct',
  initialState: {
    dataListDeletedProduct: [],
    loadingListDeletedProduct: false,
    errorListDeletedProduct: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListDeletedProductWarehouse.fulfilled, (state, action) => {
        state.dataListDeletedProduct = action.payload
        state.loadingListDeletedProduct = false
      })
      .addCase(fetchListDeletedProductWarehouse.pending, (state, action) => {
        state.loadingListDeletedProduct = true
      })
      .addCase(fetchListDeletedProductWarehouse.rejected, (state, action) => {
        state.loadingListDeletedProduct = false
        state.errorListDeletedProduct = true
      })
  }
})



export default appMasterProductSlice.reducer