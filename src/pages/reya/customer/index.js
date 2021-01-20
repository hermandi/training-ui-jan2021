import React from 'react'
import { Table, Card } from 'antd'
import * as transaksi from 'services/transaksi'
import { history } from 'index'

// Untuk Table
const columns = [
  {
    title: 'Nama Pelanggan',
    dataIndex: 'customerName',
    key: 'customerName',
    sorter: true,
    width: '15%',
  },
]

class DataCustomer extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  }

  componentDidMount() {
    console.log('Component did mount!')
    this.fetch({})
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(sorter)
    this.fetch({
      sortField: sorter.columnKey,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    })
  }

  fetch = (params = {}) => {
    this.setState({ loading: true })
    transaksi.doGetTransaksi().then(data => {
      console.log(data)
      this.setState({
        loading: false,
        // data: data.responseData,
        pagination: {
          ...params.pagination,
          // total: data.total_records,
        },
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
    const { data, pagination, loading } = this.state
    return (
      <div>
        <Card title="Search" size="small">
          <Table
            columns={columns}
            rowKey={record => record.kode_product}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}
            size="small"
          />
        </Card>
      </div>
    )
  }
}

export default DataCustomer
