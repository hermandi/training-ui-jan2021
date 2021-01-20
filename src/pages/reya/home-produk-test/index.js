import React from 'react'
import { Card, Table, Form, Input, Button } from 'antd'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const dataSource = [
  {
    nama_pelanggan: 'Budi',
    umur: 20,
    alamat: 'Rumah',
  },
  {
    nama_pelanggan: 'Andi',
    umur: 25,
    alamat: 'Rumah-1',
  },
]

const columns = [
  {
    title: 'Nama Pelanggan',
    dataIndex: 'nama_pelanggan',
    key: 'namaPelanggan',
    sorter: true,
  },
  {
    title: 'Umur',
    dataIndex: 'umur',
    key: 'umur',
    sorter: true,
  },
  {
    title: 'Alamat',
    dataIndex: 'alamat',
    key: 'alamat',
    sorter: true,
  },
]

class DataProductNew extends React.Component {
  componentDidMount() {}

  onFinish = values => {
    console.log(values)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  render() {
    return (
      <div>
        <Card title="Search" size="small">
          <Form
            {...layout}
            layout="horizontal"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  name="nama_pelanggan"
                  label="Nama Pelanggan"
                  rules={[{ required: true, message: 'Masukkan nama!' }]}
                >
                  <Input placeholder="Nama Pelanggan" />
                </Form.Item>
                <Form.Item
                  name="umur"
                  label="Umur"
                  rules={[{ required: true, message: 'Masukkan umur!' }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="alamat"
                  label="Alamat"
                  rules={[{ required: true, message: 'Masukkan alamat!' }]}
                >
                  <Input placeholder="Alamat" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5 mr-2" htmlType="submit">
                    Search
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          <Table
            columns={columns}
            dataSource={dataSource}
            onChange={this.handleTableChange}
            size="small"
          />
        </Card>
      </div>
    )
  }
}

export default DataProductNew
