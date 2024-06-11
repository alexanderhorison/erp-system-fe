import { Box, Card, CardHeader, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'
import TableHeaderMasterProduct from './TableHeaderMasterProduct'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import {
  deleteMasterDataProduct,
  fetchMasterDataProduct,
  fetchMasterDataProductDetail
} from 'src/store/apps/master/product'
import ModalAddMasterProduct from './ModalAddMasterProduct'
import HandleSearh from 'src/helpers/handleSearch'
import { useRouter } from 'next/router'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import FilterProduct from 'src/pages/components/filter/FilterProduct'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataProduct({ id, name }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataProductDetail(id))
    setOpenModalEdit(true)
  }

  const handlePageTransformation = () => {
    router.push(`/master/products/${id}/transformation`)
  }

  return (
    <>
      {openModalEdit && (
        <ModalAddMasterProduct open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: -3 }}>
        <IconButton onClick={handlePageTransformation}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
    </>
  )
}

const defaultFilter = {
  CategoryId: '',
  TypeId: '',
  CompanyId: ''
}

export default function TableMasterProduct({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { data } = useSelector(state => state.masterProduct)
  const { data: categoryData } = useSelector(state => state.category)
  const { data: typeData } = useSelector(state => state.type)
  const { data: companyData } = useSelector(state => state.company)

  const [filterInput, setFilterInput] = useState(defaultFilter)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'category', 'type'], searchValue, setData: setFilteredData })
  }

  const updatedUrl = useCallback((params) => {
    const { CategoryId, TypeId, CompanyId } = params
    router.push({
      pathname: router.pathname,
      query: {
        CategoryId: CategoryId || '',
        TypeId: TypeId || '',
        CompanyId: CompanyId || '',
      }
    }, undefined, { shallow: true });
  } , [router])

  useEffect(() => {
    const query = router.query
    const initialFilter = {
      CategoryId: query.CategoryId || '',
      TypeId: query.TypeId || '',
      CompanyId: query.CompanyId || '',
    }
    setFilterInput(initialFilter)
    dispatch(fetchMasterDataProduct(initialFilter))
    dispatch(fetchMasterDataType())
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataCompany())
  }, [dispatch, router.query])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const clearAllFilter = useCallback(
    val => {
      setSearchText('')
      setFilteredData([])
      dispatch(fetchMasterDataProduct())
      setFilterInput(defaultFilter)
      updatedUrl({
        CategoryId: '',
        TypeId: '',
        CompanyId: '',
      })
    },
    [dispatch, updatedUrl]
  )

  const submitFilter = useCallback(() => {
    if (filterInput.CategoryId || filterInput.TypeId || filterInput.CompanyId) {
      updatedUrl({
        CategoryId: filterInput.CategoryId,
        TypeId: filterInput.TypeId,
        CompanyId: filterInput.CompanyId,
      })
      dispatch(fetchMasterDataProduct(filterInput))
    } else {
      dispatch(fetchMasterDataProduct())
    }
  }, [dispatch, filterInput, updatedUrl])

  const handleFilterInput = useCallback(
    e => {
      const { value, name } = e.target
      setFilterInput({ ...filterInput, [name]: value })
    },
    [filterInput]
  )

  return (
    <Card>
      {openModalAdd && <ModalAddMasterProduct open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <CardHeader title='Pencarian' />
      <FilterProduct
        filterInput={filterInput}
        handleFilterInput={handleFilterInput}
        clearAllFilter={clearAllFilter}
        submitFilter={submitFilter}
        category={categoryData}
        type={typeData}
        company={companyData}
      />
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.2,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'category',
            headerName: 'Kategori',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.category}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'type',
            headerName: 'Tipe',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.type}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'company',
            headerName: 'Perusahaan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.company}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 110,
            field: 'description',
            headerName: 'Dekripsi Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.description || '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderMasterProduct }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari produk, kategori atau tipe',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
