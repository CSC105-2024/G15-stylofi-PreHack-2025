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
      from: '"Stylofi" <pssthant@gmail.com>',
      to: email,
      subject: "Your Stylofi Verification Code",
      text: `Thank you for using Stylofi! Your verification code is ${otp}. This code will expire in 5 minutes. If you didn't request this code, please ignore this message.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333;">Stylofi</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
            <h2 style="margin-top: 0; color: #333;">Your Verification Code</h2>
            <p style="font-size: 16px;">Thank you for using Stylofi. Use the code below to complete your verification:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f0f0f0; border-radius: 4px;">${otp}</span>
            </div>
            <p style="font-size: 14px;">This code will expire in 5 minutes.</p>
            <p style="font-size: 14px;">If you didn't request this code, please ignore this message.</p>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Stylofi. All rights reserved.</p>
          </div>
        </div>
      `,
      headers: {
        Priority: "high",
        Importance: "high",
        "X-Priority": "1",
      },
    };

    await transporter.sendMail(message);
  } catch (e) {
    console.error("error:", e);
    throw new Error("Failed to send OTP.");
  }
};

export { sendOtp };
