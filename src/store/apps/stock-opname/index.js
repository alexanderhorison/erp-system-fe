import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalConfirmationDelete,
  swalError,
  swalSuccess,
  swalToastError
} from 'src/helpers/swalFunction'

const label = 'stock opname'

// GET ALL LIST STOCK OPNAME
export const fetchListStockOpname = createAsyncThunk(
  'appListStockOpname/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/stock-opname',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL STOCK OPNAME
export const fetchDetailStockOpname = createAsyncThunk(
  'appDetailStockOpname/fetchData',
  async (stockOpnameId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/stock-opname/detail/' + stockOpnameId
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// CREATE STOCK OPNAME
export const createStockOpname = createAsyncThunk(
  'appStockOpname/createStockOpname',
  async ({ sendData, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Stock Opname',
        title: 'Anda akan membuat Stock Opname?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/stock-opname/create',
            data: sendData
          })
        },
        dispatchRequest: () => {
          router.push('/stock-opname')
          dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// UPDATE STOCK OPNAME
export const updateStockOpname = createAsyncThunk(
  'appStockOpname/updateStockOpname',
  async ({ id, sendData, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Stock Opname',
        title: 'Anda akan merubah Stock Opname?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/stock-opname/' + id,
            data: sendData
          })
        },
        dispatchRequest: () => {
          router.push('/stock-opname')
          dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// DELETE STOCK OPNAME
export const deleteStockOpname = createAsyncThunk(
  'appStockOpname/deleteStockOpname',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/stock-opname/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// UPDATE STATUS STOCK OPNAME
export const updateStatusStockOpname = createAsyncThunk(
  'appStockOpname/updateStatusStockOpname',
  async ({ stockOpnameId, status, router }, { dispatch, rejectWithValue }) => {
    try {

      const response = await swalConfirmationAdd({
        label,
        name: 'Stock Opname',
        title: `Anda akan ${status} Stock Opname?`,
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: `/stock-opname/${status}/` + stockOpnameId,
          })
        },
        dispatchRequest: () => {
          router.push('/stock-opname')
          dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// REDUCER STOCK OPNAME
export const appStockOpnameSlice = createSlice({
  name: 'appStockOpname',
  initialState: {
    listData: [],
    detailStockOpname: {
      listProduct: [],
    },
    loading: false,
    error: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListStockOpname.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchListStockOpname.fulfilled, (state, action) => {
        state.listData = action.payload.data
        state.loading = false
      })
      .addCase(fetchListStockOpname.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchDetailStockOpname.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchDetailStockOpname.fulfilled, (state, action) => {
        state.detailStockOpname = action.payload.data
        state.loading = false
      })
      .addCase(fetchDetailStockOpname.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export default appStockOpnameSlice.reducer
