import Table from "cli-table";
import Login, { db, rl } from "../test18MVC.mjs";

//IMPORT MODEL
import ModelMhs from "../model/modelMhs.mjs";
import ModelJurusan from "../model/modelJurusan.mjs";

//IMPORT VIEW
import ViewMhs from "../view/viewMhs.mjs";
import ViewLog from "../view/viewLog.mjs";

export default class ContMhs {
    static MenuMahasiswa() {
        ViewMhs.menuMhs()
        rl.question('Masukkan salah satu nomor dari opsi di bawah ini : ', (opsi) => {
            switch (opsi) {
                case '1':
                    ContMhs.daftarMahasiswa()
                    break;
                case '2':
                    ContMhs.cariMahasiswa()
                    break;
                case '3':
                    ContMhs.tambahMahasiswa()
                    break;
                case '4':
                    ContMhs.hapusMahasiswa()
                    break;
                case '5':
                    Login.home()
                    break;
            }
        })
    }

    static daftarMahasiswa() {
        const tableMahasiswa = new Table({
            head: ['NIM', 'Nama', 'Alamat', 'Id Jurusan', 'Tanggal Lahir']
        });
        ModelMhs.DaftarMahasiswa((err, data) => {
            if (err) {
                console.log('Gagal mengambil data mahasiswa', err)
                process.exit(1)
            }

            data.forEach(item => {
                tableMahasiswa.push([
                    item.nim,
                    item.nama,
                    item.alamat,
                    item.id_jurusan,
                    item.dob
                ])
            })
            console.log(tableMahasiswa.toString())
            ContMhs.MenuMahasiswa()
        })
    }

    static cariMahasiswa() {
        ViewLog.line()
        rl.question('Masukkan NIM mahasiswa : ', (nim) => {
            ModelMhs.CariMahasiswa([nim], (err, data) => {
                if (err) {
                    console.log('Gagal mengambil data mahasiswa', err)
                    process.exit(1)
                }
                if (data.length == 0) {
                    console.log(`Mahasiswa dengan nim '${nim}' tidak terdaftar`)
                    ContMhs.MenuMahasiswa()
                } else {
                    console.log(`
=============================================
Detail mahasiswa dengan NIM '${nim}' :
NIM           : ${data[0].nim}
Nama          : ${data[0].nama}
Alamat        : ${data[0].alamat}
Tanggal Lahir : ${data[0].dob}
Id Jurusan    : ${data[0].id_jurusan}
            `);
                    ContMhs.MenuMahasiswa()
                }
            })
        })
    }

    static tambahMahasiswa() {
        ViewLog.line()
        console.log('Lengkapi data di bawah ini : ')
        rl.question('NIM :', (nim) => {
            rl.question('Nama: ', (nama) => {
                rl.question('Alamat: ', (alamat) => {
                    const tableJurusan = new Table({
                        head: ['Kode Jurusan', 'Nama Jurusan']
                    })
                    ModelJurusan.DaftarJurusan((err, data) => {
                        if (err) {
                            console.log('Gagal mengambil data jurusan', err)
                            process.exit(1)
                        }

                        data.forEach(item => {
                            tableJurusan.push([
                                item.id_jurusan,
                                item.nama_jurusan
                            ])
                        })
                        console.log(tableJurusan.toString())
                        rl.question('Jurusan: ', (id_jurusan) => {
                            rl.question('Tanggal Lahir: ', (dob) => {
                                db.run('INSERT INTO mahasiswa VALUES (?, ?, ?, ?, ?)', [nim, nama, alamat, id_jurusan, dob], (err) => {
                                    if (err) {
                                        console.log('Gagal menambah data mahasiswa', err)
                                        process.exit(1)
                                    } else {
                                        console.log('Data mahasiswa berhasil ditambahkan')
                                        ContMhs.daftarMahasiswa()
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    static hapusMahasiswa() {
        ViewLog.line()
        const tableMahasiswa = new Table({
            head: ['NIM', 'Nama', 'Alamat', 'Id Jurusan', 'Tanggal Lahir']
        });
        ModelMhs.DaftarMahasiswa((err, data) => {
            if (err) {
                console.log('Gagal mengambil data mahasiswa', err)
                process.exit(1)
            }

            data.forEach(item => {
                tableMahasiswa.push([
                    item.nim,
                    item.nama,
                    item.alamat,
                    item.id_jurusan,
                    item.dob
                ])
            })
            console.log(tableMahasiswa.toString())
            rl.question('Masukkan NIM Mahasiswa : ', (nim) => {
                ModelMhs.HapusMahasiswa([nim], (err) => {
                    if (err) {
                        console.log('Gagal menghapus data mahasiswa', err)
                        process.exit(1)
                    } else {
                        console.log(`Data mahasiswa dengan '${nim}' telah dihapus`);
                        ContMhs.MenuMahasiswa()
                    }
                })
            })
        })
    }
}