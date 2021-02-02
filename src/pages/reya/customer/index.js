import React from 'react'
import { Table, Card } from 'antd'
import * as transaksi from 'services/transaksi'
import { history } from 'index'

// Untuk Table
const columns = [
  {
    title: 'ID Pelanggan',
    dataIndex: 'customerId',
    key: 'customerId',
    sorter: true,
    width: '15%',
  },
  {
    title: 'Nama Pelanggan',
    dataIndex: 'customerName',
    key: 'customerName',
    sorter: true,
    width: '15%',
  },
  {
    title: 'Jenis Kelamin',
    dataIndex: 'jenisKelamin',
    key: 'jenisKelamin',
    sorter: true,
    width: '15%',
  },
  {
    title: 'No KTP',
    dataIndex: 'noKtp',
    key: 'noKtp',
    width: '15%',
  },
  {
    title: 'Jenis Usaha',
    dataIndex: 'jenisUsaha',
    key: 'jenisUsaha',
    width: '15%',
  },
]

class DataCustomer extends React.Component {
  state = {
    data: [],
  }

  componentDidMount() {
    console.log('Component did mount!')
    this.fetch({})
  }

  fetch = () => {
    transaksi.doGetCustomer().then(data => {
      console.log(data)
      this.setState({
        data: data.responseData,
      })
    })
  }

  onFinish = () => {
    console.log('Hello!')
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  routeChange = () => {
    const path = '/reya/input-produk'
    history.push(path)
  }

  render() {
    const { data } = this.state
    return (
      <div>
        <Card title="Pelanggan" size="small">
          <Table
            columns={columns}
            rowKey={record => record.customerId}
            dataSource={data}
            size="small"
          />
        </Card>
      </div>
    )
  }
}

export default DataCustomer
