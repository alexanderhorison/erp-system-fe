import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMasterDataVendorDetail } from "src/store/apps/master/vendor";
import ButtonBack from "src/views/common/ButtonBack";
import CustomTab from "src/views/common/CustomTab";
import DetailVendor from "src/views/master/vendor/DetailVendor";
import SummaryVendor from "src/views/master/vendor/SummaryVendor";
import TablePurchaseOrderVendor from "src/views/master/vendor/TablePurchaseOrderVendor";

export default function DetailMasterVendor() {
  const dispatch = useDispatch()
  const query = useRouter().query
  const [activeTab, setActiveTab] = useState('summary')
  const [loadingTab, setLoadingTab] = useState(false)

  const { loadingDetail, detail: detailVendor } = useSelector(state => state.masterVendor)

  useEffect(() => {
    dispatch(fetchMasterDataVendorDetail(query.id))
  }, [query.id])

  const tabList = [
    {
      label: 'Summary',
      value: 'summary',
      icon: 'tabler:wallet',
    },
    {
      label: 'Purchase Order',
      value: 'purchase-order',
      icon: 'tabler:truck-delivery',
    }
  ]

  return (
    <Grid container spacing={6}>
      <ButtonBack name='Detail Data Vendor' paddingY={0} />
      <Grid item xs={12}>
        <DetailVendor data={detailVendor} loading={loadingDetail} />
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
      {/* FOR PURCHASE ORDER */}
      {
        activeTab === 'summary' && (
          <Grid item xs={12}>
            <SummaryVendor />
          </Grid>
        )
      }
      {
        activeTab === 'purchase-order' && (
          <Grid item xs={12}>
            <TablePurchaseOrderVendor />
          </Grid>
        )
      }
    </Grid>
  )
}