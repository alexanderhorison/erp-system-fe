export const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} harus diisi`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} minimal harus ${min} karakter`
  } else {
    return ''
  }
}
