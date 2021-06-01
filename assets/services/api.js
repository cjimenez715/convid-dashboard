const api = axios.create({
  baseURL: 'https://api.covid19api.com/'
})

const getSummary = async () => {
  let res = await api.get("summary");
  return res.data;
}

const getCountries = async () => {
  let res = await api.get('countries');
  return res.data;
}

const getCountriesDataByDataRangeAndSlug = async (slug, beginDate, endDate) => {
  let res = await api.get(`country/${slug}?from=${beginDate.toISOString().substr(0, 10)}T00:00:00&to=${endDate.toISOString().substr(0, 10)}T00:00:00`);
  return res.data;
}

