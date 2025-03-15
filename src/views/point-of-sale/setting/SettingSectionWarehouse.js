import CardWarehouse from "./CardWarehouse";


export default function SettingSectionWarehouse({ warehouseList, handleSelectWarehouse }) {
  return warehouseList?.map((warehouse, index) => (
    <CardWarehouse
      key={index || 0}
      warehouse={warehouse}
      handleSelectWarehouse={handleSelectWarehouse}
    />
  ))
}