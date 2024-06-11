import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'company'

// GET ALL COMPANY
export const fetchMasterDataCompany = createAsyncThunk('appMasterCompany/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/master/company/all'
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL COMPANY
export const fetchMasterDataCompanyDetail = createAsyncThunk(
  'appMasterCompany/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/company/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD COMPANY
export const addMasterDataCompany = createAsyncThunk(
  'appMasterCompany/addCompany',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/company/create',
        headers: {},
        data
      })
      swalSuccess({ label, name: 'Company', response })
      dispatch(fetchMasterDataCompany())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT COMPANY
export const editMasterDataCompany = createAsyncThunk(
  'appMasterCompany/editCompany',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/company/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Company', response })
      dispatch(fetchMasterDataCompany())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE COMPANY
export const deleteMasterDataCompany = createAsyncThunk(
  'appCompany/deleteCompany',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/company/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataCompany())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER COMPANY
export const appMasterCompanySlice = createSlice({
  name: 'appMasterCompany',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      description: ''
    },
    defaultValue: {
      id: '',
      name: '',
      description: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataCompany.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataCompany.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataCompanyDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataCompanyDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataCompanyDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterCompanySlice.reducer
