import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { CONTACT } from '../../data/contact';

function redirect(location: string, status = 303) {
	return new Response(null, {
		status,
		headers: {
			Location: location,
		},
	});
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getReturnTo(form: FormData): string {
	const raw = String(form.get('returnTo') ?? '').trim();
	if (raw === '/' || raw === '/contact/') return raw;
	return '/contact/';
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return redirect('/contact/?error=bad_request');
	}

	const returnTo = getReturnTo(form);

	const website = String(form.get('website') ?? '');
	if (website.trim()) {
		// Honeypot field: silently succeed to avoid tipping off bots.
		return redirect(`${returnTo}?sent=1`);
	}

	const name = String(form.get('name') ?? '').trim();
	const email = String(form.get('email') ?? '').trim();
	const message = String(form.get('message') ?? '').trim();

	if (!name || !email || !message || !isValidEmail(email)) {
		return redirect(`${returnTo}?error=validation`);
	}

	const resendApiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
	const fromEmail = import.meta.env.FROM_EMAIL ?? process.env.FROM_EMAIL;

	if (!resendApiKey || !fromEmail) {
		return redirect(`${returnTo}?error=config`);
	}

	const safeMessage = message.length > 5000 ? message.slice(0, 5000) : message;
	const safeName = name.length > 120 ? name.slice(0, 120) : name;

	try {
		const resend = new Resend(resendApiKey);
		await resend.emails.send({
			from: fromEmail,
			to: 'daniel@bellatechnologies.in',
			replyTo: email,
			subject: `New inquiry from ${safeName}`,
			text: [
				`Name: ${safeName}`,
				`Email: ${email}`,
				`IP: ${clientAddress ?? 'unknown'}`,
				'',
				safeMessage,
			].join('\n'),
		});
	} catch {
		return redirect(`${returnTo}?error=send_failed`);
	}

	return redirect(`${returnTo}?sent=1`);
};

export const GET: APIRoute = async () => {
	return new Response('Method Not Allowed', {
		status: 405,
		headers: {
			Allow: 'POST',
		},
	});
};

