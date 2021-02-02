import { Button, Card, Form, Input, InputNumber, Select, Space, Table, notification } from 'antd'
import React, { Component } from 'react'
import * as pelangganService from 'services/gadai/pelanggan'
import * as produkService from 'services/gadai/produk'
import moment from 'moment'
import { DeleteOutlined } from '@ant-design/icons'
import * as txCicilanTetapService from 'services/gadai/transaksi/cicilan-tetap'
import { history } from 'index'

const { Option } = Select

class BaruTransaksiCicTetap extends Component {
  informasiTransaksiRef = React.createRef()

  dataKontrakRef = React.createRef()

  daftarBarangGadaiRef = React.createRef()

  state = {
    loadingCariPelanggan: false,
    loadingSave: false,
    simpanDisable: true,
    hitungDisable: false,

    dataProduk: [],
    cariPelangganData: [],
    daftarBarangGadai: [],
    nilaiPencairanPelanggan: 0,
    diskonAdmBuka: 0,
    totalNilaiTaksiran: 0,
    productId: '',
    custId: '',
    actorId: 'user1', // hard code userId
  }

  constructor(props) {
    super(props)
    this.fetchProduk()
  }

  componentDidMount() {
    this.informasiTransaksiRef.current.setFieldsValue({
      tglTransaksi: moment().format('YYYY-MM-DD'),
    })
  }

  inputNumberFormatter = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  inputPercentFormatter = value => `${value}%`

  cariPelanggan = data => {
    const { actorId } = this.state
    this.setState({ loadingCariPelanggan: true })

    data.actorId = actorId
    pelangganService.doSearchPelanggan(data).then(result => {
      this.setState({
        loadingCariPelanggan: false,
        cariPelangganData: result.responseData,
      })
    })
  }

  tambahBarang = data => {
    const { daftarBarangGadai } = this.state

    const jlh = data.jlh || 0
    const hargaPerSatuan = data.hargaPerSatuan || 0
    const kondisi = data.kondisi || '-'
    const no = daftarBarangGadai.length + 1
    const total = jlh * hargaPerSatuan

    const listBarangBaru = [...daftarBarangGadai] // jangan push direct ke listBarang

    if (data.namaBarang === undefined) {
      notification.error({
        message: 'Nama Barang Kosong',
      })
    } else {
      listBarangBaru.push({
        no,
        namaBarang: data.namaBarang,
        kondisi,
        jlh,
        hargaPerSatuan,
        total,
      })

      let totalNilaiTaksiran = 0
      listBarangBaru.forEach(value => {
        totalNilaiTaksiran += value.total
      })
      this.dataKontrakRef.current.setFieldsValue({
        totalNilaiTaksiran: this.inputNumberFormatter(totalNilaiTaksiran),
      })
      this.setState({ daftarBarangGadai: listBarangBaru, totalNilaiTaksiran })
    }
  }

  onKosongkanBarangGadai = () => {
    this.daftarBarangGadaiRef.current.resetFields()
  }

  onActionDeleteBarang = no => {
    const { daftarBarangGadai } = this.state
    const listBarangBaru = daftarBarangGadai.filter(value => value.no !== no)
    let numbering = 1
    listBarangBaru.forEach(value => {
      value.no = numbering
      numbering += 1
    })

    let totalNilaiTaksiran = 0
    listBarangBaru.forEach(value => {
      totalNilaiTaksiran += value.total
    })
    this.dataKontrakRef.current.setFieldsValue({
      totalNilaiTaksiran,
    })

    this.setState({ daftarBarangGadai: listBarangBaru, totalNilaiTaksiran })
  }

  fetchProduk = () => {
    const data = []
    const { actorId } = this.state
    data.actorId = actorId
    produkService.doGetListProduk(data).then(result => {
      this.setState({ dataProduk: result.responseData })
    })
  }

