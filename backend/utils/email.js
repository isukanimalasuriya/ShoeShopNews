import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

export const sendRestockEmail = async ({ brand, model, color, size, stock, supplierEmail, pdfBuffer, pdfFilename }) => {
  try {
    console.log('Attempting to send email with config:', {
      from: process.env.EMAIL_USER ? 'Set' : 'Not set',
      to: supplierEmail,
      subject: `Restock Request: ${brand} ${model}`,
      hasAttachment: !!pdfBuffer && !!pdfFilename,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: supplierEmail,
      subject: `Restock Request: ${brand} ${model}`,
      text: `Please review the attached restock request for the following item:\n\nBrand: ${brand}\nModel: ${model}\nColor: ${color}\nSize: ${size}\nCurrent Stock: ${stock}\n\nThank you!`,
      attachments: pdfBuffer && pdfFilename ? [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ] : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending restock email:', error);
    console.error('Email configuration:', {
      user: process.env.EMAIL_USER ? 'Set' : 'Not set',
      pass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
    });
    throw error;
  }
};