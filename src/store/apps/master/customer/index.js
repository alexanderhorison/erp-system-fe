import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalConfirmationDelete, swalError, swalToastError } from 'src/helpers/swalFunction'

const label = 'customer'

// GET ALL CUSTOMER
export const fetchMasterDataCustomer = createAsyncThunk(
  'appMasterCustomer/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      // by default isPosCustomer is false
      const newParams = {
        ...params,
        isPosCustomer: false
      }
      const response = await axios({
        method: 'GET',
        url: '/master/customer/all',
        params: newParams
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL CUSTOMER
export const fetchMasterDataCustomerDetail = createAsyncThunk(
  'appMasterCustomer/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/customer/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD CUSTOMER
export const addMasterDataCustomer = createAsyncThunk(
  'appMasterCustomer/addCustomer',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Customer',
        name: 'Customer',
        title: 'Anda akan menambahkan customer?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/master/customer/create',
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchMasterDataCustomer())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT CUSTOMER
export const editMasterDataCustomer = createAsyncThunk(
  'appMasterCustomer/editCustomer',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Customer',
        name: 'Customer',
        title: 'Anda akan mengubah customer?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/master/customer/' + id,
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchMasterDataCustomer())
          dispatch(fetchMasterDataCustomerDetail(id))
        }
      })
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE CUSTOMER
export const deleteMasterDataCustomer = createAsyncThunk(
  'appCustomer/deleteCustomer',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/customer/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataCustomer())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER CUSTOMER
export const appMasterCustomerSlice = createSlice({
  name: 'appMasterCustomer',
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
      description: '',
      level: '',
      gender: 'Laki-laki'
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataCustomer.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataCustomer.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataCustomerDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataCustomerDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataCustomerDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterCustomerSlice.reducer
