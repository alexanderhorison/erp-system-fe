import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalConfirmationDelete,
  swalConfirmationEdit,
  swalToastError
} from 'src/helpers/swalFunction'

const label = 'Config Daily Cost'
// GET CONFIG DAILY COST
export const fetchConfigDailyCost = createAsyncThunk(
  'appConfigDailyCost/fetchConfigDailyCost',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/config/all',
        data: {
          category: 'DAILY_COST'
        }
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const createConfigDailyCost = createAsyncThunk(
  'appConfigDailyCost/createConfigDailyCost',
  async ({ data, onClose }, { rejectWithValue, dispatch }) => {
    try {
      const response = await swalConfirmationEdit({
        label: 'Configurasi Daily Cost',
        title: 'Apakah anda yakin ingin merubah data ?',
        name: 'Konfirmasi',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/config/bulk-update/',
            data: data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchConfigDailyCost({}))
          onClose()
        }
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CONFIG DAILY COST
export const appConfigDailyCostSlice = createSlice({
  name: 'appConfigDailyCost',
  initialState: {
    configDailyCost: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchConfigDailyCost.fulfilled, (state, action) => {
        state.configDailyCost = action.payload
      })
      .addCase(fetchConfigDailyCost.rejected, (state, action) => {
        state.configDailyCost = []
      })
      .addCase(fetchConfigDailyCost.pending, (state, action) => {
        state.configDailyCost = []
      })
  }
})
export default appConfigDailyCostSlice.reducer
