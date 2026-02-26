/**
 * Shows contact form success/error feedback and scrolls to contact section
 * when returning from form submission (sent=1 or error param in URL).
 */
function initContactFormFeedback(): void {
	const successEl = document.getElementById("contact-success");
	const errorEl = document.getElementById("contact-error");
	const searchParams = new URLSearchParams(window.location.search);

	if (successEl && searchParams.get("sent") === "1") {
		successEl.hidden = false;
	}
	if (errorEl && searchParams.get("error")) {
		errorEl.hidden = false;
	}
	if (searchParams.get("sent") === "1" || searchParams.get("error")) {
		history.scrollRestoration = "manual";
		const contact = document.getElementById("contact");
		if (contact) {
			requestAnimationFrame(() => {
				contact.scrollIntoView({ behavior: "smooth", block: "start" });
			});
		}
	}
}

initContactFormFeedback();
