import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import toast from 'react-hot-toast'

export const fetchMasterDataProduct = createAsyncThunk('appMasterProduct/fetchData', async params => {
  const response = await axios.get('http://localhost:5000/master/product/all', {
    params
  })
  return response.data
})

export const fetchMasterDataProductDetail = createAsyncThunk('appMasterProduct/fetchDataDetal', async id => {
  const response = await axios.get('http://localhost:5000/master/product/' + id)
  return response.data
})

// ADD PRODUCT
export const addMasterDataPorduct = createAsyncThunk(
  'appMasterProduct/addProduct',
  async (data, { getState, dispatch }) => {
    try {
      await axios({
        method: 'post',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/product/create',
        headers: {},
        data
      })
      dispatch(fetchMasterDataProduct())
      toast.success('Sukses Menambahkan Produk')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
)

export const editMasterDataPorduct = createAsyncThunk(
  'appMasterProduct/editProduct',
  async ({ id, data }, { getState, dispatch }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/product/' + id,
        data: data
      })
      dispatch(fetchMasterDataProduct())
      toast.success('Sukses Merubah Produk')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
)

// DELETE PRODUCT
export const deleteMasterDataProduct = createAsyncThunk(
  'appProduct/deleteProduct',
  async (id, { getState, dispatch }) => {
    const response = await axios.delete(`http://localhost:5000/master/product/${id}`)
    dispatch(fetchMasterDataProduct())
    toast.success('Sukses Menghapus Produk')
    return response.data
  }
)

export const appMasterProductSlice = createSlice({
  name: 'appMasterProduct',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      name: '',
      CategoryId: '',
      TypeId: '',
      description: ''
    },
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataProduct.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.total = action.payload.total
      })
      .addCase(fetchMasterDataProductDetail.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataProductDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loading = false
      })
      .addCase(fetchMasterDataProductDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
