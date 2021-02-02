import apiClientApp from 'services/axios-app'

export async function doSearchPelanggan(data) {
  return apiClientApp
    .post('/pelanggan/doSearchPelanggan', {
      custId: data.custId,
      custName: data.custName,
      custKtp: data.custKtp,
      custHp: data.custHp,
      actorId: data.actorId,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default doSearchPelanggan
