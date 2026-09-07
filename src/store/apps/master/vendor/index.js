import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalDeleteConfirmed, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'vendor'

// GET ALL VENDOR
export const fetchMasterDataVendor = createAsyncThunk(
  'appMasterVendor/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/vendor/all'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL VENDOR
export const fetchMasterDataVendorDetail = createAsyncThunk(
  'appMasterVendor/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/vendor/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD VENDOR
export const addMasterDataVendor = createAsyncThunk(
  'appMasterVendor/addVendor',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/vendor/create',
        data
      })
      swalSuccess({ label, name: 'Vendor', response })
      setOpen(false)
      dispatch(fetchMasterDataVendor())
      return
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT VENDOR
export const editMasterDataVendor = createAsyncThunk(
  'appMasterVendor/editVendor',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/vendor/' + id,
        data
      })
      swalSuccess({ label, name: 'Vendor', response })
      setOpen(false)
      dispatch(fetchMasterDataVendor())
      dispatch(fetchMasterDataVendorDetail(id))
      return
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE VENDOR
export const deleteMasterDataVendor = createAsyncThunk(
  'appVendor/deleteVendor',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalDeleteConfirmed({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/vendor/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataVendor())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER VENDOR
export const appMasterVendorSlice = createSlice({
  name: 'appMasterVendor',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      description: '',
      level: ''
    },
    defaultValue: {
      id: '',
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      gender: '',
      notes: '',
      description: '',
      level: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: [],

    loadingAdd: false,
    errorAdd: false,

    loadingEdit: false,
    errorEdit: false,

    loadingDelete: false,
    errorDelete: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataVendor.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataVendor.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataVendor.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataVendorDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataVendorDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataVendorDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })

      .addCase(addMasterDataVendor.pending, (state, action) => {
        state.loadingAdd = true
      })
      .addCase(addMasterDataVendor.fulfilled, (state, action) => {
        state.loadingAdd = false
      })
      .addCase(addMasterDataVendor.rejected, (state, action) => {
        state.loadingAdd = false
        state.errorAdd = action.error.message
      })

      .addCase(editMasterDataVendor.pending, (state, action) => {
        state.loadingEdit = true
      })
      .addCase(editMasterDataVendor.fulfilled, (state, action) => {
        state.loadingEdit = false
      })
      .addCase(editMasterDataVendor.rejected, (state, action) => {
        state.loadingEdit = false
        state.errorEdit = action.error.message
      })

      .addCase(deleteMasterDataVendor.pending, (state, action) => {
        state.loadingDelete = true
      })
      .addCase(deleteMasterDataVendor.fulfilled, (state, action) => {
        state.loadingDelete = false
      })
      .addCase(deleteMasterDataVendor.rejected, (state, action) => {
        state.loadingDelete = false
        state.errorDelete = action.error.message
      })
  }
})

export default appMasterVendorSlice.reducer
