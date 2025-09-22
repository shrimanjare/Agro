import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const mailOptions = {
      from: `"Agro Pesticides Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendInvoiceEmail = async (customerEmail, customerName, invoiceNumber, amount, pdfBuffer) => {
  const subject = `Invoice ${invoiceNumber} - Agro Pesticides Shop`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Agro Pesticides Shop</h1>
        <p style="margin: 5px 0;">Your Trusted Agricultural Partner</p>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #333;">Dear ${customerName},</h2>
        
        <p>Thank you for your purchase! Please find your invoice details below:</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Invoice Number:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toLocaleDateString('en-IN')}</td>
            </tr>
          </table>
        </div>
        
        <p>Your invoice is attached to this email as a PDF file.</p>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin-top: 0;">Contact Information</h3>
          <p style="margin: 5px 0;">📞 Phone: +91-9876543210</p>
          <p style="margin: 5px 0;">📧 Email: info@agropesticides.com</p>
          <p style="margin: 5px 0;">📍 Address: 123 Agricultural Street, Farming District</p>
        </div>
        
        <p>Thank you for choosing Agro Pesticides Shop for your agricultural needs!</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this email address.
          </p>
        </div>
      </div>
    </div>
  `;

  const attachments = [{
    filename: `invoice-${invoiceNumber}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf'
  }];

  try {
    return await sendEmail(customerEmail, subject, html, attachments);
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    throw error;
  }
};