  onProdukSelect = value => {
    const { dataProduk: listProduk } = this.state
    const index = listProduk.findIndex(item => item.produkId === value)
    this.setState({ productId: listProduk[index].produkId })
    this.informasiTransaksiRef.current.setFieldsValue({
      namaProduk: listProduk[index].produkName,
      ketProduk: listProduk[index].produkDesc || '-',
    })
  }

  tabelPelangganOnRow = record => {
    return {
      onClick: () => {
        console.log(record)
        this.setState({ custId: record.customerId })
        this.informasiTransaksiRef.current.setFieldsValue({
          custId: record.customerId,
        })
      },
    }
  }

  dataKontrakHitung = data => {
    const { totalNilaiTaksiran, productId, actorId } = this.state

    const dataHitung = {
      productId,
      totalNilaiTaksiran,
      nilaiPencairanPelanggan: data.nilaiPencairanPelanggan || 0,
      diskonAdmBuka: data.diskonAdmBuka || 0,
      actorId,
    }

    console.log(dataHitung)
    txCicilanTetapService.doHitungTrxCicTetap(dataHitung).then(result => {
      const { responseData } = result
      console.log(result)
      if (result.responseCode === '00') {
        this.dataKontrakRef.current.setFieldsValue({
          ltv: this.inputPercentFormatter(responseData.ltv),
          maksPinjaman: this.inputNumberFormatter(responseData.maksPinjaman),
          nilaiPencairanPelanggan: responseData.nilaiPencairanPelanggan,
          biayaAdminBuka: this.inputNumberFormatter(responseData.biayaAdminBuka),
          diskonAdmBuka: responseData.discBiayaAdm,
          biayaAdmAkhir: this.inputNumberFormatter(responseData.biayaAdmAkhir),
          totalPinjaman: this.inputNumberFormatter(responseData.totalPinjaman),
          tglTransaksi: responseData.tglTransaksi,
          tglJatuhTempo: responseData.tglJatuhTempo,
          biayaJasaPenyimpanan: this.inputPercentFormatter(responseData.biayaJasaPenyimpanan),
          periodeJasaPenyimpanan: responseData.periodeJasaPenyimpanan,
          biayaJasaPenyimpananPerPeriode: this.inputNumberFormatter(
            responseData.biayaJasaPenyimpananPerPeriode,
          ),
          totalBiayaJp: this.inputNumberFormatter(responseData.totalBiayaJp),
          biayaAdminTutup: this.inputNumberFormatter(responseData.biayaAdminTutup),
          totalPengembalian: this.inputNumberFormatter(responseData.totalPengembalian),
        })
        this.setState({
          nilaiPencairanPelanggan: responseData.nilaiPencairanPelanggan,
          diskonAdmBuka: responseData.discBiayaAdm,
          simpanDisable: false,
        })
      } else {
        notification.error({
          message: result.responseMessage,
          description: result.responseDescription,
        })
      }
    })
  }

  simpanTransaksiBaru = () => {
    this.setState({ loadingSave: true })

    const {
      daftarBarangGadai,
      totalNilaiTaksiran,
      nilaiPencairanPelanggan,
      diskonAdmBuka,
      productId,
      custId,
      actorId,
    } = this.state

    const dataSimpan = {
      daftarBarangGadai,
      totalNilaiTaksiran,
      nilaiPencairanPelanggan,
      diskonAdmBuka,
      productId,
      custId,
      actorId,
    }

    if (daftarBarangGadai.length === 0) {
      notification.error({
        message: 'Barang Gadai Kosong',
      })
      this.setState({ loadingSave: false })
    } else {
      txCicilanTetapService.doSaveTrxCicTetap(dataSimpan).then(result => {
        this.setState({ loadingSave: false })
        console.log(result)
        if (result.responseCode === '00') {
          notification.success({
            message: result.responseMessage,
            duration: 0,
          })
          this.informasiTransaksiRef.current.setFieldsValue({
            noTransaksi: result.responseData.noTransaksi,
          })
          this.setState({ simpanDisable: true, hitungDisable: true })
        } else {
          notification.error({
            message: result.responseMessage,
            description: result.responseDescription,
          })
        }
      })
    }
  }

