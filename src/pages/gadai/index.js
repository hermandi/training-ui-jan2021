import React from 'react'
import { Helmet } from 'react-helmet'
import TableGadai from './tabel-gadai'

const DashboardAlpha = () => {
  return (
    <div>
      <Helmet title="Dashboard: Analytics" />
      <div className="cui__utils__heading">
        <strong>DASHBOARD GADAI</strong>
        <h1> Data Gadai </h1>
        <hr />
        <table width="50%">
          <tbody>
            <tr>
              <td>Nama</td>
              <td>:</td>
              <td>
                <input type="text" name="nama" id="nama" />
              </td>
            </tr>
            <tr>
              <td>Jenis Kelamin</td>
              <td>:</td>
              <td>
                <input type="radio" value="1" name="jenisKelamin" id="jenisKelamin" /> Pria
                <input type="radio" value="0" name="jenisKelamin" id="jenisKelamin" /> Wanita
              </td>
            </tr>
            <tr>
              <td>Pekerjaan</td>
              <td>:</td>
              <td>
                <select name="pekerjaan" id="pekerjaan">
                  <option value=""> -- Pilih Pekerjaan --</option>
                  <option value="Karyawan Swasta"> Karyawan Swasta</option>
                  <option value="TNI/Polisi"> TNI/Polisi</option>
                  <option value="ASN"> ASN</option>
                  <option value="Guru"> Guru</option>
                </select>
              </td>
            </tr>
            <tr>
              <td />
              <td />
              <td>
                <button type="submit">Add Anggota</button>
              </td>
            </tr>
          </tbody>
        </table>
        <TableGadai />
      </div>
    </div>
  )
}

export default DashboardAlpha
