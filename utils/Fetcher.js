const fetcher = (...args) =>
  fetch(...args)
    .then((res) => res.json())
    .catch((err) => ('Error fetching data: ', err));

export default fetcher;
