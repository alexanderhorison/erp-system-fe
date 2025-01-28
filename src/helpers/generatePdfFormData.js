import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { swalNotifError } from './swalFunction'
import axios from 'src/configs/axios'

//! PDF SUDAH DIBUAT DI BE, HANYA BUTUH CODE. BARU DI IMPLEMENT UNTUK SO DAN PO
const pdfFormData = async (cardElement, module, code, namePdf, additionSubjectText = '') => {
  const formData = new FormData()
  let pdfBlob = null
  if (!code.includes('SO') || !code.includes('PO')) {
    // Addition Subject Text for add on email subject
    // Currently being used sales order and purchase order for (Customer A or Vendor A)
    // cardElement.style.width = '250mm' // A4 width
    // cardElement.style.height = 'auto' // Allow height to auto to fit content
    // cardElement.style.overflow = 'visible' // Ensure all content is visible
    // cardElement.style.margin = '0';

    // const canvas = await html2canvas(cardElement, {
    //   scale: 2.5, // Higher scale for better quality
    //   width: cardElement.scrollWidth,
    //   height: cardElement.scrollHeight,
    //   useCORS: true, // Enable CORS if loading images from different origins
    //   allowTaint: true // Allow cross-origin images to be rendered
    // })
    // const imgData = canvas.toDataURL('image/png')
    // const pdf = new jsPDF('p', 'mm', 'a4') // A4 format
    // const pageWidth = pdf.internal.pageSize.getWidth()
    // const pageHeight = pdf.internal.pageSize.getHeight()

    // const margin = 10
    // const horizontalMargin = 15
    // const imgWidth = pageWidth - horizontalMargin * 2
    // const imgHeight = (canvas.height * imgWidth) / canvas.width

    // let position = margin // Start position from top with margin
    // const maxHeight = pageHeight - margin * 2 // Leave some margin from bottom

    // while (position < imgHeight) {
    //   const scaledHeight = Math.min(imgHeight - position, maxHeight)
    //   pdf.addImage(imgData, 'PNG', 15, position, imgWidth, scaledHeight, undefined, 'SLOW')
    //   position += scaledHeight // Move to the next page with the scaled height
    //   if (position < imgHeight) pdf.addPage() // Add another page if content overflows
    // }
    // // Convert PDF to Blob and then to Base64
    // pdfBlob = await pdf.output('blob')
    // formData.append('pdf', pdfBlob, `${namePdf}.pdf`)
  }
  formData.append('filename', code)
  formData.append('module', module)
  formData.append('additionSubjectText', additionSubjectText)
  return formData
}

//! DEPRECATED
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

// DIRECT DOWNLOAD
const handlePrintDownload = async ({ url, id, setIsLoading }) => {
  try {
    setIsLoading(true); // Start loading

    // Fetch the PDF from the backend
    const response = await axios.get(`/export/${url}/${id}`, {
      responseType: 'blob', // Ensure the response is treated as a binary file (Blob)
    });

    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : `${url}-${id}.pdf`;

    // Create a blob URL and download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = urlBlob;
    link.download = filename; // Use filename from BE or default

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    window.URL.revokeObjectURL(urlBlob);

    setIsLoading(false); // Done
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    setIsLoading(false);
  }
};


module.exports = {
  pdfFormData,
  downloadPdf,
  handlePrintDownload,
  // handlePrintDownloadV2
}
