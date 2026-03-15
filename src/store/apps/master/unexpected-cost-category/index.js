import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'kategori biaya tak terduga'

// GET ALL UNEXPECTED COST CATEGORY
export const fetchMasterDataUnexpectedCostCategory = createAsyncThunk(
  'appMasterUnexpectedCostCategory/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/unexpected-cost-category/all',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL UNEXPECTED COST CATEGORY
export const fetchMasterDataUnexpectedCostCategoryDetail = createAsyncThunk(
  'appMasterUnexpectedCostCategory/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/unexpected-cost-category/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD UNEXPECTED COST CATEGORY
export const addMasterDataUnexpectedCostCategory = createAsyncThunk(
  'appMasterUnexpectedCostCategory/addUnexpectedCostCategory',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/unexpected-cost-category/create',
        headers: {},
        data
      })
      swalSuccess({ label, name: 'Kategori biaya tak terduga', response })
      dispatch(fetchMasterDataUnexpectedCostCategory())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT UNEXPECTED COST CATEGORY
export const editMasterDataUnexpectedCostCategory = createAsyncThunk(
  'appMasterUnexpectedCostCategory/editUnexpectedCostCategory',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/unexpected-cost-category/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Kategori biaya tak terduga', response })
      dispatch(fetchMasterDataUnexpectedCostCategory())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// DELETE UNEXPECTED COST CATEGORY
export const deleteMasterDataUnexpectedCostCategory = createAsyncThunk(
  'appUnexpectedCostCategory/deleteUnexpectedCostCategory',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/unexpected-cost-category/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataUnexpectedCostCategory())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER UNEXPECTED COST CATEGORY
export const appMasterUnexpectedCostCategorySlice = createSlice({
  name: 'appMasterUnexpectedCostCategory',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      description: '',
      is_active: true
    },
    defaultValue: {
      id: '',
      name: '',
      description: '',
      is_active: true
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
      .addCase(fetchMasterDataUnexpectedCostCategory.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataUnexpectedCostCategory.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataUnexpectedCostCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataUnexpectedCostCategoryDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataUnexpectedCostCategoryDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataUnexpectedCostCategoryDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })

      .addCase(addMasterDataUnexpectedCostCategory.pending, (state, action) => {
        state.loadingAdd = true
      })
      .addCase(addMasterDataUnexpectedCostCategory.fulfilled, (state, action) => {
        state.loadingAdd = false
      })
      .addCase(addMasterDataUnexpectedCostCategory.rejected, (state, action) => {
        state.loadingAdd = false
        state.errorAdd = action.error.message
      })

      .addCase(editMasterDataUnexpectedCostCategory.pending, (state, action) => {
        state.loadingEdit = true
      })
      .addCase(editMasterDataUnexpectedCostCategory.fulfilled, (state, action) => {
        state.loadingEdit = false
      })
      .addCase(editMasterDataUnexpectedCostCategory.rejected, (state, action) => {
        state.loadingEdit = false
        state.errorEdit = action.error.message
      })

      .addCase(deleteMasterDataUnexpectedCostCategory.pending, (state, action) => {
        state.loadingDelete = true
      })
      .addCase(deleteMasterDataUnexpectedCostCategory.fulfilled, (state, action) => {
        state.loadingDelete = false
      })
      .addCase(deleteMasterDataUnexpectedCostCategory.rejected, (state, action) => {
        state.loadingDelete = false
        state.errorDelete = action.error.message
      })
  }
})

export default appMasterUnexpectedCostCategorySlice.reducer
