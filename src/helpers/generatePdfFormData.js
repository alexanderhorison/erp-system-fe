import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const pdfFormData = async (cardElement, module, code, namePdf) => {
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
  return formData
}

module.exports = {
  pdfFormData
}
