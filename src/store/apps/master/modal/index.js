import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalError, swalSuccess } from 'src/helpers/swalFunction'
import { fetchMasterDataProductPrice } from '../product-price'

const label = 'modal'

// FIND ONE PRODUCT PRICE
export const fetchOneMasterDataModal = createAsyncThunk(
  'appMasterModal/fetchOneMasterDataModal',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/master/modal/${data.productId}/${data.unitId}`,
        data
      })
      return response.data
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const forceUpdateMasterDataModal = createAsyncThunk(
  'appMasterModal/forceUpdateMasterDataModal',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/modal/force-update-modal',
        data
      })
      swalSuccess({ label, name: 'Product Price', response })
      dispatch(fetchMasterDataProductPrice(data.productId))
      return response.data
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const appMasterModalSlice = createSlice({
  name: 'appMasterModal',
  initialState: {
    // data: [],
    // loading: false,
    error: false,
    // total: 1,
    // params: {},
    loadingDetail: false,
    detail: {
      modal: 0
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOneMasterDataModal.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchOneMasterDataModal.fulfilled, (state, action) => {
        let newValue = {
          basePrice: action.payload.data ? action.payload.data.modal : 0
        }
        state.detail = newValue
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchOneMasterDataModal.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterModalSlice.reducer
