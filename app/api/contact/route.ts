import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `;

    // Configure transporter
    // Note: For production, you should use environment variables for these credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'crystalseedtarot@gmail.com',
        pass: process.env.EMAIL_PASSWORD, // This should be an app password, not your regular password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'crystalseedtarot@gmail.com',
      to: 'crystalseedtarot@gmail.com',
      subject: `New Contact Form: ${name}`,
      html: emailContent,
      replyTo: email,
    };

    // Check if email password is configured
    if (!process.env.EMAIL_PASSWORD) {
      console.log('Email would be sent in production:');
      console.log(mailOptions);
      
      // For development, just return success without actually sending
      return NextResponse.json({ message: 'Message received (dev mode)' });
    }

    // Send email in production
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 