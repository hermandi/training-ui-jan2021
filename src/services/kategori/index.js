import apiClientApp from 'services/axios-app'

export async function doSearchAllKategori() {
  return apiClientApp
    .get('/kategori/all')
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default doSearchAllKategori
