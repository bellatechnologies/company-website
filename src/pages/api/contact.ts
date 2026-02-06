import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const recipientEmail = "daniel@bellatechnologies.in";

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData();
	const name = formData.get("name");
	const email = formData.get("email");
	const message = formData.get("message");

	if (!name || !email || !message) {
		return new Response("Missing required fields.", { status: 400 });
	}

	const apiKey = process.env.RESEND_API_KEY;
	const fromEmail = process.env.FROM_EMAIL;

	if (!apiKey || !fromEmail) {
		return new Response("Email service not configured.", { status: 500 });
	}

	const resend = new Resend(apiKey);

	await resend.emails.send({
		from: fromEmail,
		to: recipientEmail,
		replyTo: String(email),
		subject: `New inquiry from ${String(name)}`,
		text: `Name: ${String(name)}\nEmail: ${String(email)}\n\nProject details:\n${String(
			message,
		)}`,
	});

	return Response.redirect(new URL("/contact?sent=1", request.url), 303);
};
