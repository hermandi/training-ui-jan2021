import React from 'react'
import { Card, Form, Input, Table, Button } from 'antd'

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    width: '15%',
  },
  {
    title: 'Product Name',
    dataIndex: 'product_name',
    key: 'productName',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    sorter: true,
  },
  {
    title: 'Report Date',
    dataIndex: 'report_date',
    key: 'reportDate',
    sorter: true,
  },
  {
    title: 'Sold Quantity',
    dataIndex: 'sold_quantity',
    key: 'soldQuantity',
    sorter: true,
    width: '15%',
  },
]

class ReportingProduct extends React.Component {
  state = {
    productName: '',
  }

  onFinish = values => {
    console.log(values)
    this.setState({ productName: values.product_name })
    const { productName } = this.state
    console.log({ productName })
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  render() {
    return (
      <div>
        <Card title="Reporting Product" size="medium">
          <p>Search by: </p>
          <Form layout="horizontal" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="product_name" label="Product Name">
                  <Input placeholder="Product Name" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="price" label="Price">
                  <Input placeholder="Rp." />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="report_date" label="Report Date">
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item name="sold_quantity" label="Sold Quantity">
                  <Input placeholder="Qty" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5 mr-2" htmlType="submit">
                    Search
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          <Table columns={columns} />
        </Card>
      </div>
    )
  }
}

export default ReportingProduct
