import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'shift'

// GET ALL SHIFT
export const fetchMasterDataShift = createAsyncThunk('appMasterShift/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/master/shift/all'
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL SHIFT
export const fetchMasterDataShiftDetail = createAsyncThunk(
  'appMasterShift/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/shift/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD SHIFT
export const addMasterDataShift = createAsyncThunk(
  'appMasterShift/addShift',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/shift/create',
        headers: {},
        data
      })
      swalSuccess({ label, name: 'Shift', response })
      dispatch(fetchMasterDataShift())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT SHIFT
export const editMasterDataShift = createAsyncThunk(
  'appMasterShift/editShift',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/shift/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Shift', response })
      dispatch(fetchMasterDataShift())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE SHIFT
export const deleteMasterDataShift = createAsyncThunk(
  'appShift/deleteShift',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/shift/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataShift())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER SHIFT
export const appMasterShiftSlice = createSlice({
  name: 'appMasterShift',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      startShift: '',
      endShift: ''
    },
    defaultValue: {
      id: '',
      name: '',
      startShift: '',
      endShift: ''
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
      .addCase(fetchMasterDataShift.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataShift.fulfilled, (state, action) => {
        // Format time data to HH:MM format
        const formattedData = action.payload.data?.map(item => ({
          ...item,
          startShift: item.startShift ? item.startShift.substring(0, 5) : '',
          endShift: item.endShift ? item.endShift.substring(0, 5) : ''
        })) || []
        state.data = formattedData
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataShift.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataShiftDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataShiftDetail.fulfilled, (state, action) => {
        // Format time data to HH:MM format
        const formattedDetail = {
          ...action.payload.data,
          startShift: action.payload.data.startShift ? action.payload.data.startShift.substring(0, 5) : '',
          endShift: action.payload.data.endShift ? action.payload.data.endShift.substring(0, 5) : ''
        }
        state.detail = formattedDetail
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataShiftDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })

      .addCase(addMasterDataShift.pending, (state, action) => {
        state.loadingAdd = true
      })
      .addCase(addMasterDataShift.fulfilled, (state, action) => {
        state.loadingAdd = false
      })
      .addCase(addMasterDataShift.rejected, (state, action) => {
        state.loadingAdd = false
        state.errorAdd = action.error.message
      })

      .addCase(editMasterDataShift.pending, (state, action) => {
        state.loadingEdit = true
      })
      .addCase(editMasterDataShift.fulfilled, (state, action) => {
        state.loadingEdit = false
      })
      .addCase(editMasterDataShift.rejected, (state, action) => {
        state.loadingEdit = false
        state.errorEdit = action.error.message
      })

      .addCase(deleteMasterDataShift.pending, (state, action) => {
        state.loadingDelete = true
      })
      .addCase(deleteMasterDataShift.fulfilled, (state, action) => {
        state.loadingDelete = false
      })
      .addCase(deleteMasterDataShift.rejected, (state, action) => {
        state.loadingDelete = false
        state.errorDelete = action.error.message
      })
  }
})

export default appMasterShiftSlice.reducer
