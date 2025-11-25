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

    // FormSubmit usually redirects on success for POST, or returns JSON for AJAX.
    // We use the AJAX endpoint for programmatic access and JSON response.
    
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

