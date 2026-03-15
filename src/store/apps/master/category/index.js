import axios from 'src/configs/axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'kategori'

// GET ALL MASTER CATEGORY
export const fetchDataMasterCategory = createAsyncThunk(
  'appMasterCategory/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/category/all'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL CATEGORY
export const fetchDataMasterCategoryDetail = createAsyncThunk(
  'appMasterCategory/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/category/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
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
      swalSuccess({ label, name: 'Kategori', response })
      dispatch(fetchDataMasterCategory())
    } catch (error) {
      swalError({ label, error })
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
      swalSuccess({ label, name: 'Kategori', response })
      dispatch(fetchDataMasterCategory())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE CATEGORY
export const deleteMasterDataCategory = createAsyncThunk(
  'appCategory/deleteCategory',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/category/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchDataMasterCategory())
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER KATEGORI
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
    allData: [],
    loadingAdd: false,
    errorAdd: false,
    loadingEdit: false,
    errorEdit: false,
    loadingDelete: false,
    errorDelete: false
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

      .addCase(addMasterDataCategory.pending, (state, action) => {
        state.loadingAdd = true
      })
      .addCase(addMasterDataCategory.fulfilled, (state, action) => {
        state.loadingAdd = false
      })
      .addCase(addMasterDataCategory.rejected, (state, action) => {
        state.loadingAdd = false
        state.errorAdd = action.error.message
      })

      .addCase(editMasterDataCategory.pending, (state, action) => {
        state.loadingEdit = true
      })
      .addCase(editMasterDataCategory.fulfilled, (state, action) => {
        state.loadingEdit = false
      })
      .addCase(editMasterDataCategory.rejected, (state, action) => {
        state.loadingEdit = false
        state.errorEdit = action.error.message
      })

      .addCase(deleteMasterDataCategory.pending, (state, action) => {
        state.loadingDelete = true
      })
      .addCase(deleteMasterDataCategory.fulfilled, (state, action) => {
        state.loadingDelete = false
      })
      .addCase(deleteMasterDataCategory.rejected, (state, action) => {
        state.loadingDelete = false
        state.errorDelete = action.error.message
      })
  }
})

export default appMasterCategorySlice.reducer
