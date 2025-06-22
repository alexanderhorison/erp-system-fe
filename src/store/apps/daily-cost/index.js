import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalConfirmationDelete,
  swalConfirmationEdit,
  swalToastError
} from 'src/helpers/swalFunction'

const label = 'Daily Cost'

// GET ALL DAILY COST
export const fetchAllDailyCost = createAsyncThunk(
  'dailyCost/fetchAllDailyCost',
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/daily-cost/by-date',
        params: {
          date
        }
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL DAILY COST BY DATE
export const fetchDetailDailyCostByDate = createAsyncThunk(
  'dailyCost/fetchDetailDailyCostByDate',
  async ({ date }, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/daily-cost/detail/' + date
      })
      return data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// ADD DAILY COST
export const addDailyCost = createAsyncThunk(
  'dailyCost/addDailyCost',
  async ({ data, setIsSubmitting, router }, { rejectWithValue, dispatch }) => {
    try {
      await swalConfirmationAdd({
        label: 'Daily Cost',
        title: 'Anda akan membuat daily cost?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/daily-cost/create',
            data
          })
        },
        dispatchRequest: () => {
          setIsSubmitting(false)
          router.push('/daily-cost-calendar')
        },
        cancelAction: () => {
          setIsSubmitting(false)
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// DELETE DAILY COST
export const deleteDailyCost = createAsyncThunk(
  'dailyCost/deleteDailyCost',
  async ({ date }, { rejectWithValue, dispatch }) => {
    try {
      await swalConfirmationDelete({
        label,
        name: 'Daily Cost ' + date,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/daily-cost/' + date
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchAllDailyCost({ date }))
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE DAILY COST
export const updateDailyCost = createAsyncThunk(
  'dailyCost/updateDailyCost',
  async ({ data, date, setIsSubmitting, router }, { rejectWithValue, dispatch }) => {
    try {
      await swalConfirmationEdit({
        label: 'Daily Cost',
        title: 'Anda akan mengubah daily cost?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/daily-cost/update/' + date,
            data
          })
        },
        dispatchRequest: () => {
          setIsSubmitting(false)
          router.push('/daily-cost-calendar')
        },
        cancelAction: () => {
          setIsSubmitting(false)
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      setIsSubmitting(false)
      return rejectWithValue([])
    }
  }
)

export const saveFilterMonthYear = createAsyncThunk('dailyCost/saveFilterMonthYear', async ({ month, year }, {}) => {
  try {
    return { month, year }
  } catch (error) {
    return { month: new Date().getMonth(), year: new Date().getFullYear() }
  }
})

export const appDailyCostSlice = createSlice({
  name: 'dailyCost',
  initialState: {
    allDailyCost: [],
    loadingAllDailyCost: false,
    errorAllDailyCost: null,

    detailDailyCost: {},
    loadingDetailDailyCost: false,
    errorDetailDailyCost: null,

    year: new Date().getFullYear(),
    month: new Date().getMonth()
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllDailyCost.pending, (state, action) => {
        state.loadingAllDailyCost = true
      })
      .addCase(fetchAllDailyCost.fulfilled, (state, action) => {
        state.allDailyCost = action.payload.data
        state.loadingAllDailyCost = false
      })
      .addCase(fetchAllDailyCost.rejected, (state, action) => {
        state.allDailyCost = []
        state.loadingAllDailyCost = false
        state.errorAllDailyCost = action.error.message
      })

      .addCase(fetchDetailDailyCostByDate.pending, (state, action) => {
        state.loadingDetailDailyCost = true
      })
      .addCase(fetchDetailDailyCostByDate.fulfilled, (state, action) => {
        state.detailDailyCost = action.payload.data
        state.loadingDetailDailyCost = false
      })
      .addCase(fetchDetailDailyCostByDate.rejected, (state, action) => {
        state.detailDailyCost = {}
        state.loadingDetailDailyCost = false
        state.errorDetailDailyCost = action.error.message
      })

      .addCase(saveFilterMonthYear.fulfilled, (state, action) => {
        state.month = action.payload.month
        state.year = action.payload.year
      })
  }
})

export default appDailyCostSlice.reducer
