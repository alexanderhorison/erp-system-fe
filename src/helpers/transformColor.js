const transformColor = color => {
  let returnColor
  switch (color) {
    case 'PENDING':
      returnColor = 'info'
      break
    case 'APPROVED':
      returnColor = 'success'
      break
    case 'REJECTED':
      returnColor = 'error'
      break
    case 'DRAFT':
      returnColor = 'warning'
      break
    default:
      returnColor = 'primary'
      break
  }
  return returnColor
}

module.exports = {
  transformColor
}
