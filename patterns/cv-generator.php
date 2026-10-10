<?php
/**
 * Title: Generador de CV
 * Slug: cv-craft-premium/cv-generator
 * Description: Aplicación interactiva: estilos, tipo de perfil, foto, formulario y vista previa A4 en tiempo real con descarga PDF local.
 * Categories: cv-craft-premium
 * Keywords: cv, currículum, generador, pdf, foto
 * Viewport Width: 1400
 */
?>
<!-- wp:html -->
<section id="generador" class="px-4 py-12 sm:py-16 font-inter" aria-labelledby="generador-titulo">
	<div class="max-w-[1400px] mx-auto">
		<div class="text-center max-w-2xl mx-auto mb-8">
			<h2 id="generador-titulo" class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Generador de currículum online</h2>
			<p class="mt-3 text-slate-600">Elige un estilo, rellena tus datos, añade tu foto y mira el resultado al instante. Tu información nunca sale de tu navegador.</p>
		</div>

		<div id="cv-app" data-profile="pro" data-mode="desktop">

			<!-- ============ ESCRITORIO (≥1024px) ============ -->
			<div class="cv-desktop">

				<!-- ============ Columna izquierda: controles ============ -->
				<div class="space-y-5">

					<!-- Selectores de estilo y tipo de CV -->
					<div class="glass rounded-3xl p-4 sm:p-5 space-y-5">
						<div>
							<h3 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 mb-3">Estilo visual</h3>
							<div class="bg-slate-200/60 rounded-2xl p-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5" role="tablist" aria-label="Estilo del currículum">
								<button type="button" role="tab" class="cv-tab px-4 py-3 text-sm text-left" data-style-btn="classic" aria-selected="true">
									<span class="block">Clásico Corporativo</span>
									<span class="block text-xs font-normal text-slate-500 mt-0.5">Serif · centrado · sobrio</span>
								</button>
								<button type="button" role="tab" class="cv-tab px-4 py-3 text-sm text-left" data-style-btn="modern" aria-selected="false">
									<span class="block">Moderno Creativo</span>
									<span class="block text-xs font-normal text-slate-500 mt-0.5">Sans · barra lateral · color</span>
								</button>
							</div>
						</div>
						<div>
							<h3 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 mb-3">Tipo de CV</h3>
							<div class="bg-slate-200/60 rounded-2xl p-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5" role="tablist" aria-label="Tipo de currículum">
								<button type="button" role="tab" class="cv-tab px-4 py-3 text-sm text-left" data-profile-btn="pro" aria-selected="true">
									<span class="block">Profesional / Académico</span>
									<span class="block text-xs font-normal text-slate-500 mt-0.5">Con formación y títulos</span>
								</button>
								<button type="button" role="tab" class="cv-tab px-4 py-3 text-sm text-left" data-profile-btn="practical" aria-selected="false">
									<span class="block">Práctico / Sin títulos</span>
									<span class="block text-xs font-normal text-slate-500 mt-0.5">Experiencia, habilidades y logros</span>
								</button>
							</div>
						</div>
					</div>

					<!-- Formulario -->
					<div class="glass rounded-3xl p-4 sm:p-6">
						<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
							<h3 class="sr-only">Tus datos</h3>
							<div class="bg-slate-200/60 rounded-2xl p-1.5 flex gap-1 overflow-x-auto max-w-full" role="tablist" aria-label="Secciones del formulario">
								<button type="button" role="tab" class="cv-tab px-3.5 py-2 text-sm" data-form-tab="personal" aria-selected="true"><span data-tab-label>Datos personales</span></button>
								<button type="button" role="tab" class="cv-tab px-3.5 py-2 text-sm" data-form-tab="experience" aria-selected="false" tabindex="-1"><span data-tab-label>Experiencia</span></button>
								<button type="button" role="tab" class="cv-tab px-3.5 py-2 text-sm" data-form-tab="education" aria-selected="false" tabindex="-1"><span data-tab-label>Educación</span><span data-opt-badge hidden class="ml-1.5 rounded-full bg-slate-300/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">Opcional</span></button>
								<button type="button" role="tab" class="cv-tab px-3.5 py-2 text-sm" data-form-tab="skills" aria-selected="false" tabindex="-1"><span data-tab-label>Habilidades</span></button>
								<button type="button" role="tab" class="cv-tab px-3.5 py-2 text-sm" data-form-tab="achievements" data-profile-only="practical" hidden aria-selected="false" tabindex="-1"><span data-tab-label>Logros prácticos</span></button>
							</div>
							<div class="flex gap-3 text-xs font-semibold">
								<button type="button" class="cv-btn text-indigo-600 hover:text-indigo-800 rounded px-1" data-load-sample>Cargar ejemplo</button>
								<button type="button" class="cv-btn text-slate-500 hover:text-slate-800 rounded px-1" data-clear>Vaciar</button>
							</div>
						</div>

						<!-- Datos personales + foto -->
						<div data-form-panel="personal" class="space-y-5 cv-fade">
							<div id="photo-drop" class="cv-drop flex items-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-4">
								<div class="relative w-16 h-16 shrink-0 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400">
									<img id="photo-thumb" alt="Miniatura de tu foto" width="64" height="64" hidden class="w-full h-full object-cover">
									<svg id="photo-empty" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
								</div>
								<div class="min-w-0 flex-1">
									<div class="text-sm font-semibold text-slate-800">Foto de perfil <span class="font-normal text-slate-500">(opcional)</span></div>
									<p class="text-xs text-slate-500 mt-0.5">Arrastra una imagen o elige un archivo. JPG, PNG o WebP · máx. 5 MB. Se procesa solo en tu navegador.</p>
									<div class="mt-2 flex flex-wrap items-center gap-3">
										<label class="cv-file inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition">
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"/></svg>
											Subir foto
											<input id="photo-input" data-photo-file class="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif">
										</label>
										<button id="photo-remove" type="button" hidden data-photo-remove class="cv-btn text-xs font-semibold text-rose-600 hover:text-rose-700 rounded px-1">Quitar foto</button>
									</div>
									<p id="photo-msg" data-photo-msg class="mt-1.5 text-xs text-rose-600 min-h-[1rem]" role="status" aria-live="polite"></p>
								</div>
							</div>

							<div class="grid sm:grid-cols-2 gap-4">
								<label class="block"><span class="cv-label">Nombre completo</span><input class="cv-input" type="text" data-bind="name" autocomplete="name" placeholder="Ej. Lucía Fernández"></label>
								<label class="block"><span class="cv-label">Profesión / Cargo</span><input class="cv-input" type="text" data-bind="title" placeholder="Ej. Product Designer"></label>
								<label class="block"><span class="cv-label">Email</span><input class="cv-input" type="email" data-bind="email" autocomplete="email" placeholder="tu@email.com"></label>
								<label class="block"><span class="cv-label">Teléfono</span><input class="cv-input" type="tel" data-bind="phone" autocomplete="tel" placeholder="+34 600 000 000"></label>
								<label class="block"><span class="cv-label">Ubicación</span><input class="cv-input" type="text" data-bind="location" placeholder="Ciudad, País"></label>
								<label class="block"><span class="cv-label">Web / LinkedIn</span><input class="cv-input" type="text" data-bind="website" placeholder="www.tusitio.com"></label>
								<label class="block sm:col-span-2"><span class="cv-label">Resumen profesional</span><textarea class="cv-input" data-bind="summary" rows="4" placeholder="Cuenta en 2–3 líneas quién eres y qué aportas."></textarea></label>
							</div>
						</div>

						<!-- Experiencia -->
						<div data-form-panel="experience" hidden class="space-y-4">
							<div id="list-experience" class="space-y-4"></div>
							<button type="button" class="cv-btn w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition" data-add="experience">+ Añadir experiencia</button>
						</div>

						<!-- Educación -->
						<div data-form-panel="education" hidden class="space-y-4">
							<p data-opt-note hidden class="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Esta sección es opcional en el perfil práctico. Si la dejas vacía, no aparecerá en tu CV.</p>
							<div id="list-education" class="space-y-4"></div>
							<button type="button" class="cv-btn w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition" data-add="education">+ Añadir formación</button>
						</div>

						<!-- Habilidades -->
						<div data-form-panel="skills" hidden class="space-y-4" data-skill-box>
							<label class="block">
								<span class="cv-label"><span data-skills-label>Habilidades</span> · escribe y pulsa Enter (o separa con comas)</span>
								<div class="flex gap-2">
									<input id="skill-input" data-skill-input class="cv-input" type="text" maxlength="80" placeholder="Ej. Figma, Liderazgo">
									<button type="button" class="cv-btn shrink-0 rounded-xl bg-slate-900 text-white px-4 text-sm font-semibold hover:bg-slate-700 transition" data-add-skill>Añadir</button>
								</div>
							</label>
							<div id="skill-chips" data-skill-chips class="flex flex-wrap gap-2"></div>
						</div>

						<!-- Logros prácticos -->
						<div data-form-panel="achievements" hidden class="space-y-4">
							<p class="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-800">Proyectos, resultados o responsabilidades que demuestren lo que sabes hacer, aunque no tengan título oficial.</p>
							<div id="list-achievements" class="space-y-4"></div>
							<button type="button" class="cv-btn w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition" data-add="achievements">+ Añadir logro</button>
						</div>
					</div>

					<p class="text-xs text-slate-500 flex items-start gap-2 px-2">
						<span aria-hidden="true">🔒</span>
						<span>Procesado 100% en tu navegador. No guardamos ni enviamos tus datos ni tu foto; si recargas la página, se pierden.</span>
					</p>
				</div>

				<!-- ============ Columna derecha: vista previa A4 ============ -->
				<div class="lg:sticky lg:top-6 space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<h3 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Vista previa A4 · en vivo</h3>
						<button type="button" data-download class="cv-btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a5f] to-indigo-600 text-white px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-xl transition disabled:opacity-60 disabled:cursor-wait">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 20h16"/></svg>
							Descargar PDF
						</button>
					</div>
					<p id="cv-status" data-cv-status class="text-xs text-slate-500 min-h-[1rem]" role="status" aria-live="polite"></p>

					<div id="cv-stage" class="w-full">
						<!-- Reserva 210:297 por CSS (aspect-ratio + contain-intrinsic-size) → CLS 0 -->
						<div id="cv-scaler" class="cv-sheet-wrap relative mx-auto w-full max-w-[794px] rounded-sm">
							<div id="cv-sheet" class="cv-sheet absolute left-0 top-0" role="img" aria-label="Vista previa del currículum"></div>
						</div>
					</div>
				</div>

			</div>

			<!-- ============ MÓVIL (<1024px): asistente por pasos, contenido generado por JS ============ -->
			<div id="cv-mobile" class="cv-mobile-ui">
				<div class="m-top glass rounded-2xl px-4 py-3">
					<div class="flex items-center justify-between gap-3">
						<span id="m-count" class="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Paso 1 de 6</span>
						<button type="button" data-m-preview class="cv-btn rounded-lg px-2 py-1 text-sm font-semibold text-indigo-600">👁️ Vista previa</button>
					</div>
					<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Progreso" aria-valuemin="1" aria-valuemax="6" aria-valuenow="1">
						<div id="m-bar" class="h-full rounded-full bg-gradient-to-r from-[#1e3a5f] to-indigo-600 transition-all duration-300" style="width:16%"></div>
					</div>
					<h3 id="m-title" class="mt-3 text-xl font-extrabold text-slate-900">Estilo y tipo de CV</h3>
					<p id="m-hint" class="text-sm text-slate-500 min-h-[1.25rem]">Elige cómo quieres que se vea.</p>
				</div>

				<div id="m-step" class="py-4 min-h-[480px]"></div>

				<div id="m-bottom" class="m-nav glass">
					<button type="button" data-m-prev disabled class="cv-btn m-btn border border-slate-300 bg-white text-slate-700 disabled:opacity-40">Atrás</button>
					<button type="button" data-m-next data-primary="false" class="cv-btn m-btn m-btn-primary flex-1">Siguiente</button>
				</div>

				<!-- Vista previa a pantalla completa -->
				<div id="m-overlay" class="cv-overlay" role="dialog" aria-modal="true" aria-label="Vista previa del currículum" hidden>
					<div class="cv-overlay-bar">
						<button type="button" data-m-close class="cv-btn m-btn bg-white border border-slate-300 text-slate-800 !px-4">✕ Cerrar</button>
						<div class="flex flex-1 rounded-xl bg-slate-200/70 p-1 gap-1" role="group" aria-label="Estilo">
							<button type="button" class="cv-btn m-seg" data-style-btn="classic" aria-pressed="true">Clásico</button>
							<button type="button" class="cv-btn m-seg" data-style-btn="modern" aria-pressed="false">Moderno</button>
						</div>
					</div>
					<div class="cv-overlay-body">
						<div id="m-scaler" class="cv-sheet-wrap relative mx-auto w-full max-w-[794px] rounded-sm">
							<div id="m-sheet" class="cv-sheet absolute left-0 top-0" role="img" aria-label="Vista previa del currículum"></div>
						</div>
					</div>
					<div class="cv-overlay-foot">
						<p data-cv-status class="text-xs text-slate-600 min-h-[1rem] mb-2" role="status" aria-live="polite"></p>
						<button type="button" data-download class="cv-btn m-btn m-btn-primary w-full disabled:opacity-60">Descargar PDF</button>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>
<!-- /wp:html -->
