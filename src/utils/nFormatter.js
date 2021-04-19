const nFormatter = (num, digits = 1) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(num)) {
    return num;
  }
  const absoluteNum = Math.abs(num);
  const si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'G' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'P' },
    { value: 1E18, symbol: 'E' }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (absoluteNum >= si[i].value) {
      break;
    }
  }
  return `${num < 0 ? '-' : ''}${(absoluteNum / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol}`;
};

export default nFormatter;
