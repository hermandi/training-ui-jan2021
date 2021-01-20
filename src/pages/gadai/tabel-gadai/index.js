import React from 'react'
import './table-anggota.css'

const TableGadai = () => {
  return (
    <div style={{ padding: '20px' }} className="table-wrapper">
      <table border="1" width="100%" className="fl-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Jenis Kelamin</th>
            <th>Pekerjaan</th>
            <th>Action</th>
          </tr>
        </thead>
      </table>
    </div>
  )
}

export default TableGadai