  render() {
    const {
      loadingCariPelanggan,
      loadingSave,
      simpanDisable,
      hitungDisable,
      cariPelangganData,
      dataProduk,
      daftarBarangGadai,
    } = this.state

    const tabelPelangganColumns = [
      {
        title: 'ID Pelanggan',
        dataIndex: 'customerId',
        key: 'idPelanggan',
      },
      {
        title: 'Nomor KTP',
        dataIndex: 'noKtp',
        key: 'noKtp',
      },
      {
        title: 'Nomor HP',
        dataIndex: 'noHp',
        key: 'noHp',
      },
      {
        title: 'Nama Pelanggan',
        dataIndex: 'customerName',
        key: 'namaPelanggan',
      },
    ]

    const tabelBarangColumns = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '5%',
      },
      {
        title: 'Nama Barang',
        dataIndex: 'namaBarang',
        key: 'namaBarang',
        width: '20%',
      },
      {
        title: 'Kondisi',
        dataIndex: 'kondisi',
        key: 'kondisi',
      },
      {
        title: 'Jumlah',
        dataIndex: 'jlh',
        key: 'jumlah',
        width: '5%',
      },
      {
        title: 'Harga Per Satuan',
        dataIndex: 'hargaPerSatuan',
        key: 'hargaPerSatuan',
        textWrap: 'word-break',
        width: '20%',
        render: text => <div>{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>,
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        textWrap: 'word-break',
        width: '20%',
        render: text => <div>{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>,
      },
      {
        title: 'Action',
        key: 'action',
        width: '10%',
        render: record => (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => this.onActionDeleteBarang(record.no)}
              size="small"
            />
          </Space>
        ),
      },
    ]

    const inputReadonlyStyle = {
      backgroundColor: 'rgb(230, 230, 230)',
      width: '100%',
    }

