import CardPrinter from './CardPrinter'

export default function SettingSectionPrinter({ printerList, printerHealthStatus, handleSelectPrinter }) {
  return printerList?.map((printer, index) => (
    <CardPrinter
      key={index}
      printer={printer}
      printerHealthStatus={printerHealthStatus}
      handleSelectPrinter={handleSelectPrinter}
    />
  ))
}
