import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const recipientEmail = "daniel@bellatechnologies.in";

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData();
	const name = formData.get("name");
	const email = formData.get("email");
	const message = formData.get("message");
	const website = formData.get("website");

	if (!name || !email || !message) {
		return new Response("Missing required fields.", { status: 400 });
	}
	if (website) {
		return new Response("OK", { status: 200 });
	}

	const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
	const fromEmail = import.meta.env.FROM_EMAIL ?? process.env.FROM_EMAIL;
	const isDev = import.meta.env.DEV;
	const effectiveFromEmail = isDev
		? fromEmail || "onboarding@resend.dev"
		: fromEmail;

	if (!apiKey || !effectiveFromEmail) {
		return new Response("Email service not configured.", { status: 500 });
	}

	const resend = new Resend(apiKey);

	const { data, error } = await resend.emails.send({
		from: effectiveFromEmail,
		to: recipientEmail,
		replyTo: String(email),
		subject: `New inquiry from ${String(name)}`,
		text: `Name: ${String(name)}\nEmail: ${String(email)}\n\nProject details:\n${String(
			message,
		)}`,
	});
	if (error) {
		return Response.redirect(
			new URL("/contact?error=send_failed", request.url),
			303,
		);
	}

	const redirectUrl = new URL("/contact?sent=1", request.url);
	return Response.redirect(redirectUrl, 303);
};
