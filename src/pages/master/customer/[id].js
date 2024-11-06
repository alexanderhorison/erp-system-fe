import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMasterDataCustomerDetail } from "src/store/apps/master/customer";
import ButtonBack from "src/views/common/ButtonBack";
import CustomTab from "src/views/common/CustomTab";
import DetailCustomer from "src/views/master/customer/DetailCustomer";
import SummaryCustomer from "src/views/master/customer/SummaryCustomer";
import TableSalesOrderCustomer from "src/views/master/customer/TableSalesOrderCustomer";

export default function DetailMasterCustomer() {
  const dispatch = useDispatch()
  const query = useRouter().query
  const [activeTab, setActiveTab] = useState('summary')
  const [loadingTab, setLoadingTab] = useState(false)

  const { loadingDetail, detail: detailCustomer } = useSelector(state => state.masterCustomer)

  useEffect(() => {
    if (query?.id){
      dispatch(fetchMasterDataCustomerDetail(query.id))
    }
  }, [query.id])

  const tabList = [
    {
      label: 'Summary',
      value: 'summary',
      icon: 'tabler:wallet',
    },
    {
      label: 'Sales Order',
      value: 'sales-order',
      icon: 'tabler:truck-delivery',
    }
  ]

  return (
    <Grid container spacing={6}>
      <ButtonBack name='Detail Data Customer' paddingY={0} />
      <Grid item xs={12}>
        <DetailCustomer data={detailCustomer} loading={loadingDetail} />
      </Grid>
      <Grid item xs={12}>
        <CustomTab
          tabContentList={tabList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loadingTab}
          setLoadingTab={setLoadingTab}
        />
      </Grid>
      {
        activeTab === 'summary' && (
          <Grid item xs={12}>
            <SummaryCustomer />
          </Grid>
        )
      }
      {
        activeTab === 'sales-order' && (
          <Grid item xs={12}>
            <TableSalesOrderCustomer />
          </Grid>
        )
      }
    </Grid>
  )
}