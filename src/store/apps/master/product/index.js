import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchMasterDataProduct = createAsyncThunk('appMasterProduct/fetchData', async params => {
  const response = await axios.get('http://localhost:5000/master/product/all', {
    params
  })
  return response.data
})

// ADD PRODUCT
export const addMasterDataPorduct = createAsyncThunk(
  'appMasterProduct/addProduct',
  async (data, { getState, dispatch }) => {
    try {
      await axios({
        method: 'post',
        url: process.env.NEXT_PUBLIC_BASE_URL + 'master/product/create',
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

// DELETE PRODUCT
export const deleteMasterDataProduct = createAsyncThunk(
  'appProduct/deleteProduct',
  async (id, { getState, dispatch }) => {
    const response = await axios.delete(`http://localhost:5000/master/product/${id}`)
    dispatch(fetchMasterDataProduct(getState().user.params))
    toast.success('Sukses Menghapus Produk')
    return response.data
  }
)

export const appMasterProductSlice = createSlice({
  name: 'appMasterProduct',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMasterDataProduct.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appMasterProductSlice.reducer
