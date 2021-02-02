import React, { Component } from 'react'
import { Card, Form, Table, Input, Select, Button, Space } from 'antd'
import { withRouter } from 'react-router-dom'
import * as trx from 'services/transaction'
import Moment from 'moment'


const { Option } = Select

class CicilanTetapBaru extends Component {
  fileList = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'error',
    },
  ];

  columns = [
    {
      title: "No",
      dataIndex:"no",
      key:"no",
      render:(text, record, index)=>(
        <Space size="middle">
          <a>{index+1}</a>
        </Space>
      )
    },
    {
      title: "Nama Barang",
      dataIndex:"nama_barang"
    },
    {
      title: "Kondisi",
      dataIndex:"kondisi"
    },
    {
      title: "Jumlah Barang",
      dataIndex:"jumlah_barang"
    },
    {
      title: "Harga Per Satuan",
      dataIndex: "harga_per_satuan",
      align: "right"
    },
    {
      title: "Total",
      dataIndex: "total",
      align: "right"
    },
    {
      title: "Action",
      render: (text, record, index) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => this.onDelete(index)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ]

  customerColumns = [
    {
      title: "ID Pelanggan",
      dataIndex: "customerId"
    },
    {
      title: "Nama Pelanggan",
      dataIndex: "customerName"
    },
    {
      title: "Nomor KTP",
      dataIndex: "noKtp"
    },
    {
      title: "Nomor HP",
      dataIndex: "noHp"
    }
  ]
  
  formRef = React.createRef()

  formRefDataKontrak = React.createRef()

  state = {
    totalNilaiTaksiran:0,
    productId:'',
    nilaiPencairan:0,
    discBiayaAdmin: 0,
    customerId: '',
    daftarBarang: [],
    loading: false,
    loadingTableDBG: false,
    dataSearchPelanggan:[],
    dataSource: [],
    count: 1,
    pagination: {
      current: 1,
      pageSize: 20,
    },
    paginationDBG: {
      current: 1,
      pageSize: 20,
    },
  }

  componentDidMount(){
    this.formRef.current.setFieldsValue({
      tgl_transaksi: Moment(Date()).format("yyyy-MM-DD"),
    })
  }

  onAdd = (values) => {
    const { count, dataSource, paginationDBG,daftarBarang } = this.state;
    const newData = {
      no: count,
      nama_barang: values.nama_barang,
      harga_per_satuan: values.harga_per_satuan,
      kondisi: values.kondisi,
      jumlah_barang: values.jumlah_barang,
      total: values.harga_per_satuan * values.jumlah_barang
    };
    const newData2 = {
      noBarang: count,
      namaBarang: values.nama_barang,
      harga: values.harga_per_satuan,
      deskripsiBarang: values.kondisi,
      jlhBarang: values.jumlah_barang,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count+1,
      daftarBarang: [...daftarBarang, newData2],
      paginationDBG: {
        ...paginationDBG,
        total: dataSource.length
      }
    },()=>{this.count()}
    );
  }

  count = () =>{
    const { dataSource } = this.state
    let totalNilaiTaksiran = 0
    for(let x =0; x < dataSource.length; x+=1){
      totalNilaiTaksiran += dataSource[x].total
    }
    this.setState({
      totalNilaiTaksiran
    },()=>{
      this.formRefDataKontrak.current.setFieldsValue({
        total_nilai_taksiran: totalNilaiTaksiran,
      })
    })
  }

  onDelete = values => {
    const { dataSource, paginationDBG, daftarBarang } = this.state
    console.log(values)
    dataSource.splice(values, 1)
    daftarBarang.splice(values, 1)
    this.setState({
      dataSource: dataSource.filter((item) => item.values !== values),
      paginationDBG: {
        ...paginationDBG,
        total: dataSource.length
      }
    })

  }

  countTrx = values =>{
    const { productId, totalNilaiTaksiran } = this.state
    trx.doCountTrx(productId, values, totalNilaiTaksiran).then(dataResponse => {
      // console.log(dataResponse.biayaJasaPenyimpanan)
      this.setState({
        loading: false,
        nilaiPencairan: values.nilai_pencairan_pelanggan,
        discBiayaAdmin: values.diskon_adm_buka,
      },
      ()=>{
        this.formRefDataKontrak.current.setFieldsValue({
          ltv:dataResponse.ltv,
          maksimal_nilai_pinjaman: dataResponse.maksPinjaman,
          biaya_admin_buka: dataResponse.biayaAdminBuka,
          biaya_admin_akhir:dataResponse.biayaAdmAkhir,
          total_nilai_pinjaman:dataResponse.totalPinjaman,
          tanggal_transaksi:dataResponse.tglTransaksi,
          tanggal_jatuh_tempo:dataResponse.tglJatuhTempo,
          biaya_jasa_penyimpanan:dataResponse.biayaJasaPenyimpanan,
          per:dataResponse.periodeJasaPenyimpanan,
          biaya_jasa_penyimpanan_periode:dataResponse.biayaJasaPenyimpananPeriode,
          total_biaya_jasa_penyimpanan:dataResponse.totalBiayaJp,
          biaya_admin_tutup: dataResponse.biayaAdminTutup,
          total_pengembalian: dataResponse.totalPengembalian,
        })
      },)
    })
  }

  save = () => {
    const { productId, totalNilaiTaksiran, nilaiPencairan, discBiayaAdmin, customerId, daftarBarang } = this.state
    trx.doSaveTrx(productId, totalNilaiTaksiran, nilaiPencairan, discBiayaAdmin, customerId, daftarBarang).then(dataResponse => {
      console.log(dataResponse)
    })
  }

  search = searchParameter => {    
    trx.doSearchPelanggan(searchParameter).then(dataResponse => {
      this.setState({
        dataSearchPelanggan: dataResponse
      })
    })
  }

  selectProduct = value =>{
    trx.doGetProduk({'produkId':value}).then(dataResponse => {
      this.setState({
        loading: false,
        productId: dataResponse[0].produkId
      },
      ()=>{
        this.formRef.current.setFieldsValue({
          nama_produk: dataResponse[0].produkName,
          keterangan_produk: dataResponse[0].produkDesc,
        })
      },)
      
    })
  }

  onClickCustomer = value => {
    this.setState({
      customerId: value.customerId
    },()=>{
      this.formRef.current.setFieldsValue({
        pelanggan: value.customerId,
      })
    })
  }

  onFinishSearch = values => {
    const searchParameter = {}
    for(let x = 0; x < Object.keys(values).length; x+=1){
      if(values[Object.keys(values)[x]] !== undefined){
        searchParameter[Object.keys(values)[x]] = values[Object.keys(values)[x]]
      }
    }
    this.search(searchParameter)
  }

  onFinishFailedSearch = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  onFinishDBG = values => {
    this.onAdd(values)
  }

  onFinishFailedDBG= errorInfo => {
    console.log('Failed:', errorInfo)
  }

  onFinishDataKontrak = values => {
    this.countTrx(values)
  }

  onFinishFailedDataKontrak = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  render() {
    const { dataSource, dataSearchPelanggan, pagination, paginationDBG, loading, loadingTableDBG } = this.state
    return (
      <div>
        <Card title="Transaksi Cicilan Tetap - Transaksi Baru" size="small">
          <div className="row">
            <div className="col-md-6">
              <Card title="Cari Data Pelanggan" size="small">
                <Form
                  layout="vertical"
                  onFinish={this.onFinishSearch}
                  onFinishFailed={this.onFinishFailedSearch}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item name="customerId" label="ID Pelanggan">
                        <Input />
                      </Form.Item>
                      <Form.Item name="customerName" label="Nama Pelanggan">
                        <Input />
                      </Form.Item>
                      <Form.Item name="noKtp" label="Nomor KTP">
                        <Input />
                      </Form.Item>
                      <Form.Item name="noHp" label="Nomor HP">
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Cari
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </Card>
            </div>
            <div className="col-md-6">
              <Card title="Hasil Pencarian" size="small">
                <Form
                  layout="vertical"
                >
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item>
                        <Table
                          onRow={(record) =>{
                            return{
                              onClick: () => {
                                this.onClickCustomer(record)
                              }
                            }
                          }}
                          columns={this.customerColumns}
                          rowKey={record => record.customerId}
                          dataSource={dataSearchPelanggan}
                          pagination={pagination}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </Card>
            </div>
          </div>
          
          <br />
          <Card title="Informasi Transaksi" size="small" loading={loading}>
            <Form
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-md-6">
                  <Form.Item name="pelanggan" label="Pelanggan">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="tgl_transaksi" label="Tgl Transaksi">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="nomor_transaksi" label="Nomor Transaksi">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item name="produk_transaksi" label="Produk Transaksi">
                    <Select style={{ width: 250 }} onSelect={this.selectProduct}>
                      <Option value="CFR">CFR</Option>
                      <Option value="CTR12">CTR12</Option>
                      <Option value="CTR6">CTR6</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="nama_produk" label="Nama Produk">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="keterangan_produk" label="Keterangan Produk">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Card>
          <br />
          <Card title="Daftar Barang Gadai" size="small">
            <Form layout="horizontal" onFinish={this.onFinishDBG}>
              <div className="row">
                <Form.Item name="nama_barang" label="Nama Barang" labelAlign="top">
                  <Input maxLength={50} />
                </Form.Item>
                <Form.Item name="kondisi" label="Deskripsi">
                  <Input type="textarea" />
                </Form.Item>
                <Form.Item name="jumlah_barang" label="Jumlah">
                  <Input pattern="[0-9]*" title="Masukkan hanya boleh diisi angka [0-9]" />
                </Form.Item>
                <Form.Item name="harga_per_satuan" label="Harga Per Satuan">
                  <Input pattern="[0-9]*" title="Masukkan hanya boleh diisi angka [0-9]" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">+</Button>
                </Form.Item>
              </div>
            </Form> 
            <Table 
              loading={loadingTableDBG}
              columns={this.columns}
              dataSource={dataSource}
              rowKey={record=>record.no}
              pagination={paginationDBG}
              // onChange={this.onChangeDBG}
            />
          </Card>
          <br />
          <Card title="Data Kontrak" size="small">
            <Form
              layout="vertical"
              onFinish={this.onFinishDataKontrak}
              onFinishFailed={this.onFinishFailedDataKontrak}
              ref={this.formRefDataKontrak}
            >
              <div className="row">
                <div className="col-md-6">
                  <Form.Item name="total_nilai_taksiran" label="Total Nilai Taksiran">
                    <Input disabled style={{ width: 250 }} />
                  </Form.Item>
                  <Form.Item name="ltv" label="LTV %">
                    <Input disabled style={{ width: 80 }} />
                  </Form.Item>
                  <Form.Item name="maksimal_nilai_pinjaman" label="Maksimal Nilai Pinjaman">
                    <Input disabled style={{ width: 250 }} />
                  </Form.Item>
                  <Form.Item name="nilai_pencairan_pelanggan" label="Nilai Pencairan Pelanggan">
                    <Input style={{ width: 250 }} pattern="[0-9]*" title="Masukkan hanya boleh diisi angka [0-9]" />
                  </Form.Item>
                  <Form.Item name="biaya_admin_buka" label="Biaya Admin Buka">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="diskon_adm_buka" label="Diskon Adm. Buka">
                    <Input style={{ width: 80 }} pattern="[0-9]*" title="Masukkan hanya boleh diisi angka [0-9]" />
                  </Form.Item>
                  <Form.Item name="biaya_admin_akhir" label="Biaya Admin Akhir">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="total_nilai_pinjaman" label="Total Nilai Pinjaman">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item name="tanggal_transaksi" label="Tanggal Transaksi">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="tanggal_jatuh_tempo" label="Tanggal Jatuh Tempo">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item name="biaya_jasa_penyimpanan" label="Biaya Jasa Penyimpanan (%)">
                        <Input style={{ width: 80 }} disabled />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item name="per" label="per (bulan)">
                        <Input style={{ width: 80 }} disabled />
                      </Form.Item>
                    </div>
                  </div>
                  <Form.Item name="biaya_jasa_penyimpanan_periode" label="Biaya Jasa Penyimpanan/Periode">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="total_biaya_jasa_penyimpanan" label="Total Biaya Jasa Penyimpanan">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="biaya_admin_tutup" label="Biaya Admin Tutup">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                  <Form.Item name="total_pengembalian" label="Total Pengembalian">
                    <Input style={{ width: 250 }} disabled />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Form.Item>
                    <Button type="primary" className="btn btn-light px-5 mr-2">
                      Kembali
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="btn btn-light px-5 mr-2"
                    >
                      Hitung
                    </Button>
                    <Button
                      type="primary"
                      className="btn btn-light px-5 mr-2"
                      onClick={this.save}
                    >
                      Simpan
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Card>
        </Card>
      </div>
    )
  }
}

export default withRouter(CicilanTetapBaru)
