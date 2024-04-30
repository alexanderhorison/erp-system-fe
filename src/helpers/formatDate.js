const returnFormatDate = date => {
  if (!date) {
    return ''
  }
  const dateTime = new Date(date)
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  let formattedDate = dateTime.toLocaleDateString('en-US', options).split(' ')
  formattedDate = `${formattedDate[1]} ${formattedDate[0]} ${formattedDate[2]}`
  return formattedDate
}

module.exports = {
  returnFormatDate
}
