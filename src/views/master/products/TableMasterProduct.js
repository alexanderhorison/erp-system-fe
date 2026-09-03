import { Box, Button, IconButton, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import Icon from 'src/@core/components/icon'

import {
  deleteMasterDataProduct,
  fetchMasterDataProduct,
  fetchMasterDataProductDetail
} from 'src/store/apps/master/product'
import {
  downloadProductPriceTemplate,
  importProductPriceTemplate,
  clearImportLoading
} from 'src/store/apps/master/product-price'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'

import ModalAddMasterProduct from './ModalAddMasterProduct'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.masterProduct)

  const handleDelete = () => {
    dispatch(deleteMasterDataProduct({ id, name }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataProductDetail(id))
    setOpenModalEdit(true)
  }

  const handlePageTransformation = () => {
    router.push(`/master/products/${id}`)
  }

  return (
    <>
      {openModalEdit && (
        <ModalAddMasterProduct open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <IconButton onClick={handlePageTransformation} size='small'>
          <Icon icon='tabler:eye' fontSize='1.125rem' />
        </IconButton>
        <IconButton onClick={handleEdit} size='small'>
          <Icon icon='tabler:edit' fontSize='1.125rem' />
        </IconButton>
        <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
          <Icon icon='tabler:trash' fontSize='1.125rem' />
        </IconButton>
      </Box>
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Delete Product'
        itemName={name}
        loading={loadingDelete}
      />
    </>
  )
}

const defaultFilter = {
  categoryId: '',
  typeId: '',
  companyId: ''
}

export default function TableMasterProduct({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [filterAnchor, setFilterAnchor] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.masterProduct)
  const { data: categoryData } = useSelector(state => state.category)
  const { data: typeData } = useSelector(state => state.type)
  const { data: companyData } = useSelector(state => state.company)
  const { loadingDownload, loadingImport } = useSelector(state => state.masterProductPrice)

  const [filterInput, setFilterInput] = useState(defaultFilter)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'category', 'type'], searchValue, setData: setFilteredData })
  }

  const updatedUrl = useCallback(
    params => {
      const { categoryId, typeId, companyId } = params
      router.push(
        {
          pathname: router.pathname,
          query: {
            categoryId: categoryId || '',
            typeId: typeId || '',
            companyId: companyId || ''
          }
        },
        undefined,
        { shallow: true }
      )
    },
    [router]
  )

  useEffect(() => {
    const query = router.query
    const initialFilter = {
      categoryId: query.categoryId || '',
      typeId: query.typeId || '',
      companyId: query.companyId || ''
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

  const clearAllFilter = useCallback(() => {
    setSearchText('')
    setFilteredData([])
    dispatch(fetchMasterDataProduct())
    setFilterInput(defaultFilter)
    updatedUrl({ categoryId: '', typeId: '', companyId: '' })
  }, [dispatch, updatedUrl])

  // ** Applies the values staged in the filter panel.
  const submitFilter = useCallback(
    nextFilter => {
      const applied = nextFilter || filterInput
      setFilterInput(applied)
      if (applied.categoryId || applied.typeId || applied.companyId) {
        updatedUrl(applied)
        dispatch(fetchMasterDataProduct(applied))
      } else {
        updatedUrl({ categoryId: '', typeId: '', companyId: '' })
        dispatch(fetchMasterDataProduct())
      }
    },
    [dispatch, filterInput, updatedUrl]
  )

  const handleDownloadTemplate = useCallback(() => {
    dispatch(downloadProductPriceTemplate())
  }, [dispatch])

  const handleImportTemplate = useCallback(
    e => {
      const file = e.target.files[0]
      if (file) {
        dispatch(importProductPriceTemplate(file))
        // Clear loading state after 10 seconds
        setTimeout(() => {
          dispatch(clearImportLoading())
        }, 10000)
        // Reset the input value so the same file can be uploaded again
        e.target.value = ''
      }
    },
    [dispatch]
  )

  const toOptions = list => (list || []).map(item => ({ value: item.id, label: item.name }))

  const filterFields = useMemo(
    () => [
      { name: 'categoryId', label: 'Category', type: 'select', options: toOptions(categoryData) },
      { name: 'typeId', label: 'Type', type: 'select', options: toOptions(typeData) },
      { name: 'companyId', label: 'Company', type: 'select', options: toOptions(companyData) }
    ],
    [categoryData, typeData, companyData]
  )

  const activeFilterCount = Object.values(filterInput).filter(Boolean).length

  return (
    <>
      {openModalAdd && <ModalAddMasterProduct open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}

      <FilterPanel
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        fields={filterFields}
        value={filterInput}
        onApply={submitFilter}
        onReset={clearAllFilter}
      />

      <DataTable
        itemLabel='products'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Search product, category, or type'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={
              <>
                <Button
                  variant='contained'
                  onClick={handleDownloadTemplate}
                  disabled={loadingDownload}
                  startIcon={<Icon icon='tabler:download' fontSize='1rem' />}
                >
                  Download Template Base Price
                </Button>
                <Button
                  variant='contained'
                  component='label'
                  disabled={loadingImport}
                  startIcon={<Icon icon='tabler:upload' fontSize='1rem' />}
                >
                  Import Base Price
                  <input type='file' accept='.xlsx,.xls' hidden onChange={handleImportTemplate} />
                </Button>
                <Button
                  variant='contained'
                  onClick={() => setOpenModalAdd(true)}
                  startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                >
                  Add Product
                </Button>
              </>
            }
          />
        }
        columns={[
          {
            flex: 0.25,
            minWidth: 220,
            field: 'name',
            headerName: 'PRODUCT NAME',
            renderCell: params => <Typography variant='body2'>{params.row.name}</Typography>
          },
          {
            flex: 0.12,
            minWidth: 120,
            field: 'category',
            headerName: 'CATEGORY',
            renderCell: params => <Typography variant='body2'>{params.row.category}</Typography>
          },
          {
            flex: 0.12,
            minWidth: 120,
            field: 'type',
            headerName: 'TYPE',
            renderCell: params => <Typography variant='body2'>{params.row.type}</Typography>
          },
          {
            flex: 0.15,
            minWidth: 160,
            field: 'company',
            headerName: 'COMPANY',
            renderCell: params => <Typography variant='body2'>{params.row.company}</Typography>
          },
          {
            flex: 0.16,
            minWidth: 160,
            field: 'description',
            headerName: 'PRODUCT DESCRIPTION',
            renderCell: params => <Typography variant='body2'>{params.row.description || '-'}</Typography>
          },
          {
            flex: 0.12,
            minWidth: 140,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
      />
    </>
  )
}
