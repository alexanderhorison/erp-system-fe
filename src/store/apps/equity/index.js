import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalConfirmationEdit,
  swalConfirmationDelete,
  swalToastError
} from 'src/helpers/swalFunction'

const label = 'Ekuitas'

// ** Fetch All Equity
export const fetchAllEquity = createAsyncThunk('equity/fetchAllEquity', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/equity/all',
      params
    })
    return response.data.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// ** Fetch Equity Detail
export const fetchEquityDetail = createAsyncThunk('equity/fetchEquityDetail', async (id, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/equity/' + id
    })
    return response.data.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue(error.response?.data || error.message)
  }
})

// ** Add Equity
export const addEquity = createAsyncThunk(
  'equity/addEquity',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Ekuitas',
        name: 'Ekuitas',
        title: 'Anda akan menambahkan data ekuitas?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/equity',
            data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchAllEquity())
          setOpen(false)
        }
      })
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ** Edit Equity
export const editEquity = createAsyncThunk(
  'equity/editEquity',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationEdit({
        label: 'Ekuitas',
        name: 'Ekuitas',
        title: 'Anda akan mengubah data ekuitas?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/equity/' + id,
            data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchAllEquity())
          setOpen(false)
        }
      })
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ** Delete Equity
export const deleteEquity = createAsyncThunk(
  'equity/deleteEquity',
  async ({ id, period }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name: period,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/equity/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchAllEquity())
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// ** Reset State
export const resetEquityState = createAsyncThunk('equity/resetEquityState', async () => {
  return {}
})

export const equitySlice = createSlice({
  name: 'equity',
  initialState: {
    allEquity: [],
    detailEquity: null,
    loading: false,
    loadingDetailEquity: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch All Equity
      .addCase(fetchAllEquity.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllEquity.fulfilled, (state, action) => {
        state.allEquity = action.payload
        state.loading = false
      })
      .addCase(fetchAllEquity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch Equity Detail
      .addCase(fetchEquityDetail.pending, state => {
        state.loadingDetailEquity = true
        state.error = null
      })
      .addCase(fetchEquityDetail.fulfilled, (state, action) => {
        state.detailEquity = action.payload
        state.loadingDetailEquity = false
      })
      .addCase(fetchEquityDetail.rejected, (state, action) => {
        state.loadingDetailEquity = false
        state.error = action.payload
      })

      // Add Equity
      .addCase(addEquity.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(addEquity.fulfilled, state => {
        state.loading = false
      })
      .addCase(addEquity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Edit Equity
      .addCase(editEquity.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(editEquity.fulfilled, state => {
        state.loading = false
      })
      .addCase(editEquity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete Equity
      .addCase(deleteEquity.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEquity.fulfilled, state => {
        state.loading = false
      })
      .addCase(deleteEquity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Reset State
      .addCase(resetEquityState.fulfilled, state => {
        state.detailEquity = null
        state.error = null
      })
  }
})

export default equitySlice.reducer
