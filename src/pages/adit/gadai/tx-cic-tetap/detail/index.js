import { Button, Card, Form, Input, Table } from 'antd'
import React, { Component } from 'react'
import * as txCicilanTetapService from 'services/gadai/transaksi/cicilan-tetap'
import { history } from 'index'

class DetailTransaksiCicTetap extends Component {
  informasiTransaksiRef = React.createRef()

  dataKontrakRef = React.createRef()

  state = {
    footerStyle: {},
    daftarBarangGadai: [],
    actorId: 'user1', // hard code userId
  }

  constructor(props) {
    super(props)

    this.fetchTransaksi()
  }

  componentDidMount() {
    const { footerHide } = this.props
    if (footerHide) {
      this.setState({ footerStyle: { display: 'none' } })
    }
  }

  inputMonetaryFormatter = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  inputPercentFormatter = value => `${value}%`

  fetchTransaksi = () => {
    const { actorId } = this.state
    const dataCari = {
      noTransaksi: history.location.state.noTransaksi,
      actorId,
    }
    txCicilanTetapService.doGetDetailCicTetap(dataCari).then(result => {
      console.log(result)

      const { responseData } = result
      const data = responseData

      this.informasiTransaksiRef.current.setFieldsValue({
        custId: data.custId,
        tglTransaksi: data.tglTransaksi.slice(0, 10),
        noTransaksi: data.noTransaksi,
        produkId: data.produkId,
        produkName: data.produkName,
        produkDesc: data.produkDesc || '-',
      })

      data.daftarBarangGadai.forEach(element => {
        element.total = element.jlh * element.hargaPerSatuan
      })

      this.setState({ daftarBarangGadai: data.daftarBarangGadai })

      this.dataKontrakRef.current.setFieldsValue({
        totalNilaiTaksiran: this.inputMonetaryFormatter(data.totalNilaiTaksiran),
        ltv: this.inputPercentFormatter(data.ltv),
        maksPinjaman: this.inputMonetaryFormatter(data.maksPinjaman),
        nilaiPencairanPelanggan: this.inputMonetaryFormatter(data.nilaiPencairanPelanggan),
        biayaAdminBuka: this.inputMonetaryFormatter(data.biayaAdminBuka),
        diskonAdmBuka: this.inputPercentFormatter(data.discBiayaAdm),
        biayaAdmAkhir: this.inputMonetaryFormatter(data.biayaAdmAkhir),
        totalPinjaman: this.inputMonetaryFormatter(data.totalPinjaman),
        tglTransaksi: data.tglTransaksi.slice(0, 10),
        tglJatuhTempo: data.tglJatuhTempo.slice(0, 10),
        biayaJasaPenyimpanan: this.inputPercentFormatter(data.biayaJasaPenyimpanan),
        periodeJasaPenyimpanan: data.periodeJasaPenyimpanan,
        biayaJasaPenyimpananPerPeriode: this.inputMonetaryFormatter(
          data.biayaJasaPenyimpananPerPeriode,
        ),
        totalBiayaJp: this.inputMonetaryFormatter(data.totalBiayaJp),
        biayaAdminTutup: this.inputMonetaryFormatter(data.biayaAdminTutup),
        totalPengembalian: this.inputMonetaryFormatter(data.totalPengembalian),
      })
    })
  }

  pembayaranCicilan = () => {
    history.push('/adit/gadai/transaksi/cicilan-tetap/pembayaran', {
      noTransaksi: history.location.state.noTransaksi,
    })
  }

  render() {
    const { footerStyle, daftarBarangGadai } = this.state

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
    ]

    const inputReadonlyStyle = {
      backgroundColor: 'rgb(230, 230, 230)',
      width: '100%',
    }

    return (
      <div>
        <h3>Transaksi Cicilan Tetap - Detail Transaksi</h3>
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
                <Form.Item name="produkId" label="Produk Transaksi">
                  <Input placeholder="Produk Transaksi" style={inputReadonlyStyle} readOnly />
                </Form.Item>
                <Form.Item name="produkName" label="Nama Produk">
                  <Input placeholder="Nama Produk" style={inputReadonlyStyle} readOnly />
                </Form.Item>
                <Form.Item name="produkDesc" label="Keterangan Produk">
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
                <Form.Item name="nilaiPencairanPelanggan" label="Nilai Pencairan Pelanggan">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="biayaAdminBuka" label="Biaya Admin Buka">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
                </Form.Item>
                <Form.Item name="diskonAdmBuka" label="Diskon Admin Buka">
                  <Input style={{ ...inputReadonlyStyle, textAlign: 'right' }} readOnly />
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
          </Form>
        </Card>
        <br />
        <div style={footerStyle}>
          <Button
            type="primary"
            className="btn btn-primary px-5 mr-2 float-right"
            onClick={this.pembayaranCicilan}
          >
            Pembayaran
          </Button>
          <Button
            className="btn btn-secondary px-5 mr-2 float-right"
            onClick={() => history.goBack()}
          >
            Kembali
          </Button>
        </div>
        <br />
      </div>
    )
  }
}

export default DetailTransaksiCicTetap
