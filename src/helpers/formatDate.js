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

const returnFormatTime = date => {
  if (!date) {
    return ''
  }
  const dateTime = new Date(date)
  const time = dateTime.toTimeString().split(' ')[0]
  // Will return 16:00:53
  return time
}

function returnFormatDateDay(dateString) {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString);

  const options = {
    weekday: 'long', // Nama hari dalam bahasa Inggris, misalnya: "Senin"
    day: 'numeric', // Tanggal dalam angka, misalnya: 22
    month: 'long', // Nama bulan dalam bahasa Inggris, misalnya: "April"
    year: 'numeric', // Tahun dalam angka, misalnya: 2024
  };

  const dateFormatter = new Intl.DateTimeFormat('id-ID', options);
  const formattedDate = dateFormatter.format(date);

  return formattedDate;
}

module.exports = {
  returnFormatDate,
  returnFormatTime,
  returnFormatDateDay
}
