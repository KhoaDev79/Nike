import nodemailer from 'nodemailer';
try {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: undefined, pass: undefined }
  });
  console.log("Transport created with undefined auth");
} catch(e) {
  console.log("Error creating transport:", e);
}
