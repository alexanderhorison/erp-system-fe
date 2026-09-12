import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalDeleteConfirmed, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = "Liabilitas Jangka Panjang";

// GET ALL Liabilitas Jangka Panjang
export const fetchAllLongTerm = createAsyncThunk('longTerm/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/liabilities/long-term/all',
      params,
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL LIABILITAS JANGKA PANJANG
export const fetchLongTermDetail = createAsyncThunk(
  'longTerm/fetchLongTermDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/liabilities/long-term/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD LIABILITAS JANGKA PANJANG
export const addLongTerm = createAsyncThunk(
  'longTerm/addLongTerm',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/liabilities/long-term',
        data
      })
      swalSuccess({ label, name: `${label}`, response })
      dispatch(fetchAllLongTerm())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const editLongTerm = createAsyncThunk(
  'longTerm/editLongTerm',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/liabilities/long-term/' + id,
        data: data
      })
      swalSuccess({ label, name: `${label}`, response })
      dispatch(fetchAllLongTerm())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE LIABILITAS JANGKA PANJANG
export const deleteLongTerm = createAsyncThunk(
  'longTerm/deleteLongTerm',
  async ({ id, period }, { dispatch, rejectWithValue }) => {
    try {
      await swalDeleteConfirmed({
        label,
        name: period,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/liabilities/long-term/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchAllLongTerm())
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterLongTerm = createSlice({
  name: 'longTerm',
  initialState: {
    allLongTerm: [],
    loadingAllLongTerm: false,
    errorAllLongTerm: null,

    detailLongTerm: {},
    loadingDetailLongTerm: false,
    errorDetailLongTerm: null,

    piutangUsaha: 0,
    loadingPiutangUsaha: false,
    errorPiutangUsaha: null,

    loadingAction: false,
    errorAction: null,

    loadingDelete: false,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllLongTerm.pending, (state, action) => {
        state.loadingAllLongTerm = true
      })
      .addCase(fetchAllLongTerm.fulfilled, (state, action) => {
        state.allLongTerm = action.payload.data
        state.loadingAllLongTerm = false
      })
      .addCase(fetchAllLongTerm.rejected, (state, action) => {
        state.allLongTerm = []
        state.loadingAllLongTerm = false
        state.errorAllLongTerm = action.error.message
      })

      .addCase(fetchLongTermDetail.pending, (state, action) => {
        state.loadingDetailLongTerm = true
      })
      .addCase(fetchLongTermDetail.fulfilled, (state, action) => {
        state.detailLongTerm = action.payload.data
        state.loadingDetailLongTerm = false
      })
      .addCase(fetchLongTermDetail.rejected, (state, action) => {
        state.loadingDetailLongTerm = false
        state.detailLongTerm = null
        state.errorDetailLongTerm = action.error.message
      })

      .addCase(addLongTerm.pending, state => {
        state.loadingAction = true
      })
      .addCase(addLongTerm.fulfilled, state => {
        state.loadingAction = false
      })
      .addCase(addLongTerm.rejected, (state, action) => {
        state.loadingAction = false
        state.errorAction = action.error.message
      })

      .addCase(editLongTerm.pending, state => {
        state.loadingAction = true
      })
      .addCase(editLongTerm.fulfilled, state => {
        state.loadingAction = false
      })
      .addCase(editLongTerm.rejected, (state, action) => {
        state.loadingAction = false
        state.errorAction = action.error.message
      })

      .addCase(deleteLongTerm.pending, state => {
        state.loadingDelete = true
      })
      .addCase(deleteLongTerm.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(deleteLongTerm.rejected, state => {
        state.loadingDelete = false
      })
  }
})

export default appMasterLongTerm.reducer
