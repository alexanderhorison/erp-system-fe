import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = "Liabilitas Jangka Pendek";

// GET ALL LIABILITAS JANGKA PENDEK
export const fetchAllShortTerm = createAsyncThunk('shortTerm/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/liabilities/short-term/all',
      params,
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL LIABILITAS JANGKA PENDEK
export const fetchShortTermDetail = createAsyncThunk(
  'shortTerm/fetchShortTermDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/liabilities/short-term/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD LIABILITAS JANGKA PENDEK
export const addShortTerm = createAsyncThunk(
  'shortTerm/addShortTerm',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/liabilities/short-term',
        data
      })
      swalSuccess({ label, name: `${label}`, response })
      dispatch(fetchAllShortTerm())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const editShortTerm = createAsyncThunk(
  'shortTerm/editShortTerm',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/liabilities/short-term/' + id,
        data: data
      })
      swalSuccess({ label, name: `${label}`, response })
      dispatch(fetchAllShortTerm())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE LIABILITAS JANGKA PANJANG
export const deleteShortTerm = createAsyncThunk(
  'shortTerm/deleteShortTerm',
  async ({ id, period }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name: period,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/liabilities/short-term/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchAllShortTerm())
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterShortTerm = createSlice({
  name: 'shortTerm',
  initialState: {
    allShortTerm: [],
    loadingAllShortTerm: false,
    errorAllShortTerm: null,

    detailShortTerm: {},
    loadingDetailShortTerm: false,
    errorDetailShortTerm: null,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllShortTerm.pending, (state, action) => {
        state.loadingAllShortTerm = true
      })
      .addCase(fetchAllShortTerm.fulfilled, (state, action) => {
        state.allShortTerm = action.payload.data
        state.loadingAllShortTerm = false
      })
      .addCase(fetchAllShortTerm.rejected, (state, action) => {
        state.allShortTerm = []
        state.loadingAllShortTerm = false
        state.errorAllShortTerm = action.error.message
      })

      .addCase(fetchShortTermDetail.pending, (state, action) => {
        state.loadingDetailShortTerm = true
      })
      .addCase(fetchShortTermDetail.fulfilled, (state, action) => {
        state.detailShortTerm = action.payload.data
        state.loadingDetailShortTerm = false
      })
      .addCase(fetchShortTermDetail.rejected, (state, action) => {
        state.loadingDetailShortTerm = false
        state.detailShortTerm = null
        state.errorDetailShortTerm = action.error.message
      })

  }
})

export default appMasterShortTerm.reducer
