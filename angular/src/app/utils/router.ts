export function getHashRoute(url = location.href) {
  const urlObj = new URL(url);

  if (urlObj.hash) {
    const hash = urlObj.hash.split('?')[0];
    return hash.slice(1);
  }

  return null;
}

export function getQueryParams(url = location.href) {
  const urlObj = new URL(url);
  const queryParams: { [key: string]: any } = {};

  if (urlObj.search) {
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
  }

  if (urlObj.hash) {
    const search = urlObj.hash.split('?')[1];
    new URLSearchParams(search).forEach((value, key) => {
      queryParams[key] = value;
    });
  }

  return queryParams;
}
