import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import toast from 'react-hot-toast'
import { swalConfirmationAdd, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'produk'
// GET ALL WAREHOUSE
export const fetchListWarehouse = createAsyncThunk(
  'appProductWarehouse/fetchListWarehouse',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/warehouse'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchProductWarehouseDetail = createAsyncThunk(
  'appProductWarehouse/fetchProductWarehouseDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET ALL LIST PRODUCT AT 1 WAREHOUSE
export const fetchListProductByWarehouse = createAsyncThunk(
  'appProductWarehouse/fetchListProductByWarehouse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/warehouse/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// INITIATE PRODUCT
export const initiateProductWarehouse = createAsyncThunk(
  'appProductWarehouse/initiateProductWarehouse',
  async ({ data, warehouse, router }, { dispatch, rejectWithValue }) => {
    try {
      console.log(data)
      await swalConfirmationAdd({
        label: 'Produk',
        name: 'Produk',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/product-warehouse/create',
            data
          })
        },
        dispatchRequest: () => {
          router.push(`/product-warehouse/warehouse/${warehouse.id}`)
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// ADJUST PRODUCT
export const editProductWarehouse = createAsyncThunk(
  'appMasterProduct/editProduct',
  async ({ id, data, WarehouseId }, { dispatch, rejectWithValue }) => {
    try {
      console.log(id, data)
      const response = await axios({
        method: 'PUT',
        url: '/product-warehouse/' + id,
        data: data
      })
      dispatch(fetchListProductByWarehouse(WarehouseId))
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'appProductWarehouse',
  initialState: {
    dataListWarehouse: [],
    loadingListWarehouse: true,
    errorListWarehouse: false,

    dataListProductWarehouse: {},
    loadingListProductWarehouse: true,
    errorListProductWarehouse: false,

    detailProductWarehouse: {},
    loadingDetailProductWarehouse: true,
    errorDetailProductWarehouse: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListWarehouse.pending, (state, action) => {
        state.loadingListWarehouse = true
      })
      .addCase(fetchListWarehouse.fulfilled, (state, action) => {
        state.dataListWarehouse = action.payload.data
        state.loadingListWarehouse = false
      })
      .addCase(fetchListWarehouse.rejected, (state, action) => {
        state.loadingListWarehouse = false
        state.errorListWarehouse = action.error.message
        state.dataListWarehouse = []
      })

      .addCase(fetchListProductByWarehouse.pending, (state, action) => {
        state.loadingListProductWarehouse = true
      })
      .addCase(fetchListProductByWarehouse.fulfilled, (state, action) => {
        state.dataListProductWarehouse = action.payload.data
        state.loadingListProductWarehouse = false
      })
      .addCase(fetchListProductByWarehouse.rejected, (state, action) => {
        state.loadingListProductWarehouse = false
        state.errorListProductWarehouse = action.error.message
        state.dataListProductWarehouse = {}
      })

      .addCase(fetchProductWarehouseDetail.pending, (state, action) => {
        state.loadingDetailProductWarehouse = true
      })
      .addCase(fetchProductWarehouseDetail.fulfilled, (state, action) => {
        state.detailProductWarehouse = action.payload.data
        state.loadingDetailProductWarehouse = false
      })
      .addCase(fetchProductWarehouseDetail.rejected, (state, action) => {
        state.loadingDetailProductWarehouse = false
        state.errorDetailProductWarehouse = action.error.message
        state.detailProductWarehouse = {}
      })
  }
})

export default appMasterProductSlice.reducer
