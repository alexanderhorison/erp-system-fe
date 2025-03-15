import CardPrinter from "./CardPrinter";


export default function SettingSectionPrinter({ printerList, handleSelectPrinter }) {
  return printerList?.map((printer, index) => (
    <CardPrinter
      key={index}
      printer={printer}
      handleSelectPrinter={handleSelectPrinter}
    />
  ))
}