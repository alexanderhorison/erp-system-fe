import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import toast from 'react-hot-toast'
import { swalToastError } from 'src/helpers/swalFunction'
const label = "produk"
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
      return rejectWithValue({})
    }
  }
)

// INITIATE PRODUCT
export const initiateProductWarehouse = createAsyncThunk(
  'appProductWarehouse/initiateProductWarehouse',
  async ({ data, WarehouseId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/product-warehouse/create',
        headers: {},
        data
      })
      dispatch(fetchListProductByWarehouse(WarehouseId))
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// ADJUST PRODUCT
export const editMasterDataPorduct = createAsyncThunk(
  'appMasterProduct/editProduct',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/product/' + id,
        data: data
      })
      dispatch(fetchMasterDataProduct())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
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
    errorListProductWarehouse: false
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
  }
})

export default appMasterProductSlice.reducer
