<?php
/**
 * Title: Hero del generador
 * Slug: cv-craft-premium/hero
 * Description: Cabecera de la landing con gradiente sutil y llamada a la acción.
 * Categories: cv-craft-premium
 * Viewport Width: 1400
 */
?>
<!-- wp:html -->
<section class="relative overflow-hidden px-4 pt-16 pb-8 sm:pt-24 font-inter">
	<div class="max-w-4xl mx-auto text-center">
		<span class="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700">
			<span class="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
			<?php esc_html_e( '100% privado · Sin registro · Sin base de datos', 'cv-craft-premium' ); ?>
		</span>
		<h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
			<?php esc_html_e( 'Crea tu CV Profesional', 'cv-craft-premium' ); ?>
			<span class="bg-gradient-to-r from-[#1e3a5f] via-indigo-600 to-sky-500 bg-clip-text text-transparent"><?php esc_html_e( 'en Segundos y Gratis', 'cv-craft-premium' ); ?></span>
		</h1>
		<p class="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
			<?php esc_html_e( 'Elige entre un estilo clásico corporativo o uno moderno creativo, añade tu foto, edita con vista previa en tiempo real y descarga un PDF A4 perfecto. Todo ocurre en tu navegador.', 'cv-craft-premium' ); ?>
		</p>
		<div class="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
			<a href="#generador" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#1e3a5f] to-indigo-600 text-white px-7 py-3.5 font-semibold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-xl transition no-underline"><?php esc_html_e( 'Crear mi CV ahora', 'cv-craft-premium' ); ?></a>
			<a href="#como-funciona" class="glass inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold text-slate-800 hover:bg-white/90 transition no-underline"><?php esc_html_e( 'Cómo funciona', 'cv-craft-premium' ); ?></a>
		</div>
	</div>
</section>
<!-- /wp:html -->