    return (
      <div>
        <h3>Transaksi Cicilan Tetap - Transaksi Baru</h3>
        <Card size="small" title="Cari Data Pelanggan">
          <div className="row">
            <div className="col-lg-4">
              <Form layout="horizontal" onFinish={this.cariPelanggan}>
                <Form.Item name="custId" label="ID Pelanggan">
                  <Input placeholder="ID Pelanggan" maxLength={10} />
                </Form.Item>
                <Form.Item name="custName" label="Nama Pelanggan">
                  <Input placeholder="Nama Pelanggan" maxLength={30} />
                </Form.Item>
                <Form.Item name="custKtp" label="Nomor KTP">
                  <Input placeholder="Nomor KTP" maxLength={255} />
                </Form.Item>
                <Form.Item name="custHp" label="Nomor HP">
                  <Input placeholder="Nomor HP" maxLength={50} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2 float-right"
                    htmlType="submit"
                    loading={loadingCariPelanggan}
                  >
                    Cari
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="col-lg-8">
              <Table
                columns={tabelPelangganColumns}
                size="small"
                dataSource={cariPelangganData}
                rowKey={record => record.customerId}
                onRow={this.tabelPelangganOnRow}
                pagination={{ defaultPageSize: 6 }}
              />
            </div>
          </div>
        </Card>
        <br />
        <Card size="small" title="Informasi Transaksi">
          <Form layout="vertical" ref={this.informasiTransaksiRef}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="custId" label="ID Pelanggan">
                  <Input placeholder="ID Pelanggan" style={inputReadonlyStyle} readOnly />
                </Form.Item>
                <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                  <Input
                    placeholder="Tanggal Transaksi"
                    className="inputReadOnly"
                    style={inputReadonlyStyle}
                    readOnly
                  />
                </Form.Item>
                <Form.Item name="noTransaksi" label="Nomor Transaksi">
                  <Input placeholder="Nomor Transaksi" style={inputReadonlyStyle} readOnly />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="productId" label="Produk Transaksi">
                  <Select placeholder="Select Produk" onSelect={this.onProdukSelect}>
                    {dataProduk.map(k => (
                      <Option key={k.produkId} value={k.produkId}>
                        {k.produkId}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="namaProduk" label="Nama Produk">
                  <Input placeholder="Nama Produk" style={inputReadonlyStyle} readOnly />
                </Form.Item>
                <Form.Item name="ketProduk" label="Keterangan Produk">
                  <Input.TextArea
                    placeholder="Keterangan Produk"
                    rows="1"
                    style={inputReadonlyStyle}
                    readOnly
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
        <br />
        <Card size="small" title="Daftar Barang Gadai">
          <Form layout="inline" onFinish={this.tambahBarang} ref={this.daftarBarangGadaiRef}>
            <Form.Item name="namaBarang" label="Nama Barang">
              <Input placeholder="Nama Barang" maxLength={30} />
            </Form.Item>
            <Form.Item name="kondisi" label="Deskripsi">
              <Input.TextArea cols="30" rows="1" placeholder="Kondisi" maxLength={150} />
            </Form.Item>
            <Form.Item name="jlh" label="Jumlah">
              <InputNumber style={{ width: '100%' }} min={0} max={99} />
            </Form.Item>
            <Form.Item name="hargaPerSatuan" label="Harga Per Satuan">
              <InputNumber
                min={0}
                max={999999999999999}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" className="btn btn-primary" htmlType="submit">
                +
              </Button>
            </Form.Item>
            <Form.Item>
              <Button className="btn btn-light" onClick={this.onKosongkanBarangGadai}>
                Kosongkan
              </Button>
            </Form.Item>
          </Form>
          <br />
          <Table
            size="small"
            columns={tabelBarangColumns}
            dataSource={daftarBarangGadai}
            rowKey={record => record.no}
          />
        </Card>
        <br />
        <Card size="small" title="Data Kontrak">
          <Form layout="vertical" onFinish={this.dataKontrakHitung} ref={this.dataKontrakRef}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="totalNilaiTaksiran" label="Total Nilai Taksiran">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="ltv" label="Loan To Value (LTV)">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="maksPinjaman" label="Maksimal Nilai Pinjaman">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="nilaiPencairanPelanggan" label="Nilai Pencairan Pelanggan *">
                  <InputNumber
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                    min={0}
                    max={999999999999999}
                  />
                </Form.Item>
                <Form.Item name="biayaAdminBuka" label="Biaya Admin Buka">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="diskonAdmBuka" label="Diskon Admin Buka *">
                  <InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item name="biayaAdmAkhir" label="Biaya Admin Buka Akhir">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="totalPinjaman" label="Total Nilai Pinjaman">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="tglJatuhTempo" label="Tanggal Jatuh Tempo">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="biayaJasaPenyimpanan" label="Biaya Jasa Penyimpanan">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="periodeJasaPenyimpanan" label="Periode Jasa Penyimpanan (Bulan)">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item
                  name="biayaJasaPenyimpananPerPeriode"
                  label="Biaya Jasa Penyimpanan / Periode"
                >
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="totalBiayaJp" label="Total Biaya Jasa Penyimpanan">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="biayaAdminTutup" label="Biaya Admin Tutup">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="totalPengembalian" label="Total Pengembalian">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <Button
                type="primary"
                className="btn btn-light px-5 mr-2 float-right"
                htmlType="submit"
                disabled={hitungDisable}
              >
                Hitung
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <br />
        <Button
          type="primary"
          className="btn btn-light px-5 mr-2 float-right"
          onClick={this.simpanTransaksiBaru}
          loading={loadingSave}
          disabled={simpanDisable}
        >
          Simpan
        </Button>
        <Button
          className="btn btn-secondary px-5 mr-2 float-right"
          onClick={() => history.goBack()}
        >
          Kembali
        </Button>
        <br />
      </div>
    )
  }
}

export default BaruTransaksiCicTetap
