import { Button, Card, Form, Input, Table } from 'antd'
import React, { Component } from 'react'

const tableColumns = [
  {
    title: 'Kode Product',
    dataIndex: 'kode_product',
    key: 'kodeProduct',
    width: '15%',
    sorter: true,
  },
  {
    title: 'Nama Product',
    dataIndex: 'nama_product',
    key: 'namaProduct',
    sorter: true,
  },
  {
    title: 'Harga',
    dataIndex: 'harga',
    key: 'harga',
    width: '15%',
    sorter: true,
  },
  {
    title: 'Satuan',
    dataIndex: 'satuan',
    key: 'satuan',
    width: '15%',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: '5%',
  },
]

class DataProductTest extends Component {
  // init default state data
  state = {
    // namaProduct: "",
    // pagination: {
    //   current: 1,
    //   pageSize: 110
    // },
    data: [],
    loading: false,
  }

  // method react component lifecycle, auto jalan ketika component udah di mount
  componentDidMount() {
    console.log('halohalobandung')
  }

  onFinishForm = values => {
    console.log(JSON.stringify(values))
  }

  onChangeTable = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
  }

  // fetchDataFromSource = (params = {})=> { // params={} default empty object

  // }

  render() {
    const { data, loading } = this.state
    return (
      <Card title="Search Product" size="normal">
        <Form onFinish={this.onFinishForm}>
          <Form.Item name="nama_product" label="Nama Product">
            <Input placeholder="Nama Product" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="px-5">
              Search
            </Button>
          </Form.Item>
        </Form>
        <Table
          size="small"
          columns={tableColumns}
          dataSource={data}
          loading={loading}
          onChange={this.onChangeTable}
        />
      </Card>
    )
  }
}

export default DataProductTest
