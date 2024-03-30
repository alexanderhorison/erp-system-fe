import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'src/configs/axios'

export const fetchDataMasterCategory = createAsyncThunk(
  'appMasterCategory/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/category/all'
      })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue([])
    }
  }
)

export const fetchDataMasterCategoryDetail = createAsyncThunk(
  'appMasterCategory/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/category/' + id
      })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// ADD CATEGORY
export const addMasterDataCategory = createAsyncThunk(
  'appMasterCategory/addCategory',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/category/create',
        headers: {},
        data
      })
      dispatch(fetchDataMasterCategory())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// EDIT CATEGORY
export const editMasterDataCategory = createAsyncThunk(
  'appMasterCategory/editCategory',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/category/' + id,
        data: data
      })
      dispatch(fetchDataMasterCategory())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// DELETE CATEGORY
export const deleteMasterDataCategory = createAsyncThunk(
  'appCategory/deleteCategory',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios({
        method: 'DELETE',
        url: '/master/category/' + id
      })
      dispatch(fetchDataMasterCategory())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

export const appMasterCategorySlice = createSlice({
  name: 'masterCategory',
  initialState: {
    data: [],
    loading: false,
    error: false,
    defaultValue: {
      id: '',
      name: '',
      description: ''
    },
    detail: {
      id: '',
      name: '',
      description: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDataMasterCategory.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchDataMasterCategory.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchDataMasterCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchDataMasterCategoryDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchDataMasterCategoryDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchDataMasterCategoryDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterCategorySlice.reducer
