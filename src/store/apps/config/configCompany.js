import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Company Configuration'

// GET COMPANY INFO
export const fetchCompanyInfo = createAsyncThunk(
  'appCompanyConfig/fetchCompanyInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/config/detail',
        data: { key: "COMPANY_INFO" }
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE COMPANY INFO
export const updateCompanyInfo = createAsyncThunk(
  'appCompanyConfig/updateCompanyInfo',
  async ({ id, payload, setOpen }, { rejectWithValue, dispatch, getState }) => {
    try {
      // Update existing config
      const response = await axios({
        method: 'POST',
        url: '/config/update/' + id,
        data: payload
      });
      swalSuccess({ label, name: 'Company Information', response })
      setOpen(false)
      dispatch(fetchCompanyInfo())
      return
    } catch (error) {
      console.error('Update company info error:', error);
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// COMPANY CONFIG SLICE
export const appCompanyConfigSlice = createSlice({
  name: 'appCompanyConfig',
  initialState: {
    companyInfo: null,
    rawCompany: null,
    loadingCompanyInfo: false,
    errorCompanyInfo: false,

    // Update Company Info
    loadingUpdateCompanyInfo: false,
    errorUpdateCompanyInfo: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH COMPANY INFO
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.loadingCompanyInfo = true
        state.errorCompanyInfo = false
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.loadingCompanyInfo = false
        state.companyInfo = action.payload
        state.rawCompany = action.payload.value_json
      })
      .addCase(fetchCompanyInfo.rejected, (state) => {
        state.loadingCompanyInfo = false
        state.errorCompanyInfo = true
      })
      // UPDATE COMPANY INFO
      .addCase(updateCompanyInfo.pending, (state) => {
        state.loadingUpdateCompanyInfo = true
        state.errorUpdateCompanyInfo = false
      })
      .addCase(updateCompanyInfo.fulfilled, (state) => {
        state.loadingUpdateCompanyInfo = false
      })
      .addCase(updateCompanyInfo.rejected, (state) => {
        state.loadingUpdateCompanyInfo = false
        state.errorUpdateCompanyInfo = true
      })
  }
})

export default appCompanyConfigSlice.reducer
