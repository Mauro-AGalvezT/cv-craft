<?php
/**
 * Title: Características y preguntas frecuentes
 * Slug: cv-craft-premium/features
 * Description: Tres ventajas, pasos y FAQ para la landing.
 * Categories: cv-craft-premium
 * Viewport Width: 1400
 */
?>
<!-- wp:html -->
<section id="como-funciona" class="px-4 py-16 font-inter">
	<div class="max-w-6xl mx-auto">
		<div class="text-center max-w-2xl mx-auto">
			<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"><?php esc_html_e( 'Diseñado para tu privacidad', 'cv-craft-premium' ); ?></h2>
			<p class="mt-3 text-slate-600"><?php esc_html_e( 'Sin cuentas, sin servidores intermedios y sin sorpresas.', 'cv-craft-premium' ); ?></p>
		</div>
		<div class="mt-10 grid gap-5 md:grid-cols-3">
			<div class="glass rounded-3xl p-7 transition hover:-translate-y-1">
				<div class="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl" aria-hidden="true">🔒</div>
				<h3 class="mt-4 text-lg font-bold text-slate-900"><?php esc_html_e( '100% local', 'cv-craft-premium' ); ?></h3>
				<p class="mt-2 text-slate-600 text-[15px]"><?php esc_html_e( 'Tus datos se procesan en tu navegador. No se envían ni se almacenan en ninguna base de datos.', 'cv-craft-premium' ); ?></p>
			</div>
			<div class="glass rounded-3xl p-7 transition hover:-translate-y-1">
				<div class="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl" aria-hidden="true">🎨</div>
				<h3 class="mt-4 text-lg font-bold text-slate-900"><?php esc_html_e( 'Dos estilos profesionales', 'cv-craft-premium' ); ?></h3>
				<p class="mt-2 text-slate-600 text-[15px]"><?php esc_html_e( 'Clásico corporativo (serif, sobrio) o moderno creativo (barra lateral y acentos de color). Cambia con un clic.', 'cv-craft-premium' ); ?></p>
			</div>
			<div class="glass rounded-3xl p-7 transition hover:-translate-y-1">
				<div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl" aria-hidden="true">📄</div>
				<h3 class="mt-4 text-lg font-bold text-slate-900"><?php esc_html_e( 'PDF A4 listo para imprimir', 'cv-craft-premium' ); ?></h3>
				<p class="mt-2 text-slate-600 text-[15px]"><?php esc_html_e( 'Lo que ves en la vista previa es lo que descargas, con el estilo exacto que elegiste.', 'cv-craft-premium' ); ?></p>
			</div>
		</div>

		<div class="mt-16 max-w-3xl mx-auto">
			<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center"><?php esc_html_e( 'Preguntas frecuentes', 'cv-craft-premium' ); ?></h2>
			<div class="mt-6 space-y-3">
<?php
// Misma fuente que el JSON-LD FAQPage (inc/seo.php), para que contenido visible y marcado coincidan.
foreach ( cvcraft_faq_items() as $cvcraft_qa ) :
	?>
				<details class="glass rounded-2xl p-5">
					<summary class="cursor-pointer font-semibold text-slate-900"><?php echo esc_html( $cvcraft_qa[0] ); ?></summary>
					<p class="mt-3 text-slate-600 text-[15px]"><?php echo esc_html( $cvcraft_qa[1] ); ?></p>
				</details>
<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
<!-- /wp:html -->
