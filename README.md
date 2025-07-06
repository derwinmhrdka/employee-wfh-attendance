# 🗂️ Employee Remote Attendance System

Sebuah sistem absensi karyawan saat **Work From Home (WFH)**.  
Aplikasi ini dapat diakses oleh **karyawan** dan **admin** dengan fitur-fitur berikut:

---

## Fitur

### Admin
- **Manajemen Karyawan**
  - Menambah profil karyawan baru
  - Mengubah data karyawan
  - Melihat data absensi karyawan
  - Melihat log perubahan data karyawan
- **Manajemen Absensi**
  - Melihat seluruh data clock in & clock out karyawan

### Karyawan
- **Absensi**
  - Clock in & clock out mandiri
  - Melihat ringkasan absensi pribadi
  - Mengubah profil pribadi

---

## Tech Stack

| Komponen         | Teknologi                     |
| ---------------- | ----------------------------- |
| **Backend**      | Express.js + Prisma ORM       |
| **Database**     | PostgreSQL                    |
| **Message Queue**| RabbitMQ                      |
| **Cache**        | Redis                         |
| **Container**    | Docker Compose                |
| **Frontend**     | React + Bootstrap             |

---

## Prasyarat

Pastikan **Docker** & **Docker Compose** sudah terinstal:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Cara Menjalankan

### 1️⃣ Clone Project

```bash
git clone https://github.com/derwinmhrdka/employee-wfh-attendance.git
cd employee-wfh-attendance
```

---

### 2️⃣ **Jalankan Docker Compose**

```bash
docker compose up --build
```

* Akan membangun image backend.
* Membuat container PostgreSQL, RabbitMQ, Redis, dan Backend API.
* Otomatis siap dipakai di `http://localhost:5000`.

---

### 3️⃣ **Setup Prisma (seed DB)**

Buka terminal di container **backend**:

```bash
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma db seed
```

---

### 4️⃣ **Frontend**

* run front end:

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

---

## Data Awal

Running seed data ini untuk mendapatkan data user starter:

1. Jalankan seed:

   ```bash
   docker compose exec backend npx prisma db seed
   ```

---

## 📍 URL Akses

| Service            | URL                                              |
| ------------------ | ------------------------------------------------ |
| Backend            | [http://localhost:5000](http://localhost:5000)   |
| Frontend           | [http://localhost:5173](http://localhost:5173)   |
| RabbitMQ Dashboard | [http://localhost:15672](http://localhost:15672) |
| PostgreSQL         | localhost:5433                                   |
| Redis              | localhost:6379                                   |

---
