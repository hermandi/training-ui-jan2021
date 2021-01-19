import React from 'react'

const DashboardAlpha = () => {
  return (
    <div>
      <div className="cui__utils__heading">
        <h1>
          <strong>Input Products</strong>
        </h1>
        <div>
          <table width="50%">
            <tr>
              <td>Product Name</td>
              <td>:</td>
              <td>
                <input type="text" name="name" />
              </td>
            </tr>
            <tr>
              <td>Code</td>
              <td>:</td>
              <td>
                <input type="text" name="code" />
              </td>
            </tr>
            <tr>
              <td>Quantity</td>
              <td>:</td>
              <td>
                <input type="text" name="quantity" />
              </td>
            </tr>
            <tr>
              <td>Loaded Date</td>
              <td>:</td>
              <td>
                <input type="date" name="keterangan" />
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <button type="submit">Simpan</button>
              </td>
            </tr>
          </table>
        </div>
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>No</th>
              <th>Product Name</th>
              <th>Code</th>
              <th>Quantity</th>
              <th>Loaded Date</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

export default DashboardAlpha
