'use server'

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Please enter at least 2 characters for your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide a message of at least 10 characters")
});

type FormData = z.infer<typeof formSchema>;

export async function submitContactForm(data: FormData) {
  try {
    // Validate server-side
    const validatedFields = formSchema.safeParse(data);
    
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    // Prepare data for FormSubmit.co
    const submissionData = new FormData();
    submissionData.append('name', data.name);
    submissionData.append('email', data.email);
    if (data.phone) submissionData.append('phone', data.phone);
    submissionData.append('message', data.message);
    
    // FormSubmit.co configuration
    submissionData.append('_subject', `New Contact from ${data.name}`);
    submissionData.append('_template', 'table');
    submissionData.append('_captcha', 'false');
    // Disable auto-response if desired, or keep it default
    // submissionData.append('_autoresponse', 'your custom message');

    // Send to FormSubmit.co
    // Note: We're using the email directly here. In a real app, you might want to use an env var.
    const response = await fetch('https://formsubmit.co/crystalseedtarot@gmail.com', {
      method: 'POST',
      body: submissionData,
    });

    // FormSubmit usually redirects on success for POST, or returns JSON for AJAX.
    // Since we are calling it from the server, we can't really use their AJAX endpoint the same way 
    // because it expects a browser origin for CORS sometimes, but let's try the standard endpoint.
    // Actually, the AJAX endpoint is better for programmatic access.
    
    const ajaxResponse = await fetch('https://formsubmit.co/ajax/crystalseedtarot@gmail.com', {
        method: 'POST',
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            message: data.message,
            _subject: `Contact Form: ${data.name}`,
            _template: 'table',
            _captcha: 'false'
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!ajaxResponse.ok) {
      const errorText = await ajaxResponse.text();
      console.error('FormSubmit error:', errorText);
      
      if (errorText.includes('needs Activation')) {
         return { success: false, message: "Form needs activation. Please verify email address." };
      }
      
      return { success: false, message: "Failed to send message. Please try again later." };
    }

    return { success: true, message: "Message sent successfully!" };
    
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, message: "Internal server error. Please try again." };
  }
}

