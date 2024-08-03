export default function HandleSearch({ data, keys = [], setData, searchValue }) {
  if (searchValue && typeof searchValue === 'number') {
    searchValue = searchValue.toString();
  }

  if (searchValue && searchValue.length && keys.length) {
    const filteredRows = data.filter(row => {
      return keys.some(key => {
        const value = (row[key]?.toString() || '').toLowerCase();
        const searchText = searchValue.toLowerCase();
        return value.includes(searchText) || value.includes(`-${searchText}`);
      });
    });
    setData(filteredRows);
  } else {
    setData(data);
  }
}