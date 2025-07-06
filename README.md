# 🗂️ WHATT - WFH Attendance Tracker

Sebuah sistem absensi karyawan saat **Work From Home (WFH)**.  
Aplikasi ini dapat diakses oleh **karyawan** dan **admin** dengan fitur-fitur berikut:

---

## Fitur
### Login page
- Login sebagai admin dan employee
  <img width="959" alt="image" src="https://github.com/user-attachments/assets/31bcf0df-b368-4c4a-9e25-970ff48a4547" />

### Admin
- **Manajemen Karyawan**
  - Menambah profil karyawan baru
    <img width="959" alt="image" src="https://github.com/user-attachments/assets/00843d47-7c3c-4fae-84ab-23213eda8fc6" />

  - Mengubah data karyawan
    <img width="959" alt="image" src="https://github.com/user-attachments/assets/c5cd633e-0e5f-49bb-b399-201d6eec377a" />

  - Melihat log perubahan data karyawan menggunakan fitur rabbitMQ (_*password di hash_)
    <img width="959" alt="image" src="https://github.com/user-attachments/assets/1ec540c4-2cd6-4172-9c4d-e0dce14ab6f4" />

- **Manajemen Absensi**
  - Melihat seluruh data clock in & clock out karyawan
    <img width="959" alt="image" src="https://github.com/user-attachments/assets/3358b8b0-83ef-45ff-98c9-f81d6b298a8e" />

### Karyawan
- **Absensi & Profile**
  - Dashboard karyawan dengan konten clock in & clock out, dan ringkasan profil
    <img width="959" alt="image" src="https://github.com/user-attachments/assets/7e228e76-26e9-433d-b3a3-2a5680fe5159" />

  - Melihat attendance summary
    <img width="959" alt="image" src="https://github.com/user-attachments/assets/1d89c718-5599-4366-9992-842dc616b04f" />

  - Mengubah profil pribadi
    <img width="958" alt="image" src="https://github.com/user-attachments/assets/85761e71-7f21-487c-aad2-40f136da99b0" />
    
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
