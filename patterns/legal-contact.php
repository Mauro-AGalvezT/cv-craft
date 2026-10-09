<?php
/**
 * Title: Contacto
 * Slug: cv-craft-premium/legal-contact
 * Description: Formulario de contacto que envía a admin-post.php (sin base de datos).
 * Categories: cv-craft-premium
 * Keywords: contacto, formulario, google ads
 */
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"3rem","bottom":"3rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:3rem;padding-bottom:3rem">

<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><?php esc_html_e( 'Contacto', 'cv-craft-premium' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( '¿Tienes una duda, sugerencia o solicitud sobre tus datos? Escríbenos y te responderemos lo antes posible.', 'cv-craft-premium' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<div id="contacto" class="font-inter">
	<div data-cv-notice="ok" hidden class="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm" role="status"><?php esc_html_e( '¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.', 'cv-craft-premium' ); ?></div>
	<div data-cv-notice="invalido" hidden class="mb-5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm" role="alert"><?php esc_html_e( 'Revisa los campos: todos son obligatorios y el mensaje debe tener al menos 10 caracteres.', 'cv-craft-premium' ); ?></div>
	<div data-cv-notice="espera" hidden class="mb-5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm" role="alert"><?php esc_html_e( 'Espera unos segundos antes de enviar otro mensaje.', 'cv-craft-premium' ); ?></div>
	<div data-cv-notice="error" hidden class="mb-5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm" role="alert"><?php esc_html_e( 'No pudimos enviar tu mensaje. Inténtalo de nuevo más tarde.', 'cv-craft-premium' ); ?></div>

	<form class="glass rounded-3xl p-6 sm:p-8 space-y-5" method="post" action="/wp-admin/admin-post.php">
		<input type="hidden" name="action" value="cvcraft_contact">
		<div style="position:absolute;left:-9999px;" aria-hidden="true">
			<label>Web <input type="text" name="cvcraft_website" tabindex="-1" autocomplete="off"></label>
		</div>

		<div class="grid sm:grid-cols-2 gap-5">
			<label class="block">
				<span class="cv-label"><?php esc_html_e( 'Nombre', 'cv-craft-premium' ); ?></span>
				<input class="cv-input" type="text" name="cvcraft_name" required maxlength="100" autocomplete="name">
			</label>
			<label class="block">
				<span class="cv-label"><?php esc_html_e( 'Correo electrónico', 'cv-craft-premium' ); ?></span>
				<input class="cv-input" type="email" name="cvcraft_email" required maxlength="150" autocomplete="email">
			</label>
		</div>
		<label class="block">
			<span class="cv-label"><?php esc_html_e( 'Mensaje', 'cv-craft-premium' ); ?></span>
			<textarea class="cv-input" name="cvcraft_message" rows="6" required minlength="10" maxlength="5000"></textarea>
		</label>
		<label class="flex items-start gap-2 text-sm text-slate-600">
			<input class="mt-1" type="checkbox" name="cvcraft_consent" value="1" required>
			<span><?php esc_html_e( 'He leído la Política de Privacidad y acepto que se use mi mensaje para responderme.', 'cv-craft-premium' ); ?></span>
		</label>
		<button type="submit" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#1e3a5f] to-indigo-600 text-white px-7 py-3 font-semibold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition">
			<?php esc_html_e( 'Enviar mensaje', 'cv-craft-premium' ); ?>
		</button>
	</form>
	<script>
		(function () {
			var s = new URLSearchParams(location.search).get('contacto');
			var n = s && document.querySelector('[data-cv-notice="' + s.replace(/[^a-z]/g, '') + '"]');
			if (n) { n.hidden = false; }
		})();
	</script>
</div>
<!-- /wp:html -->

</div>
<!-- /wp:group -->
