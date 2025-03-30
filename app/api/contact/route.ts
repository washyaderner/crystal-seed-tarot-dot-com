import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  message: z.string().min(10, "Message is too short")
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Received form submission:", body);
    
    // Validate the request data
    const validatedFields = formSchema.parse(body);
    const { name, email, phone, message } = validatedFields;
    
    // Prepare email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `;
    
    // Handle development without API key
    if (!process.env.RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured. Would send:");
      console.log({ 
        from: 'onboarding@resend.dev',
        to: 'crystalseedtarot@gmail.com',
        subject: `New Contact Form: ${name}`,
        html: emailContent
      });
      
      // Return success for development
      return NextResponse.json({
        message: "Email would be sent in production"
      });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['crystalseedtarot@gmail.com'],
      subject: `New Contact Form: ${name}`,
      html: emailContent,
      replyTo: email
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Log success and return response
    console.log("Email sent successfully:", data);
    return NextResponse.json({
      message: "Email sent successfully",
      id: data?.id
    });
    
  } catch (error) {
    console.error("Error in contact form submission:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
} 