import React from 'react'
import { Input, Form, Table, Button, Space, Card } from 'antd'
import * as product from 'services/product'
import { EditOutlined } from '@ant-design/icons'
import { history } from 'index'

class DataProduct extends React.Component {
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
      render: record => (
        <Space size="middle">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => this.routeChangeEdit(record.kode_product)}
          />
        </Space>
      ),
    },
  ]

  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 110,
    },
    namaProduct: '',
    loading: false,
  }

  componentDidMount() {
    const { pagination } = this.state
    this.fetch({ pagination })
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
    console.log(params)
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
    this.setState({ namaProduct: values.nama_product, pagination: { current: 1, pageSize: 5 } })
    const { pagination } = this.state
    this.fetch({ pagination })
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  routeChangeInput = () => {
    const path = '/product/new'
    history.push(path)
  }

  routeChangeEdit = productCode => {
    const path = '/product/edit'
    history.push({ pathname: path, state: { data: productCode } })
    // console.log(JSON.stringify(record))
    // localStorage.setItem('dataRecord', JSON.stringify(record))
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
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    onClick={this.routeChangeInput}
                  >
                    Add Product
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
            onClick
            size="small"
          />
        </Card>
      </div>
    )
  }
}

export default DataProduct
