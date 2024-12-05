import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { swalNotifError } from './swalFunction'

const pdfFormData = async (cardElement, module, code, namePdf, additionSubjectText = '') => {
  // Addition Subject Text for add on email subject
  // Currently being used sales order and purchase order for (Customer A or Vendor A)
  cardElement.style.width = '250mm' // A4 width
  cardElement.style.height = 'auto' // Allow height to auto to fit content
  cardElement.style.overflow = 'visible' // Ensure all content is visible

  const canvas = await html2canvas(cardElement, {
    scale: 2.5, // Higher scale for better quality
    width: cardElement.scrollWidth,
    height: cardElement.scrollHeight,
    useCORS: true, // Enable CORS if loading images from different origins
    allowTaint: true // Allow cross-origin images to be rendered
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4') // A4 format
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth - 30 // Leave some margin (10mm on each side)
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let position = 20 // Start position from top with margin
  const maxHeight = pageHeight - 40 // Leave some margin from bottom

  while (position < imgHeight) {
    const scaledHeight = Math.min(imgHeight - position, maxHeight)
    pdf.addImage(imgData, 'PNG', 15, position, imgWidth, scaledHeight, undefined, 'SLOW')
    position += scaledHeight // Move to the next page with the scaled height
    if (position < imgHeight) pdf.addPage() // Add another page if content overflows
  }
  // Convert PDF to Blob and then to Base64
  const pdfBlob = await pdf.output('blob')
  const formData = new FormData()
  formData.append('pdf', pdfBlob, `${namePdf}.pdf`)
  formData.append('filename', code)
  formData.append('module', module)
  formData.append('additionSubjectText', additionSubjectText)
  return formData
}

const downloadPdf = async (cardElement, code, setIsShow, setIsDownload, setIsDownloading) => {
  cardElement.style.width = '250mm' // A4 width
  cardElement.style.height = 'auto' // Allow height to auto to fit content
  cardElement.style.overflow = 'visible' // Ensure all content is visible

  const canvas = await html2canvas(cardElement, {
    scale: 2.5, // Higher scale for better quality
    width: cardElement.scrollWidth,
    height: cardElement.scrollHeight,
    useCORS: true, // Enable CORS if loading images from different origins
    allowTaint: true // Allow cross-origin images to be rendered
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4') // A4 format
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth - 30 // Leave some margin (10mm on each side)
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let position = 20 // Start position from top with margin
  const maxHeight = pageHeight - 40 // Leave some margin from bottom

  while (position < imgHeight) {
    const scaledHeight = Math.min(imgHeight - position, maxHeight)
    pdf.addImage(imgData, 'PNG', 15, position, imgWidth, scaledHeight, undefined, 'SLOW')
    position += scaledHeight // Move to the next page with the scaled height
    if (position < imgHeight) pdf.addPage() // Add another page if content overflows
  }
  try {
    const url = window.URL.createObjectURL(pdf.output('blob'))
    const link = document.createElement('a')
    link.href = url
    link.download = `${code}.pdf` // Customize the filename
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    swalNotifError({ message: 'Gagal download pdf' })
  }
  setIsShow(false) // Hide the component after capture
  setIsDownload(false)
  setIsDownloading(false)
}

const handlePrintDownload = (url, id, setIsLoading) => {
  // Id for the code surat
  // url where is the page (delivery-order, sales-order) -> based on page print
  setIsLoading(true)
  const originalTitle = document.title // Store the original title
  document.title = id
  const iframe = document.createElement('iframe')
  iframe.style.position = 'absolute'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'
  iframe.src = `/${url}/print/${id}` // URL to trigger the download
  // Listen for the iframe load event
  iframe.onload = () => {
    setTimeout(() => {
      document.title = originalTitle // Restore the original title after some time
      document.body.removeChild(iframe)
    }, 3000) // Remove iframe after 3 seconds
  }

  // Append the iframe to the body
  document.body.appendChild(iframe)
  setIsLoading(false) // Stop loading when the download starts


  // Cara 2 open dan langsung download
  // const link = document.createElement('a')
  // link.href = `/sales-order/print/${id}` // Use the direct URL for file download
  // link.download = `${id}.pdf` // Suggested filename (optional)
  // document.body.appendChild(link)
  // link.click()
  // document.body.removeChild(link)
  // setTimeout(() => {
  //   setIsLoading(false)
  // }, 1000)
}

module.exports = {
  pdfFormData,
  downloadPdf,
  handlePrintDownload
}
