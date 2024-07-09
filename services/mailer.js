import nodemailer from "nodemailer";

//Membuat Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//Fungsi untuk mengirim pesan email
const sendOrderNotification = async (orderData) => {
  try {
    // Membuat daftar item pesanan
    const itemsList = orderData.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}\n   Jumlah: ${
            item.quantity
          }\n   Harga: ${new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(item.price)}\n`
      )
      .join("");

    const formattedEmailContent = `
      Subject: Notifikasi Pesanan Baru

      Data Pesanan Baru:

      ID Pesanan: ${orderData._id}
      ID Pengguna: ${orderData.userId}
      Tanggal: ${orderData.date}

      Pesanan:
      ${itemsList}

      Total: ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(orderData.amount)}

      Alamat Pengiriman:
      Nama: ${orderData.address.name}
      Nomor Telepon: ${orderData.address.phoneNumber}
      Alamat: ${orderData.address.address}
    `;

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Notifikasi Pesanan Baru",
      text: formattedEmailContent,
    });

    console.log("Email notifikasi pesanan berhasil dikirim");
  } catch (error) {
    console.error(
      "Terjadi kesalahan saat mengirim email notifikasi pesanan: ",
      err
    );
  }
};

export { sendOrderNotification };
