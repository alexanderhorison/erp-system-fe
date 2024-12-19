import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalConfirmationDelete,
  swalConfirmationEdit,
  swalToastError
} from 'src/helpers/swalFunction'

const label = 'produk'
// GET ALL WAREHOUSE
export const fetchListProductPos = createAsyncThunk(
  'appProductPos/fetchListProductPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/find-product-by-warehouseid',
        params: params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchDetailProductPos = createAsyncThunk(
  'appProductPos/fetchDetailProductPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/get-all-product-by-productid',
        params: params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE PRODUCT TO FAV
export const updateFavoriteProductPos = createAsyncThunk(
  'appProductPos/updateFavoriteProductPos',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Favorite',
        name: 'Favorite',
        title: 'Jadikan produk favorit?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/point-of-sale/add-favorite',
            data
          })
        },
        dispatchRequest: () => {
          // setOpen(false)
          // dispatch(fetchMasterDataVendor())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)



export const appPosSlice = createSlice({
  name: 'appProductPos',
  initialState: {
    listProductPos: [],
    loadingListProductPos: true,
    errorListProductPos: false,

    detailProductPos: [],
    loadingDetailProductPos: true,
    errorDetailProductPos: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListProductPos.pending, (state, action) => {
        state.loadingListProductPos = true
      })
      .addCase(fetchListProductPos.fulfilled, (state, action) => {
        state.listProductPos = action.payload.data
        state.loadingListProductPos = false
      })
      .addCase(fetchListProductPos.rejected, (state, action) => {
        state.loadingListProductPos = false
        state.errorListProductPos = action.error.message
        state.listProductPos = []
      })
      // DETAIL
      .addCase(fetchDetailProductPos.pending, (state, action) => {
        state.loadingDetailProductPos = true
      })
      .addCase(fetchDetailProductPos.fulfilled, (state, action) => {
        state.detailProductPos = action.payload.data
        state.loadingDetailProductPos = false
      })
      .addCase(fetchDetailProductPos.rejected, (state, action) => {
        state.loadingDetailProductPos = false
        state.errorDetailProductPos = action.error.message
        state.detailProductPos = []
      })
  }
})

export default appPosSlice.reducer
