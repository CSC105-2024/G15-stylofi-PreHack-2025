import nodemailer from "nodemailer";

const sendOtp = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pssthant@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const message = {
      from: '"Stylofi" <no-reply@stylofi.com>',
      to: email,
      subject: "Your Stylofi OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html: `<p><strong>Your OTP code is:</strong> <code>${otp}</code></p><p>This code will expire in 5 minutes. Do not share it with anyone.</p>`,
    };

    await transporter.sendMail(message);
  } catch (e) {
    console.error("error:", e);
    throw new Error("Failed to send OTP.");
  }
};

export { sendOtp };
