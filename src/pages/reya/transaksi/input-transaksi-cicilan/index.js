import React from 'react'
import moment from 'moment'
import { Input, Form, Button, Card, Select, Table, Space, notification, InputNumber } from 'antd'
import * as transaksi from 'services/transaksi'
import { history } from 'index'

const { Option } = Select

class InputTransaksiCicilan extends React.Component {
  formRef = React.createRef()

  formRef2 = React.createRef()

  currentDate = moment().format('YYYY-MM-DD')

  columnsPelanggan = [
    {
      title: 'ID Pelanggan',
      dataIndex: 'customerId',
      key: 'customerId',
      width: '15%',
    },
    {
      title: 'Nama Pelanggan',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '15%',
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'jenisKelamin',
      key: 'jenisKelamin',
      width: '15%',
      render: jenisKelamin => this.parseJenisKelamin(jenisKelamin),
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

  columnsBarangGadai = [
    {
      title: 'No',
      dataIndex: 'noBarang',
      key: 'noBarang',
      width: '15%',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      key: 'namaBarang',
      width: '15%',
    },
    {
      title: 'Kondisi',
      dataIndex: 'deskripsiBarang',
      key: 'deskripsiBarang',
      width: '15%',
    },
    {
      title: 'Jlh Barang',
      dataIndex: 'jlhBrg',
      key: 'jlhBrg',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Harga Per Satuan',
      dataIndex: 'harga',
      key: 'harga',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: '15%',
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
            shape="square"
            size="small"
            onClick={() => this.hapusBarang(record)}
          >
            -
          </Button>
        </Space>
      ),
    },
  ]

  state = {
    dataPelanggan: [],
    dataProduk: [],
    dataBarang: [],
    customerId: '',
    productId: '',
    totalNilaiTaksiran: 0,
    diskonAdmBuka: 0,
    nilaiPencairanPelanggan: 0,
    transaksiButton: true,
    loadingCustomer: false,
  }

  componentDidMount() {
    this.fetchProduk()
    this.formRef.current.setFieldsValue({
      tglTransaksi: this.currentDate,
    })
    this.formRef2.current.setFieldsValue({
      tglTransaksi: this.currentDate,
      totalNilaiTaksiran: 0,
      discBiayaAdm: 0,
      nilaiPencairan: 0,
    })
  }

  parseJenisKelamin = jenisKelamin => {
    let stringJenisKelamin = ''
    if (jenisKelamin === 'P') {
      stringJenisKelamin = 'Pria'
    } else {
      stringJenisKelamin = 'Wanita'
    }
    return stringJenisKelamin
  }

  fetchProduk = () => {
    transaksi.doGetProduk().then(data => {
      console.log(data)
      this.setState({
        dataProduk: data.responseData,
      })
    })
  }

  fetchPelanggan = dataPelanggan => {
    this.setState({ loadingCustomer: true })
    transaksi.doGetCustomer2(dataPelanggan).then(data => {
      console.log(data)
      this.setState({
        loadingCustomer: false,
        dataPelanggan: data.responseData,
      })
    })
  }

  onFinish = values => {
    console.log(values)
    this.fetchPelanggan(values)
  }

  onFinish2 = values => {
    const { dataBarang, totalNilaiTaksiran } = this.state
    values.noBarang = dataBarang.length + 1
    values.total = values.jlhBrg * values.harga
    const totalBar = totalNilaiTaksiran + values.jlhBrg * values.harga

    this.setState(prevState => ({
      dataBarang: [...prevState.dataBarang, values],
      totalNilaiTaksiran: totalBar,
    }))

    this.formRef2.current.setFieldsValue({
      totalNilaiTaksiran: totalBar,
    })
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  setProduk = namaProduk => {
    const { dataProduk } = this.state
    const found = dataProduk.map(k => k.produkName).indexOf(namaProduk)
    this.formRef.current.setFieldsValue({
      produkName: dataProduk[found].produkName,
      produkDesc: dataProduk[found].produkDesc,
    })
    this.formRef2.current.setFieldsValue({
      tglJatuhTempo: moment()
        .add(dataProduk[found].jangkaWaktu, 'M')
        .format('YYYY-MM-DD'),
      ltv: dataProduk[found].ltv,
      tipeAdminBuka: dataProduk[found].tipeAdminBuka,
      biayaAdminBuka: dataProduk[found].biayaAdminBuka,
      jangkaWaktu: dataProduk[found].jangkaWaktu,
      biayaJasaPenyimpanan: dataProduk[found].biayaJasaPenyimpanan,
      periodeJasaPenyimpanan: dataProduk[found].periodeJasaPenyimpanan,
      tipeAdminTutup: dataProduk[found].tipeAdminTutup,
      biayaAdminTutup: dataProduk[found].biayaAdminTutup,
    })
    this.setState({
      productId: dataProduk[found].produkId,
    })
  }

  hapusBarang = barang => {
    const { dataBarang, totalNilaiTaksiran } = this.state
    const dataBaru = dataBarang.filter(indexBarang => indexBarang.noBarang !== barang.noBarang)
    console.log(dataBaru)
    let i = 0
    while (i < dataBaru.length) {
      if (dataBaru[i].noBarang !== i + 1) {
        dataBaru[i].noBarang = i + 1
      }
      i += 1
    }

    const nilaiBaru = totalNilaiTaksiran - barang.total

    this.setState({
      dataBarang: dataBaru,
      totalNilaiTaksiran: nilaiBaru,
    })

    this.formRef2.current.setFieldsValue({
      totalNilaiTaksiran: nilaiBaru,
    })
  }

  onClickCustomer = values => {
    this.formRef.current.setFieldsValue({
      customerId: values.customerId,
    })
    this.formRef2.current.setFieldsValue({
      maksPinjaman: values.maxLimitCustomer,
    })
    this.setState({
      customerId: values.customerId,
    })
  }

  onFinishHitung = values => {
    transaksi.doHitungTransaksi(values).then(data => {
      if (data.responseCode === '00') {
        this.formRef2.current.setFieldsValue({
          biayaAdmAkhir: data.responseData.biayaAdmAkhir,
          totalPinjaman: data.responseData.totalPinjaman,
          biayaJPperPeriode: data.responseData.biayaJPperPeriode,
          totalBiayaJp: data.responseData.totalBiayaJp,
          totalPengembalian: data.responseData.totalPengembalian,
        })

        this.setState({
          diskonAdmBuka: values.discBiayaAdm,
          nilaiPencairanPelanggan: values.nilaiPencairan,
          transaksiButton: false,
        })
        notification.success({
          message: 'Hitung berhasil!',
          description: 'Berhasil melakukan perhitungan!',
        })
      } else {
        notification.error({
          message: 'Hitung gagal!',
          description: 'Gagal melakukan perhitungan, harap hubungi teknisi',
        })
      }
    })
  }

  doSaveTransaksi = () => {
    const {
      dataBarang,
      productId,
      customerId,
      totalNilaiTaksiran,
      diskonAdmBuka,
      nilaiPencairanPelanggan,
    } = this.state
    transaksi
      .doSaveTrxCicTetap(
        dataBarang,
        productId,
        customerId,
        totalNilaiTaksiran,
        diskonAdmBuka,
        nilaiPencairanPelanggan,
      )
      .then(data => {
        console.log(data)
        if (data.responseCode === '00') {
          this.formRef.current.setFieldsValue({
            noTransaksi: data.responseData.noTransaksi,
          })
          notification.success({
            message: 'Simpan Transaksi berhasil!',
            description: 'Sudah berhasil meyimpan transaksi baru!',
          })
        } else {
          notification.error({
            message: 'Simpan Transaksi gagal!',
            description: 'Gagal menyimpan transaksi, harap hubungi teknisi',
          })
        }
      })
  }

  render() {
    const { dataPelanggan, dataProduk, dataBarang, transaksiButton, loadingCustomer } = this.state
    return (
      <div>
        <Card title="Cari Data Pelanggan" size="small">
          <Form
            layout="horizontal"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="customerId" label="ID Pelanggan" rules={[{ maxLength: 255 }]}>
                  <Input placeholder="ID Pelanggan" />
                </Form.Item>
                <Form.Item name="customerName" label="Nama Pelanggan" rules={[{ maxLength: 30 }]}>
                  <Input placeholder="Nama Pelanggan" />
                </Form.Item>
                <Form.Item name="noKtp" label="Nomor KTP" rules={[{ maxLength: 50 }]}>
                  <Input placeholder="Nomor KTP" />
                </Form.Item>
                <Form.Item name="noHp" label="Nomor HP" rules={[{ maxLength: 50 }]}>
                  <Input placeholder="Nomor HP" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <h3> Hasil Pencarian </h3>
                <Table
                  columns={this.columnsPelanggan}
                  rowKey={record => record.customerId}
                  dataSource={dataPelanggan}
                  loading={loadingCustomer}
                  pagination={{ defaultPageSize: 3 }}
                  onRow={record => ({
                    onClick: () => {
                      this.onClickCustomer(record)
                    },
                  })}
                  size="small"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5 mr-2" htmlType="submit">
                    Cari
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
        <hr />
        <Card title="Informasi Transaksi" size="small">
          <Form
            layout="horizontal"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="customerId" label="Pelanggan" rules={[{ required: true }]}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="tglTransaksi" label="Tgl Transaksi">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="noTransaksi" label="Nomor Transaksi">
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="produkId" label="Produk Transaksi" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select a option and change input text above"
                    onChange={e => this.setProduk(e)}
                  >
                    {dataProduk.map(k => (
                      <Option key={k.produkId} value={k.produkName}>
                        {k.produkId}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="produkName" label="Nama Produk">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="produkDesc" label="Keterangan Produk">
                  <Input disabled />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
        <Card title="Daftar Barang Gadai" size="small">
          <Form
            layout="vertical"
            onFinish={this.onFinish2}
            onFinishFailed={this.onFinishFailed}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <div className="row">
              <Form.Item name="noBarang" label="Nomor Barang" hidden="true">
                <Input />
              </Form.Item>
              <div className="col-md-6">
                <Form.Item name="namaBarang" label="Nama Barang" initialValue="-">
                  <Input placeholder="Nama Barang" maxLength="30" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="deskripsiBarang" label="Deskripsi Barang" initialValue="-">
                  <Input placeholder="Deskripsi Barang" maxLength="150" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="jlhBrg" label="Jumlah" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={99}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="harga" label="Harga Per Satuan" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5 mr-2" htmlType="submit">
                    +
                  </Button>
                </Form.Item>
              </div>
            </div>
            <Table
              columns={this.columnsBarangGadai}
              rowKey={record => record.noBarang}
              pagination={{ defaultPageSize: 5 }}
              dataSource={dataBarang}
              scroll={{ x: 400 }}
              size="small"
            />
          </Form>
        </Card>
        <Card title="Data Kontrak" size="small">
          <Form
            layout="horizontal"
            onFinish={this.onFinishHitung}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef2}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 20 }}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="tipeAdminBuka" hidden="true">
                  <Input />
                </Form.Item>
                <Form.Item name="tipeAdminTutup" hidden="true">
                  <Input />
                </Form.Item>
                <Form.Item name="jangkaWaktu" hidden="true">
                  <Input />
                </Form.Item>
                <Form.Item name="totalNilaiTaksiran" label="Total Nilai Taksiran">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="ltv" label="LTV %" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="maksPinjaman" label="Maksimal Nilai Pinjaman" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="nilaiPencairan"
                  label="Nilai Pencairan Pelanggan"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <Form.Item name="biayaAdminBuka" label="Biaya Admin Buka" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="discBiayaAdm"
                  label="Diskon Admin Buka"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={99999}
                    formatter={value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <Form.Item name="biayaAdmAkhir" label="Biaya Admin Akhir" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="totalPinjaman" label="Total Nilai Pinjaman" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5 mr-2" htmlType="submit">
                    Hitung
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button name="" className="btn btn-light px-5" onClick={() => history.goBack()}>
                    Back
                  </Button>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="tglJatuhTempo" label="Tanggal Jatuh Tempo">
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="biayaJasaPenyimpanan"
                  label="Biaya Jasa Penyimpanan"
                  initialValue="0"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item label="per">
                  <Form.Item name="periodeJasaPenyimpanan" initialValue="0" noStyle>
                    <InputNumber
                      style={{ width: '20%' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      disabled
                    />
                  </Form.Item>
                  <span> Bulan </span>
                </Form.Item>
                <Form.Item
                  name="biayaJPperPeriode"
                  label="Biaya Jasa Penyimpanan / Periode"
                  initialValue="0"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="totalBiayaJp"
                  label="Total Biaya Jasa Penyimpanan"
                  initialValue="0"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="biayaAdminTutup" label="Biaya Admin Tutup" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="totalPengembalian" label="Total Pengembalian" initialValue="0">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    name=""
                    type="primary"
                    className="btn btn-light px-5"
                    onClick={this.doSaveTransaksi}
                    disabled={transaksiButton}
                  >
                    Simpan Transaksi
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    )
  }
}

export default InputTransaksiCicilan
