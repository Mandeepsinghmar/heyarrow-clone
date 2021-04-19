const getLocation = (city) => {
  if (!city) {
    return '';
  }
  if (!city.state) {
    return city.name;
  }
  return `${city?.name}, ${city?.state?.name} `;
};

export default getLocation;
