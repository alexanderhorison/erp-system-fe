import { Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { swalConfirmationOnly } from "src/helpers/swalFunctionPos";
import { fetchAllPrinter } from "src/store/apps/config/configPrinter";
import { fetchMasterDataWarehouse } from "src/store/apps/master/warehouse";
import Icon from 'src/@core/components/icon';
import SettingSectionWarehouse from "./SettingSectionWarehouse";
import SettingSectionPrinter from "./SettingSectionPrinter";
import { changePrinter, connectToPrinter } from "src/utils/printerHelper";

export default function SettingPosLayout({
  setWarehouse,
  user,
}) {
  const dispatch = useDispatch();
  const { data: warehouseList } = useSelector((state) => state.warehouse);
  const { listPrinter, loadingListPrinter } = useSelector(state => state.printer);
  const [selectedSettings, setSelectedSettings] = useState("");

  const menus = [
    { label: "Pilih Gudang", value: "SETTING_WAREHOUSE", icon: "tabler:building-warehouse" },
    { label: "Pilih Printer", value: "SETTING_PRINTER", icon: "tabler:printer" },
  ];

  const handleSelectWarehouse = (data) => {
    swalConfirmationOnly({
      title: "Pilih Gudang",
      text: `Apakah anda ingin mengganti gudang menjadi ${data.name}?`,
      confirmButtonText: "Ya, Konfirmasi",
      showCancelButton: true,
      cancelButtonText: "Tidak",
      onClickYes: () => {
        localStorage.setItem('warehousePos', JSON.stringify({ warehouseId: data.id, warehouseName: data.name }))
        setWarehouse({
          warehouseId: data.id,
          warehouseName: data.name
        })
      }
    })
  }

  const handleSelectPrinter = (printer) => {
    swalConfirmationOnly({
      title: "Pilih Printer",
      text: `Apakah anda ingin mengganti printer menjadi ${printer.value}?`,
      confirmButtonText: "Ya, Konfirmasi",
      showCancelButton: true,
      cancelButtonText: "Tidak",
      onClickYes: () => {
        changePrinter()
        let printerPos = {
          id: printer.id,
          name: printer.value,
          ip: printer.value_json.ip,
          port: printer.value_json.port,
          domain_type: printer.value_json.domain_type,
          connection_type: printer.value_json.connection_type,
        }
        localStorage.setItem('printerPos', JSON.stringify(printerPos))
        connectToPrinter({ printerConfig: printerPos, dispatch })
      }
    })
  };

  const handleSelectMenu = (value) => {
    setSelectedSettings(value)
    if (value === "SETTING_PRINTER") {
      if (!listPrinter.length) {
        dispatch(fetchAllPrinter({}))
      }
    }
    if (value === "SETTING_WAREHOUSE") {
      if (user?.warehouseId) return
      if (!warehouseList.length) {
        dispatch(fetchMasterDataWarehouse({}));
      }
    }
  }

  return (
    <Grid container spacing={3} p={3}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Typography fontSize={20}>
            Setting POS
          </Typography>
        </Box>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ bgcolor: '#f0f0f0', overflowY: 'auto', height: '57vh', p: 3, borderRadius: 2 }}>
              <Grid container spacing={2}>
                {menus.map((menu) => (
                  <Grid item xs={3} key={menu.value}>
                    <Box
                      border={0}
                      bgcolor={selectedSettings === menu.value ? '#d6bdab' : 'white'}
                      boxShadow={1}
                      borderRadius={1}
                      height={100}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => handleSelectMenu(menu.value)} // Hanya panggil action jika tidak disable
                      style={{
                        opacity: 1,
                        pointerEvents: 'auto',
                      }}
                    >
                      <Icon icon={menu.icon} width={24} height={24} />
                      <Typography variant="body2" fontSize={'0.75rem'} mt={1}>
                        {menu.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ bgcolor: '#f0f0f0', overflowY: 'auto', height: '57vh', p: 3, borderRadius: 2 }}>
              {
                selectedSettings === "SETTING_WAREHOUSE" && (
                  <SettingSectionWarehouse warehouseList={warehouseList} handleSelectWarehouse={handleSelectWarehouse} />
                )
              }

              {
                selectedSettings === "SETTING_PRINTER" && (
                  <SettingSectionPrinter printerList={listPrinter} handleSelectPrinter={handleSelectPrinter} />
                )
              }


            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}