export default function HandleSearh({ data, keys = [], setData, searchValue }) {
  if (searchValue.length && keys.length) {
    const filteredRows = data.filter(row => {
      return keys.some(key => {
        return row[key].toLowerCase().includes(searchValue.toLowerCase());
      });
    });
    setData(filteredRows);
  } else {
    setData(data);
  }
}