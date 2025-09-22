import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendWhatsAppMessage = async (to, message, mediaUrl = null) => {
  try {
    const messageOptions = {
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message
    };

    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl];
    }

    const result = await client.messages.create(messageOptions);
    console.log('WhatsApp message sent:', result.sid);
    return result;
  } catch (error) {
    console.error('WhatsApp send error:', error);
    throw error;
  }
};

export const sendInvoiceWhatsApp = async (customerPhone, invoiceNumber, amount, pdfUrl) => {
  const message = `🧾 *Invoice Generated*\n\nInvoice No: ${invoiceNumber}\nAmount: ₹${amount}\n\nThank you for your business!\n\n*Agro Pesticides Shop*\n📞 +91-9876543210`;
  
  try {
    return await sendWhatsAppMessage(customerPhone, message, pdfUrl);
  } catch (error) {
    console.error('Failed to send invoice WhatsApp:', error);
    throw error;
  }
};