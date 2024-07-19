import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'transformation'

// GET ALL MASTER TRANSFORMATION
export const fetchMasterDataTransformation = createAsyncThunk(
  'appMasterTransformation/fetchData',
  async (id, { rejectWithValue }) => {
    try {
      console.log(id)
      const response = await axios({
        method: 'GET',
        url: '/master/product/transformation/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL TRANSFORMASI
export const fetchMasterDataTransformationDetail = createAsyncThunk(
  'appMasterTransformation/fetchDataDetal',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/product/transformation/detail/' + id
      })
      console.log(response.data)
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD Transformation
export const addMasterDataTransformation = createAsyncThunk(
  'appMasterTransformation/addTransformation',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/master/product/transformation/create',
        data
      })
      swalSuccess({ label, name: 'Transformasi', response })
      dispatch(fetchMasterDataTransformation(data.masterProductId))
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const editMasterDataTransformation = createAsyncThunk(
  'appMasterTransformation/editTransformation',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/product/transformation/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Transformasi', response })
      dispatch(fetchMasterDataTransformation(data.masterProductId))
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE PRODUCT
export const deleteMasterDataTransformation = createAsyncThunk(
  'appMasterTransformation/deleteTransformation',
  async ({ id, name, productId }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/product/transformation/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataTransformation(productId))
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER TRANSFORMATION
export const appMasterTransformationSlice = createSlice({
  name: 'appMasterTransformation',
  initialState: {
    data: [],
    loading: false,
    error: false,
    defaultValue: {
      unitFromId: '',
      unitToId: '',
      amountTo: ''
    },
    detail: {
      unitFromId: '',
      unitToId: '',
      amountTo: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataTransformation.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataTransformation.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.total = action.payload.total
      })
      .addCase(fetchMasterDataTransformation.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataTransformationDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataTransformationDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
      })
      .addCase(fetchMasterDataTransformationDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
        state.defaultValue = {
          unitFromId: '',
          unitToId: '',
          amountTo: ''
        }
      })
  }
})

export default appMasterTransformationSlice.reducer
