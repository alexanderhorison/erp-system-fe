import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'mobil'

// GET ALL CAR
export const fetchMasterDataCar = createAsyncThunk('appMasterCar/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/master/car/all',
      params,
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL CAR
export const fetchMasterDataCarDetail = createAsyncThunk(
  'appMasterCar/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/car/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD CAR
export const addMasterDataCar = createAsyncThunk(
  'appMasterCar/addCar',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/car/create',
        headers: {},
        data
      })
      swalSuccess({ label, name: 'Mobil', response })
      dispatch(fetchMasterDataCar())
      setOpen(false)
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT CAR
export const editMasterDataCar = createAsyncThunk(
  'appMasterCar/editCar',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/car/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Mobil', response })
      dispatch(fetchMasterDataCar())
      setOpen(false)
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// DELETE CAR
export const deleteMasterDataCar = createAsyncThunk(
  'appCar/deleteCar',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/car/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataCar())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER CAR
export const appMasterCarSlice = createSlice({
  name: 'appMasterCar',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      plate_number: '',
      description: '',
      is_active: true,
      emoneyBalance: 0
    },
    defaultValue: {
      id: '',
      name: '',
      plate_number: '',
      description: '',
      is_active: true,
      emoneyBalance: 0
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataCar.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataCar.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataCar.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataCarDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataCarDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataCarDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterCarSlice.reducer
