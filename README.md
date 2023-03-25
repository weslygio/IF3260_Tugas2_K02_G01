# Tugas 2 IF3260 Grafika Komputer 3D WebGL Hollow Object

## Anggota Kelompok
- Wesly Giovano 13520071
- Rio Alexander Audino 13520088
- Petrus Elison Manurung 13518110

## Deskripsi

Tugas Grafika Komputer kali ini adalah sebuah aplikasi 3D WebGL Hollow Object. Aplikasi 3D WebGL Hollow Object adalah sebuah aplikasi yang memungkinkan pengguna untuk membuat, memuat, dan berinteraksi dengan objek 3D. Aplikasi ini menggunakan teknologi WebGL yang memungkinkan pengguna untuk menggambar objek 3D secara real-time di browser web.

Dalam aplikasi ini, pengguna dapat membuat objek 3D baru, memuat objek dari file JSON, serta melakukan berbagai transformasi objek seperti rotasi, translasi, dan scaling. Pengguna juga dapat memilih jenis proyeksi untuk menampilkan objek dalam mode orthographic, oblique, atau perspective.

Selain itu, aplikasi ini juga menyediakan fitur untuk mengubah jarak pandangan kamera untuk mendekat atau menjauh dari objek, serta menggerakkan kamera untuk mengitari objek. Fitur reset ke tampilan default dan menu help juga tersedia untuk memudahkan pengguna baru dalam melakukan operasi pada aplikasi.

Fitur terakhir yang diimplementasikan dalam aplikasi ini adalah teknik shading untuk menambahkan warna dasar pada objek. Pengguna dapat mengaktifkan atau menonaktifkan shading saat menggambar objek.

Kami juga mengiplementasikan bonus berupa shading manual dan point lightning. Fitur point lightning berupa warna, posisi, dan juga rotasi. Point lightning dapat membantu prespektif kita ketika melihat transformasi object dan camera.

Secara keseluruhan, tugas besar ini berhasil mencapai tujuannya dengan berhasil mengembangkan aplikasi 3D WebGL Hollow Object yang interaktif dan dapat digunakan secara mudah. Dengan mengimplementasikan fitur-fitur yang diberikan, pengguna dapat mengakses dan berinteraksi dengan model yang telah disediakan dan membuat model 3D mereka sendiri dalam aplikasi ini.


## Cara Penggunaan Program
- Menjalankan program :
    - clone repo ini lalu jalankan index.html
- Memuat model: 
    - pengguna dapat memuat satu model 3D dari file JSON dengan menggunakan tombol "Load Model".
- Mengubah proyeksi: 
    - pengguna dapat mengubah jenis proyeksi dengan memilih opsi "Orthographic", "Oblique", atau "Perspective" pada menu "Projection".
- Transformasi object: 
    - pengguna dapat melakukan rotasi, translasi, dan scaling pada objek yang dipilih dengan menggeser slider pada panel transformasi. Rotasi dilakukan dengan menaikkan atau menurunkan sudut-sudut anguler dengan pusat rotasi di titik tengah objek yang dirotasi.
- Transformasi camera: 
    - pengguna dapat mengubah jarak (radius) kamera view untuk mendekat atau menjauh dari model serta menggerakkan kamera untuk mengitari model dengan menggeser slider pada panel transformasi.
- Transformasi cahaya: 
    - pengguna dapat mengubah warna dasar pada model dengan mengontrol cahaya dengan menggeser slider pada panel cahaya.
- Mengontrol Shader: 
    - pengguna dapat menghidupkan atau mematikan shader dengan memilih opsi "On" atau "Off" pada menu "Shader".
- Melakukan reset: 
    - pengguna dapat mengembalikan tampilan ke default dengan menekan tombol "Reset". Terdapat juga menu "Help" yang memudahkan pengguna baru untuk dapat melakukan operasi di atas tanpa harus bertanya.