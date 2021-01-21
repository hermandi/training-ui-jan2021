import React, { Component } from 'react'
import { Input, Form, Table, Button, Space, Card } from 'antd'
import * as product from 'services/product'
import { EditOutlined } from '@ant-design/icons'
import { history } from 'index'

class DataProduct extends Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    namaProduct: '',
    loading: false,
  }

  columns = [
    {
      title: 'Kode Product',
      dataIndex: 'kode_product',
      key: 'kodeProduct',
      sorter: true,
      width: '15%',
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
      align: 'right',
      sorter: true,
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      width: '10%',
    },
    {
      title: 'Action',
      align: 'center',
      key: 'action',
      width: '5%',
      render: text => (
        <Space size="middle">
          <Button
            onClick={() => this.edit(text.kode_product)}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            size="small"
          />
        </Space>
      ),
    },
  ]

  constructor(props) {
    super(props)
    console.log(this.props)
  }

  componentDidMount() {
    console.log(history)
    const { pagination } = this.state
    this.fetch({ pagination })
  }

  edit = kodeProduct => {
    const path = `/product/edit/${kodeProduct}`
    history.push({ pathname: path, state: { kodeProduct } })
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
    const { namaProduct } = this.state
    this.setState({ loading: true })
    product
      .doSearchProduct(
        namaProduct,
        params.pagination.current,
        params.pagination.pageSize,
        params.sortField,
      )
      .then(data => {
        console.log(data)
        this.setState({
          loading: false,
          data: data.data_product,
          pagination: {
            ...params.pagination,
            total: data.total_records,
          },
        })
      })
  }

  onFinish = values => {
    console.log(this.props)
    this.setState({ namaProduct: values.nama_product, pagination: { current: 1, pageSize: 5 } })
    const { pagination } = this.state
    this.fetch({ pagination })
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  routeChange = () => {
    const path = '/product/new'
    history.push(path)
  }

  render() {
    const { data, pagination, loading } = this.state
    return (
      <div>
        <Card title="Search" size="small">
          <Form layout="horizontal" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="nama_product" label="Nama Product">
                  <Input placeholder="Nama Product" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5 mr-2" htmlType="submit">
                    Search
                  </Button>
                  <Button type="primary" className="btn btn-light px-5" onClick={this.routeChange}>
                    Add New Product
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          <Table
            columns={this.columns}
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

export default DataProduct
