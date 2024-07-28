import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Warehouse Rack'

// GET ALL MASTER WAREHOUSE RACK
export const fetchMasterDataWarehouseRack = createAsyncThunk(
  'appMasterWarehouseRack/fetchData',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/warehouse/warehouse-rack/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL WAREHOUSE RACK
export const fetchMasterDataWarehouseRackDetail = createAsyncThunk(
  'appMasterWarehouseRack/fetchDataDetal',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/warehouse/warehouse-rack/detail/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD WAREHOUSE RACK
export const addMasterDataWarehouseRack = createAsyncThunk(
  'appMasterWarehouseRack/addWarehouseRack',
  async ({ data, warehouseId, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/master/warehouse/warehouse-rack/create',
        data
      })
      swalSuccess({ label, name: 'Warehouse Rack', response })
      dispatch(fetchMasterDataWarehouseRack(warehouseId))
      router.push(`/master/warehouses/${warehouseId}/warehouse-rack`)
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT WAREHOUSE RACK
export const editMasterDataWarehouseRack = createAsyncThunk(
  'appMasterWarehouseRack/editWarehouseRack',
  async ({ data, warehouseId, router, id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/warehouse/warehouse-rack/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Warehouse Rack', response })
      dispatch(fetchMasterDataWarehouseRack(warehouseId))
      router.push(`/master/warehouses/${warehouseId}/warehouse-rack`)
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE WAREHOUSE RACK
export const deleteMasterDataWarehouseRack = createAsyncThunk(
  'appMasterWarehouseRack/deleteWarehouseRack',
  async ({ id, name, warehouseId }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/warehouse/warehouse-rack/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataWarehouseRack(warehouseId))
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER TRANSFORMATION
export const appMasterWarehouseRackSlice = createSlice({
  name: 'appMasterWarehouseRack',
  initialState: {
    data: [],
    loading: false,
    error: false,
    defaultValue: {
      name: '',
      description: '',
      data: [{ key: '', value: '' }],
      warehouseId: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: [],
    keyAttributes: [
      {
        id: 1,
        key: 'PRODUCTION DATE',
        name: 'PRODUCTION DATE'
      },
      {
        id: 2,
        key: 'EXPIRED DATE',
        name: 'EXPIRED DATE'
      },
      {
        id: 3,
        key: 'TYPE',
        name: 'TYPE'
      },
      {
        id: 4,
        key: 'CATEGORY',
        name: 'CATEGORY'
      },
      {
        id: 5,
        key: 'COMPANY',
        name: 'COMPANY'
      },
      {
        id: 6,
        key: 'UNIT',
        name: 'UNIT'
      }
    ]
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataWarehouseRack.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataWarehouseRack.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.total = action.payload.total
      })
      .addCase(fetchMasterDataWarehouseRack.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataWarehouseRackDetail.pending, (state, action) => {
        state.loadingDetail = true
        state.detail = {}
      })
      .addCase(fetchMasterDataWarehouseRackDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
      })
      .addCase(fetchMasterDataWarehouseRackDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
      .addCase(editMasterDataWarehouseRack.fulfilled, (state, action) => {
        state.detail = {}
      })
  }
})

export default appMasterWarehouseRackSlice.reducer
