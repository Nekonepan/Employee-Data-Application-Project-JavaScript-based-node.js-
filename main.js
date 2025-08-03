const fs = require('fs');
const isi_file = fs.readFileSync('data-karyawan.txt', 'utf-8');
const baris = isi_file.trim().split('\n');

let data = [];

for (let i = 0; i < baris.length; i++) {
  let kolom = baris[i].split('|');

  data.push({
    ID: kolom[0],
    NAMA: kolom[1],
    JABATAN: kolom[2],
    TELP: kolom[3]
  });
}

console.log("Jumlah data : ", data.length);
console.table(data);