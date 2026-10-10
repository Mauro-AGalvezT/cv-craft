/**
 * CV Craft Premium – generador de CV en tiempo real.
 * Todo se procesa en el navegador: ni los datos ni la foto se envían a ningún servidor.
 *
 * Dos interfaces sobre el MISMO estado:
 *  - Escritorio (≥1024px): formulario por pestañas + hoja A4 en vivo (.cv-desktop).
 *  - Móvil (<1024px): asistente por pasos con barra inferior y vista previa a pantalla completa (#cv-mobile).
 */
(function () {
	'use strict';

	var app = document.getElementById('cv-app');
	if (!app) { return; }

	var PAGE_W = 794; // 210 mm a 96 dpi
	var PAGE_H = 1123; // 297 mm
	var MAX_PHOTO_BYTES = 5 * 1024 * 1024;
	var PHOTO_PX = 600;

	var mq = window.matchMedia('(min-width: 1024px)');
	function isMobile() { return !mq.matches; }

	/* ---------- Datos ---------- */
	var SAMPLE = {
		personal: {
			name: 'Lucía Fernández Ortega',
			title: 'Product Designer Senior',
			email: 'lucia.fernandez@email.com',
			phone: '+34 600 123 456',
			location: 'Madrid, España',
			website: 'www.luciafernandez.com',
			summary: 'Diseñadora de producto con más de 8 años de experiencia creando experiencias digitales claras y medibles. Lidero equipos multidisciplinares y conecto la investigación con el negocio.'
		},
		experience: [
			{ role: 'Lead Product Designer', company: 'Nubix Technologies', period: '2021 – Actual', desc: 'Lidero un equipo de 6 diseñadores en la plataforma SaaS principal.\nRediseño del onboarding: +32% de activación en 6 meses.' },
			{ role: 'UX/UI Designer', company: 'Studio Alba', period: '2017 – 2021', desc: 'Diseño de apps móviles y sistemas de diseño para clientes de banca y retail.' }
		],
		education: [
			{ degree: 'Grado en Diseño Digital', school: 'Universidad Politécnica de Madrid', period: '2013 – 2017' },
			{ degree: 'Máster en Experiencia de Usuario', school: 'IED Madrid', period: '2018' }
		],
		achievements: [
			{ title: 'Sistema de diseño desde cero', desc: 'Reduje un 40% el tiempo de entrega entre diseño y desarrollo.' },
			{ title: 'Ponente en conferencias de UX', desc: 'Tres charlas sobre accesibilidad ante más de 300 asistentes.' }
		],
		skills: ['Figma', 'Design Systems', 'Investigación de usuarios', 'Prototipado', 'Accesibilidad', 'Liderazgo']
	};

	var EMPTY = {
		personal: { name: '', title: '', email: '', phone: '', location: '', website: '', summary: '' },
		experience: [], education: [], achievements: [], skills: []
	};

	var FIELDS = {
		experience: [
			['role', 'Puesto', 'input', 'Ej. Product Designer'],
			['company', 'Empresa', 'input', 'Ej. Acme S.L.'],
			['period', 'Periodo', 'input', 'Ej. 2021 – Actual'],
			['desc', 'Descripción y logros', 'textarea', 'Una línea por logro']
		],
		education: [
			['degree', 'Título', 'input', 'Ej. Grado en Diseño'],
			['school', 'Institución', 'input', 'Ej. Universidad de…'],
			['period', 'Periodo', 'input', 'Ej. 2013 – 2017']
		],
		achievements: [
			['title', 'Logro o proyecto', 'input', 'Ej. Monté el sistema de pedidos del local'],
			['desc', 'Detalle', 'textarea', 'Qué hiciste y qué resultado tuvo']
		]
	};
	var KIND_LABEL = { experience: 'Experiencia', education: 'Formación', achievements: 'Logro' };
	var LISTS = ['experience', 'education', 'achievements'];

	// Campos personales del asistente móvil: [clave, etiqueta, tipo, atributos, placeholder]
	var PERSONAL = [
		['name', 'Nombre completo', 'text', { autocomplete: 'name', autocapitalize: 'words' }, 'Ej. Lucía Fernández'],
		['title', 'Profesión / Cargo', 'text', { autocapitalize: 'sentences' }, 'Ej. Product Designer'],
		['summary', 'Resumen profesional', 'textarea', {}, 'Cuenta en 2–3 líneas quién eres y qué aportas.'],
		['email', 'Email', 'email', { autocomplete: 'email', inputmode: 'email', autocapitalize: 'none' }, 'tu@email.com'],
		['phone', 'Teléfono', 'tel', { autocomplete: 'tel', inputmode: 'tel' }, '+34 600 000 000'],
		['location', 'Ubicación', 'text', { autocomplete: 'address-level2' }, 'Ciudad, País'],
		['website', 'Web / LinkedIn', 'text', { inputmode: 'url', autocapitalize: 'none', autocomplete: 'url' }, 'www.tusitio.com']
	];

	// Orden de las pestañas de escritorio según el perfil (se aplica con CSS `order`).
	var TAB_ORDER = {
		pro: { personal: 0, experience: 1, education: 2, skills: 3, achievements: 4 },
		practical: { personal: 0, experience: 1, skills: 2, achievements: 3, education: 4 }
	};

	var state = clone(SAMPLE);
	state.style = 'classic';
	state.profile = 'pro';
	state.photo = '';

	/* ---------- Utilidades ---------- */
	function clone(o) { return JSON.parse(JSON.stringify(o)); }
	function $(sel, ctx) { return (ctx || document).querySelector(sel); }
	function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
	function practical() { return state.profile === 'practical'; }

	function h(tag, cls, text, children) {
		var n = document.createElement(tag);
		if (cls) { n.className = cls; }
		if (text) { n.textContent = text; }
		if (children) { children.forEach(function (c) { if (c) { n.appendChild(c); } }); }
		return n;
	}

	var ICONS = {
		mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
		phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
		pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
		globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
		user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
		chevron: '<path d="m6 9 6 6 6-6"/>',
		upload: '<path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"/>',
		check: '<path d="m5 12 5 5 9-10"/>'
	};
	// Solo cadenas SVG estáticas (nunca datos del usuario).
	function svg(name, size, cls) {
		var s = h('span', cls || 'shrink-0');
		var px = size || 14;
		s.innerHTML = '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
		return s;
	}
	function icon(name, cls) { return svg(name, 14, cls || 'shrink-0 mt-[2px]'); }

	function filled(entry) {
		return Object.keys(entry).some(function (k) { return String(entry[k]).trim() !== ''; });
	}
	function contacts() {
		var p = state.personal, out = [];
		if (p.email.trim()) { out.push(['mail', p.email.trim()]); }
		if (p.phone.trim()) { out.push(['phone', p.phone.trim()]); }
		if (p.location.trim()) { out.push(['pin', p.location.trim()]); }
		if (p.website.trim()) { out.push(['globe', p.website.trim().replace(/^https?:\/\//i, '')]); }
		return out;
	}
	function initials(name) {
		var parts = name.trim().split(/\s+/).filter(Boolean);
		if (!parts.length) { return 'CV'; }
		return (parts[0][0] + (parts.length > 1 ? parts[1][0] : '')).toUpperCase();
	}
	function photoImg(cls) {
		var img = document.createElement('img');
		img.src = state.photo; // data: URL generada localmente
		img.alt = 'Foto de perfil';
		img.className = cls;
		img.width = 120;
		img.height = 120;
		return img;
	}
	function setSel(btn, on) {
		if (btn.getAttribute('role') === 'tab') { btn.setAttribute('aria-selected', String(on)); }
		else { btn.setAttribute('aria-pressed', String(on)); }
	}

	/* ---------- Plantilla CLÁSICO CORPORATIVO ---------- */
	function renderClassic(sheet) {
		var p = state.personal;
		sheet.className = 'cv-sheet font-lora text-[13px] leading-relaxed text-neutral-800 px-[18mm] py-[16mm]';

		function section(title, body) {
			return h('div', 'mt-6', null, [
				h('div', 'text-center text-[12px] font-semibold tracking-[0.22em] uppercase text-[#1e3a5f] pb-1 border-b border-slate-300', title),
				body
			]);
		}

		var head = h('div', 'text-center');
		if (state.photo) {
			head.appendChild(h('div', 'mx-auto mb-4 w-[104px] h-[104px] p-[3px] border-2 border-[#1e3a5f] bg-white', null, [
				photoImg('block w-full h-full object-cover')
			]));
		}
		head.appendChild(h('div', 'text-[30px] font-semibold tracking-[0.12em] uppercase text-slate-900 leading-tight', p.name.trim() || 'Tu nombre'));
		if (p.title.trim()) { head.appendChild(h('div', 'mt-1 text-[14px] italic text-slate-600', p.title.trim())); }
		var cs = contacts();
		if (cs.length) {
			var line = h('div', 'mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11.5px] text-slate-600');
			cs.forEach(function (c, i) {
				if (i) { line.appendChild(h('span', 'text-[#1e3a5f]', '•')); }
				line.appendChild(h('span', '', c[1]));
			});
			head.appendChild(line);
		}
		head.appendChild(h('div', 'mt-5 border-t-2 border-[#1e3a5f]'));
		head.appendChild(h('div', 'mt-[2px] border-t border-[#1e3a5f]'));
		sheet.appendChild(head);

		var blocks = {
			summary: function () {
				return p.summary.trim() ? section('Perfil', h('p', 'mt-3 text-center text-slate-700 whitespace-pre-line', p.summary.trim())) : null;
			},
			experience: function () {
				var list = state.experience.filter(filled);
				if (!list.length) { return null; }
				var eb = h('div', 'mt-3');
				list.forEach(function (e) {
					eb.appendChild(h('div', 'mb-3 avoid-break', null, [
						h('div', 'flex justify-between gap-4', null, [
							h('span', 'font-semibold text-slate-900', e.role.trim()),
							h('span', 'italic text-slate-500 whitespace-nowrap', e.period.trim())
						]),
						e.company.trim() ? h('div', 'text-[#1e3a5f] font-medium', e.company.trim()) : null,
						e.desc.trim() ? h('div', 'mt-1 text-slate-700 whitespace-pre-line', e.desc.trim()) : null
					]));
				});
				return section('Experiencia laboral', eb);
			},
			education: function () {
				var list = state.education.filter(filled);
				if (!list.length) { return null; }
				var db = h('div', 'mt-3');
				list.forEach(function (e) {
					db.appendChild(h('div', 'mb-2 avoid-break', null, [
						h('div', 'flex justify-between gap-4', null, [
							h('span', 'font-semibold text-slate-900', e.degree.trim()),
							h('span', 'italic text-slate-500 whitespace-nowrap', e.period.trim())
						]),
						e.school.trim() ? h('div', 'text-[#1e3a5f] font-medium', e.school.trim()) : null
					]));
				});
				return section('Formación', db);
			},
			achievements: function () {
				var list = state.achievements.filter(filled);
				if (!list.length) { return null; }
				var ab = h('div', 'mt-3');
				list.forEach(function (a) {
					ab.appendChild(h('div', 'mb-2.5 avoid-break', null, [
						h('div', 'font-semibold text-slate-900', a.title.trim()),
						a.desc.trim() ? h('div', 'text-slate-700 whitespace-pre-line', a.desc.trim()) : null
					]));
				});
				return section('Logros prácticos', ab);
			},
			skills: function () {
				if (!state.skills.length) { return null; }
				if (!practical()) {
					return section('Habilidades', h('p', 'mt-3 text-center text-slate-700', state.skills.join('  •  ')));
				}
				var grid = h('ul', 'mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-slate-700');
				state.skills.forEach(function (s) {
					grid.appendChild(h('li', 'flex gap-2', null, [h('span', 'text-[#1e3a5f]', '▪'), h('span', '', s)]));
				});
				return section('Habilidades técnicas', grid);
			}
		};
		var order = practical()
			? ['summary', 'experience', 'skills', 'achievements', 'education']
			: ['summary', 'experience', 'education', 'skills'];
		order.forEach(function (k) { var n = blocks[k](); if (n) { sheet.appendChild(n); } });
	}

	/* ---------- Plantilla MODERNO CREATIVO ---------- */
	function renderModern(sheet) {
		var p = state.personal;
		sheet.className = 'cv-sheet font-jakarta text-[12.5px] leading-relaxed text-slate-700 flex';

		/* Barra lateral */
		var aside = h('div', 'w-[32%] shrink-0 bg-[#e6edff] px-7 py-10 text-slate-700');
		var frame = 'mb-8 w-[132px] h-[132px] rounded-[28px] overflow-hidden ring-4 ring-white shadow-lg';
		if (state.photo) {
			aside.appendChild(h('div', frame, null, [photoImg('block w-full h-full object-cover')]));
		} else {
			aside.appendChild(h('div', frame + ' bg-indigo-600 text-white flex items-center justify-center text-[34px] font-extrabold', initials(p.name)));
		}

		function asideTitle(t) {
			return h('div', 'text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-700 mb-3', t);
		}
		var cs = contacts();
		if (cs.length) {
			aside.appendChild(asideTitle('Contacto'));
			var list = h('div', 'space-y-2.5 mb-8');
			cs.forEach(function (c) {
				list.appendChild(h('div', 'flex gap-2 items-start text-[11.5px]', null, [
					icon(c[0], 'shrink-0 mt-[2px] text-indigo-600'),
					h('span', 'break-words min-w-0', c[1])
				]));
			});
			aside.appendChild(list);
		}
		if (state.skills.length) {
			aside.appendChild(asideTitle(practical() ? 'Habilidades técnicas' : 'Habilidades'));
			var chips = h('div', 'flex flex-wrap gap-1.5');
			state.skills.forEach(function (s) {
				chips.appendChild(h('span', 'px-2.5 py-1 rounded-full bg-white/85 text-indigo-700 text-[11px] font-semibold', s));
			});
			aside.appendChild(chips);
		}

		/* Columna principal */
		var main = h('div', 'flex-1 min-w-0 px-9 py-10');
		main.appendChild(h('div', 'text-[32px] font-extrabold leading-tight text-slate-900', p.name.trim() || 'Tu nombre'));
		if (p.title.trim()) { main.appendChild(h('div', 'mt-1 text-[15px] font-semibold text-indigo-600', p.title.trim())); }
		if (p.summary.trim()) { main.appendChild(h('p', 'mt-4 text-slate-600 whitespace-pre-line', p.summary.trim())); }

		function mainTitle(t) {
			return h('div', 'flex items-center gap-2 mt-7 mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-slate-900', null, [
				h('span', 'inline-block w-6 h-1 rounded bg-indigo-600'),
				h('span', '', t)
			]);
		}
		function timeline(period, titleText, sub, desc) {
			return h('div', 'relative pl-4 border-l-2 border-indigo-100 mb-4 avoid-break', null, [
				h('span', 'absolute -left-[6px] top-[5px] w-2.5 h-2.5 rounded-full bg-indigo-600'),
				period ? h('div', 'text-[10.5px] font-bold uppercase tracking-wider text-indigo-600', period) : null,
				h('div', 'font-bold text-slate-900 text-[13.5px]', titleText),
				sub ? h('div', 'text-slate-500 font-medium', sub) : null,
				desc ? h('div', 'mt-1 text-slate-600 whitespace-pre-line', desc) : null
			]);
		}
		function addExperience() {
			var exp = state.experience.filter(filled);
			if (!exp.length) { return; }
			main.appendChild(mainTitle('Experiencia laboral'));
			exp.forEach(function (e) { main.appendChild(timeline(e.period.trim(), e.role.trim(), e.company.trim(), e.desc.trim())); });
		}
		function addEducation() {
			var edu = state.education.filter(filled);
			if (!edu.length) { return; }
			main.appendChild(mainTitle('Formación'));
			edu.forEach(function (e) { main.appendChild(timeline(e.period.trim(), e.degree.trim(), e.school.trim(), '')); });
		}
		function addAchievements() {
			var ach = state.achievements.filter(filled);
			if (!ach.length) { return; }
			main.appendChild(mainTitle('Logros prácticos'));
			ach.forEach(function (a) { main.appendChild(timeline('', a.title.trim(), '', a.desc.trim())); });
		}

		addExperience();
		if (practical()) { addAchievements(); addEducation(); } else { addEducation(); }

		sheet.appendChild(aside);
		sheet.appendChild(main);
	}

	/* ---------- Render + escala de la hoja (CLS = 0) ---------- */
	var sheet = $('#cv-sheet');          // escritorio
	var scaler = $('#cv-scaler');
	var msheet = $('#m-sheet');          // móvil (vista previa a pantalla completa)
	var mscaler = $('#m-scaler');
	var raf = 0;

	// La clase se reescribe en cada render, así que la posición va en línea.
	[sheet, msheet].forEach(function (s) {
		s.style.position = 'absolute';
		s.style.left = '0';
		s.style.top = '0';
	});

	function paint(target) {
		target.replaceChildren();
		if (state.style === 'modern') { renderModern(target); } else { renderClassic(target); }
	}

	// El contenedor ya reserva 210:297 por CSS; solo crece si el contenido ocupa más de una página.
	function fitSheet(target, box) {
		var w = box.clientWidth;
		if (!w) { return; }
		var s = w / PAGE_W;
		target.style.transform = 'scale(' + s + ')';
		var needed = target.offsetHeight * s;
		var base = w * PAGE_H / PAGE_W;
		box.style.height = needed > base + 1 ? needed + 'px' : '';
	}
	function fitAll() {
		fitSheet(sheet, scaler);
		fitSheet(msheet, mscaler);
	}

	function render() {
		if (isMobile()) {
			if (!overlay.hidden) { paint(msheet); fitSheet(msheet, mscaler); }
		} else {
			paint(sheet);
			fitSheet(sheet, scaler);
		}
	}
	function schedule() {
		if (raf) { return; }
		raf = requestAnimationFrame(function () { raf = 0; render(); });
	}
	if (window.ResizeObserver) {
		var ro = new ResizeObserver(fitAll);
		[scaler, sheet, mscaler, msheet].forEach(function (n) { ro.observe(n); });
	} else {
		window.addEventListener('resize', fitAll);
	}

	/* ---------- Foto (FileReader → Base64, local) ---------- */
	var photoMsgs = function () { return $all('[data-photo-msg]'); };
	var photoThumb = $('#photo-thumb');
	var photoEmpty = $('#photo-empty');
	var photoRemove = $('#photo-remove');
	var photoDrop = $('#photo-drop');

	function setPhotoMsg(t) { photoMsgs().forEach(function (m) { m.textContent = t || ''; }); }

	function updatePhotoUI() {
		if (state.photo) {
			photoThumb.src = state.photo;
			photoThumb.hidden = false;
			photoEmpty.hidden = true;
			photoRemove.hidden = false;
		} else {
			photoThumb.removeAttribute('src');
			photoThumb.hidden = true;
			photoEmpty.hidden = false;
			photoRemove.hidden = true;
		}
	}

	function handlePhoto(file) {
		setPhotoMsg('');
		if (!file) { return; }
		if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
			setPhotoMsg('Formato no admitido. Usa JPG, PNG, WebP o GIF.');
			return;
		}
		if (file.size > MAX_PHOTO_BYTES) {
			setPhotoMsg('La imagen supera los 5 MB.');
			return;
		}
		var reader = new FileReader();
		reader.onerror = function () { setPhotoMsg('No se pudo leer la imagen.'); };
		reader.onload = function () {
			var img = new Image();
			img.onerror = function () { setPhotoMsg('La imagen no es válida.'); };
			img.onload = function () {
				// Recorte cuadrado centrado y reescalado: el PDF pesa poco y se ve nítido.
				var side = Math.min(img.naturalWidth, img.naturalHeight);
				var out = Math.min(PHOTO_PX, side);
				var c = document.createElement('canvas');
				c.width = out;
				c.height = out;
				var ctx = c.getContext('2d');
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, out, out);
				ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, out, out);
				state.photo = c.toDataURL('image/jpeg', 0.9);
				updatePhotoUI();
				if (isMobile()) { renderMobileStep(); }
				schedule();
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(file);
	}

	// Entrada de archivo (escritorio y móvil) delegada.
	app.addEventListener('change', function (e) {
		var t = e.target;
		if (t.hasAttribute && t.hasAttribute('data-photo-file')) {
			handlePhoto(t.files && t.files[0]);
			t.value = '';
		}
	});
	['dragenter', 'dragover'].forEach(function (ev) {
		photoDrop.addEventListener(ev, function (e) { e.preventDefault(); photoDrop.setAttribute('data-drag', 'true'); });
	});
	['dragleave', 'drop'].forEach(function (ev) {
		photoDrop.addEventListener(ev, function (e) { e.preventDefault(); photoDrop.removeAttribute('data-drag'); });
	});
	photoDrop.addEventListener('drop', function (e) {
		handlePhoto(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]);
	});

	/* ---------- Formulario (campos compartidos) ---------- */
	function setFormValues() {
		$all('[data-bind]').forEach(function (inp) {
			inp.value = state.personal[inp.getAttribute('data-bind')] || '';
		});
	}

	function buildField(kind, i, item, f) {
		var label = h('label', 'block');
		label.appendChild(h('span', 'cv-label', f[1]));
		var inp = document.createElement(f[2]);
		inp.className = 'cv-input';
		if (f[2] === 'input') {
			inp.type = 'text';
			inp.setAttribute('autocapitalize', 'sentences');
		} else {
			inp.rows = (practical() || isMobile()) ? 5 : 3;
		}
		inp.placeholder = f[3];
		inp.value = item[f[0]] || '';
		inp.setAttribute('data-list', kind);
		inp.setAttribute('data-index', String(i));
		inp.setAttribute('data-field', f[0]);
		label.appendChild(inp);
		return label;
	}

	// Lista de escritorio
	function renderList(kind) {
		var box = $('#list-' + kind);
		box.replaceChildren();
		if (!state[kind].length) {
			box.appendChild(h('p', 'text-sm text-slate-500 py-2', 'Aún no has añadido ninguna entrada.'));
		}
		state[kind].forEach(function (item, i) {
			var card = h('div', 'rounded-2xl border border-slate-200 bg-white/70 p-4 space-y-3 cv-fade');
			var top = h('div', 'flex items-center justify-between');
			top.appendChild(h('span', 'text-sm font-bold text-slate-800', KIND_LABEL[kind] + ' ' + (i + 1)));
			var rm = h('button', 'cv-btn text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg', 'Eliminar');
			rm.type = 'button';
			rm.setAttribute('data-remove', kind + ':' + i);
			rm.setAttribute('aria-label', 'Eliminar ' + KIND_LABEL[kind].toLowerCase() + ' ' + (i + 1));
			top.appendChild(rm);
			card.appendChild(top);
			FIELDS[kind].forEach(function (f) { card.appendChild(buildField(kind, i, item, f)); });
			box.appendChild(card);
		});
	}

	// Chips de habilidades (escritorio y móvil)
	function renderChips() {
		$all('[data-skill-chips]').forEach(function (box) {
			box.replaceChildren();
			state.skills.forEach(function (s, i) {
				var chip = h('span', 'inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium', s);
				var x = h('button', 'cv-btn w-7 h-7 rounded-full hover:bg-indigo-100 text-indigo-700 leading-none text-base', '×');
				x.type = 'button';
				x.setAttribute('data-remove-skill', String(i));
				x.setAttribute('aria-label', 'Quitar ' + s);
				chip.appendChild(x);
				box.appendChild(chip);
			});
		});
	}

	function addSkill(raw) {
		raw.split(',').forEach(function (part) {
			var s = part.trim().slice(0, 40);
			if (s && state.skills.length < 30 && state.skills.indexOf(s) === -1) { state.skills.push(s); }
		});
		renderChips();
		schedule();
	}

	function syncList(kind) {
		renderList(kind);
		if (isMobile()) { renderMobileStep(); }
	}

	function refreshAll() {
		setFormValues();
		LISTS.forEach(renderList);
		renderChips();
		updatePhotoUI();
		if (isMobile()) { renderMobileStep(); }
		render();
	}

	/* ---------- Eventos (delegados, comunes a ambas interfaces) ---------- */
	app.addEventListener('input', function (e) {
		var t = e.target;
		if (t.hasAttribute('data-bind')) {
			state.personal[t.getAttribute('data-bind')] = t.value;
			schedule();
		} else if (t.hasAttribute('data-list')) {
			var kind = t.getAttribute('data-list');
			var item = state[kind][parseInt(t.getAttribute('data-index'), 10)];
			if (item) { item[t.getAttribute('data-field')] = t.value; schedule(); }
		}
	});

	app.addEventListener('keydown', function (e) {
		var t = e.target;
		if (t.hasAttribute && t.hasAttribute('data-skill-input') && (e.key === 'Enter' || e.key === ',')) {
			e.preventDefault();
			addSkill(t.value);
			t.value = '';
			return;
		}
		// Flechas en los tablists (respeta orden visual y pestañas ocultas)
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') { return; }
		var tab = t.closest && t.closest('[role="tab"]');
		if (!tab) { return; }
		var list = $all('[role="tab"]', tab.parentNode).filter(function (b) { return !b.hidden; });
		list.sort(function (a, b) { return (parseInt(a.style.order, 10) || 0) - (parseInt(b.style.order, 10) || 0); });
		var i = list.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1);
		var next = list[(i + list.length) % list.length];
		next.focus();
		next.click();
	});

	function onClick(e) {
		var t = e.target.closest('button');
		if (!t) { return; }

		var add = t.getAttribute('data-add');
		if (add) {
			var blank = {};
			FIELDS[add].forEach(function (f) { blank[f[0]] = ''; });
			state[add].push(blank);
			if (isMobile()) {
				mOpen[add] = state[add].length - 1;
				renderMobileStep();
				var card = $('[data-m-entry="' + add + ':' + mOpen[add] + '"]');
				if (card) {
					card.scrollIntoView({ block: 'center', behavior: 'smooth' });
					var f1 = card.querySelector('.cv-input');
					if (f1) { f1.focus({ preventScroll: true }); }
				}
			} else {
				renderList(add);
				var first = $all('#list-' + add + ' .cv-input').slice(0 - FIELDS[add].length)[0];
				if (first) { first.focus(); }
			}
			schedule();
			return;
		}
		var rm = t.getAttribute('data-remove');
		if (rm) {
			var parts = rm.split(':');
			state[parts[0]].splice(parseInt(parts[1], 10), 1);
			if (isMobile()) { mOpen[parts[0]] = -1; }
			syncList(parts[0]);
			schedule();
			return;
		}
		var rs = t.getAttribute('data-remove-skill');
		if (rs !== null) {
			state.skills.splice(parseInt(rs, 10), 1);
			renderChips();
			schedule();
			return;
		}
		if (t.hasAttribute('data-add-skill')) {
			var box = t.closest('[data-skill-box]');
			var si = box && box.querySelector('[data-skill-input]');
			if (si) { addSkill(si.value); si.value = ''; si.focus(); }
			return;
		}
		if (t.hasAttribute('data-photo-remove')) {
			state.photo = '';
			setPhotoMsg('');
			updatePhotoUI();
			if (isMobile()) { renderMobileStep(); }
			schedule();
			return;
		}
		if (t.hasAttribute('data-load-sample')) {
			var keep = { style: state.style, profile: state.profile, photo: state.photo };
			state = clone(SAMPLE);
			state.style = keep.style; state.profile = keep.profile; state.photo = keep.photo;
			refreshAll();
			return;
		}
		if (t.hasAttribute('data-clear')) {
			var keep2 = { style: state.style, profile: state.profile };
			state = clone(EMPTY);
			state.style = keep2.style; state.profile = keep2.profile; state.photo = '';
			setPhotoMsg('');
			refreshAll();
			return;
		}
		if (t.hasAttribute('data-style-btn')) { setStyle(t.getAttribute('data-style-btn')); return; }
		if (t.hasAttribute('data-profile-btn')) { setProfile(t.getAttribute('data-profile-btn')); return; }
		if (t.hasAttribute('data-form-tab')) { setFormTab(t.getAttribute('data-form-tab')); return; }
		if (t.hasAttribute('data-download')) { downloadPdf(); return; }

		/* Móvil */
		if (t.hasAttribute('data-m-next')) { mNext(); return; }
		if (t.hasAttribute('data-m-prev')) { mGo(-1); return; }
		if (t.hasAttribute('data-m-preview')) { openPreview(); return; }
		if (t.hasAttribute('data-m-close')) { closePreview(); return; }
		var tg = t.getAttribute('data-m-toggle');
		if (tg) {
			var tp = tg.split(':');
			mOpen[tp[0]] = mOpen[tp[0]] === parseInt(tp[1], 10) ? -1 : parseInt(tp[1], 10);
			renderMobileStep();
			var opened = $('[data-m-entry="' + tg + '"]');
			if (opened && mOpen[tp[0]] !== -1) { opened.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
		}
	}
	// La vista previa vive en <body> (ver más abajo), así que escucha por su cuenta.
	[app, $('#m-overlay')].forEach(function (root) { root.addEventListener('click', onClick); });

	/* ---------- Estilo, perfil y pestañas de escritorio ---------- */
	function setStyle(name) {
		state.style = name === 'modern' ? 'modern' : 'classic';
		$all('[data-style-btn]').forEach(function (b) {
			setSel(b, b.getAttribute('data-style-btn') === state.style);
		});
		render();
	}

	function currentFormTab() {
		var on = $('[data-form-tab][aria-selected="true"]');
		return on ? on.getAttribute('data-form-tab') : 'personal';
	}

	function setProfile(name) {
		state.profile = name === 'practical' ? 'practical' : 'pro';
		app.setAttribute('data-profile', state.profile);
		$all('[data-profile-btn]').forEach(function (b) {
			setSel(b, b.getAttribute('data-profile-btn') === state.profile);
		});
		var order = TAB_ORDER[state.profile];
		$all('[data-form-tab]').forEach(function (b) {
			var id = b.getAttribute('data-form-tab');
			b.style.order = String(order[id]);
			var only = b.getAttribute('data-profile-only');
			b.hidden = !!only && only !== state.profile;
			b.setAttribute('data-weight',
				practical() ? (id === 'education' ? 'dim' : (id === 'personal' ? '' : 'strong')) : '');
		});
		var badge = $('[data-opt-badge]');
		if (badge) { badge.hidden = !practical(); }
		var note = $('[data-opt-note]');
		if (note) { note.hidden = !practical(); }
		var skillsLabel = $('[data-skills-label]');
		if (skillsLabel) { skillsLabel.textContent = practical() ? 'Habilidades técnicas' : 'Habilidades'; }
		var skillsTab = $('[data-form-tab="skills"] [data-tab-label]');
		if (skillsTab) { skillsTab.textContent = practical() ? 'Habilidades técnicas' : 'Habilidades'; }
		var expTab = $('[data-form-tab="experience"] [data-tab-label]');
		if (expTab) { expTab.textContent = practical() ? 'Experiencia laboral' : 'Experiencia'; }

		if (currentFormTab() === 'achievements' && !practical()) { setFormTab('personal'); }
		LISTS.forEach(renderList);
		if (isMobile()) { renderMobileStep(); }
		render();
	}

	function setFormTab(name) {
		$all('[data-form-tab]').forEach(function (b) {
			var on = b.getAttribute('data-form-tab') === name;
			b.setAttribute('aria-selected', String(on));
			b.tabIndex = on ? 0 : -1;
		});
		$all('[data-form-panel]').forEach(function (p) {
			p.hidden = p.getAttribute('data-form-panel') !== name;
		});
	}

	/* =========================================================
	 * INTERFAZ MÓVIL: asistente por pasos (render propio)
	 * ========================================================= */
	var mStepEl = $('#m-step');
	var mTitle = $('#m-title');
	var mHint = $('#m-hint');
	var mCount = $('#m-count');
	var mBar = $('#m-bar');
	var mPrevBtn = $('[data-m-prev]');
	var mNextBtn = $('[data-m-next]');
	var overlay = $('#m-overlay');
	var mStepId = 'setup';
	var mOpen = { experience: 0, education: 0, achievements: 0 };
	var lastFocus = null;

	// La vista previa es position:fixed: en <body> no depende de ningún ancestro del tema.
	document.body.appendChild(overlay);

	function mSteps() {
		var s = [
			{ id: 'setup', title: 'Estilo y tipo de CV', hint: 'Elige cómo quieres que se vea.' },
			{ id: 'data', title: 'Tus datos', hint: 'Foto y datos de contacto.' },
			{ id: 'experience', title: practical() ? 'Experiencia laboral' : 'Experiencia', hint: 'Toca una entrada para editarla.' }
		];
		if (!practical()) { s.push({ id: 'education', title: 'Formación', hint: 'Estudios y títulos.' }); }
		s.push({ id: 'skills', title: practical() ? 'Habilidades técnicas' : 'Habilidades', hint: 'Escribe y pulsa Añadir.' });
		if (practical()) {
			s.push({ id: 'achievements', title: 'Logros prácticos', hint: 'Proyectos y resultados que demuestran lo que sabes hacer.' });
			s.push({ id: 'education', title: 'Formación', hint: 'Opcional: puedes omitir este paso.', optional: true });
		}
		s.push({ id: 'finish', title: 'Vista previa y descarga', hint: 'Revisa tu CV y descárgalo en PDF.' });
		return s;
	}
	function mIndex() {
		var s = mSteps();
		for (var i = 0; i < s.length; i++) { if (s[i].id === mStepId) { return i; } }
		mStepId = s[0].id;
		return 0;
	}

	function mGo(delta) {
		var s = mSteps();
		var i = Math.max(0, Math.min(s.length - 1, mIndex() + delta));
		mStepId = s[i].id;
		renderMobileStep();
		var top = $('#cv-mobile');
		if (top) { top.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
	}
	function mNext() {
		var s = mSteps();
		if (mStepId === s[s.length - 1].id) { downloadPdf(); return; }
		mGo(1);
	}

	function mField(spec) {
		var label = h('label', 'block');
		label.appendChild(h('span', 'cv-label', spec[1]));
		var inp = document.createElement(spec[2] === 'textarea' ? 'textarea' : 'input');
		inp.className = 'cv-input';
		if (spec[2] === 'textarea') { inp.rows = 5; } else { inp.type = spec[2]; }
		Object.keys(spec[3]).forEach(function (k) { inp.setAttribute(k, spec[3][k]); });
		inp.placeholder = spec[4];
		inp.value = state.personal[spec[0]] || '';
		inp.setAttribute('data-bind', spec[0]);
		label.appendChild(inp);
		return label;
	}

	function mChoice(attr, value, title, desc, selected) {
		var b = h('button', 'm-card cv-btn', null, [
			h('span', 'block text-[15px] font-bold text-slate-900', title),
			h('span', 'block text-sm text-slate-500 mt-0.5', desc)
		]);
		b.type = 'button';
		b.setAttribute(attr, value);
		b.setAttribute('aria-pressed', String(selected));
		return b;
	}

	function mStepSetup() {
		var w = h('div', 'space-y-6 cv-fade');
		var a = h('div', 'space-y-2.5');
		a.appendChild(h('h4', 'text-xs font-bold uppercase tracking-[0.16em] text-slate-500', 'Estilo visual'));
		a.appendChild(mChoice('data-style-btn', 'classic', 'Clásico Corporativo', 'Serif, centrado y sobrio.', state.style === 'classic'));
		a.appendChild(mChoice('data-style-btn', 'modern', 'Moderno Creativo', 'Barra lateral, color y foto redondeada.', state.style === 'modern'));
		var b = h('div', 'space-y-2.5');
		b.appendChild(h('h4', 'text-xs font-bold uppercase tracking-[0.16em] text-slate-500', 'Tipo de CV'));
		b.appendChild(mChoice('data-profile-btn', 'pro', 'Profesional / Académico', 'Con formación y títulos.', state.profile === 'pro'));
		b.appendChild(mChoice('data-profile-btn', 'practical', 'Práctico / Sin títulos', 'Experiencia, habilidades y logros.', state.profile === 'practical'));
		w.appendChild(a);
		w.appendChild(b);
		var tools = h('div', 'flex gap-4 text-sm font-semibold');
		var s1 = h('button', 'cv-btn text-indigo-600 py-2', 'Cargar ejemplo'); s1.type = 'button'; s1.setAttribute('data-load-sample', '');
		var s2 = h('button', 'cv-btn text-slate-500 py-2', 'Vaciar todo'); s2.type = 'button'; s2.setAttribute('data-clear', '');
		tools.appendChild(s1);
		tools.appendChild(s2);
		w.appendChild(tools);
		return w;
	}

	function mStepData() {
		var w = h('div', 'space-y-6 cv-fade');

		var photo = h('div', 'flex items-center gap-4 rounded-2xl bg-white/80 border border-slate-200 p-4');
		var avatar = h('div', 'w-20 h-20 shrink-0 rounded-3xl overflow-hidden bg-slate-100 text-slate-400 flex items-center justify-center');
		if (state.photo) { avatar.appendChild(photoImg('block w-full h-full object-cover')); } else { avatar.appendChild(svg('user', 30)); }
		var side = h('div', 'min-w-0 flex-1');
		side.appendChild(h('div', 'text-[15px] font-bold text-slate-900', 'Foto de perfil'));
		side.appendChild(h('div', 'text-xs text-slate-500', 'Opcional · se queda en tu móvil'));
		var row = h('div', 'mt-2 flex flex-wrap items-center gap-2');
		var pick = h('label', 'cv-file m-btn bg-slate-900 text-white cursor-pointer !min-h-[2.75rem] !px-4 !text-sm');
		pick.appendChild(svg('upload', 16));
		pick.appendChild(document.createTextNode(state.photo ? 'Cambiar' : 'Elegir foto'));
		var fi = document.createElement('input');
		fi.type = 'file';
		fi.accept = 'image/jpeg,image/png,image/webp,image/gif';
		fi.className = 'sr-only';
		fi.setAttribute('data-photo-file', '');
		pick.appendChild(fi);
		row.appendChild(pick);
		if (state.photo) {
			var rm = h('button', 'cv-btn text-sm font-semibold text-rose-600 py-2 px-1', 'Quitar');
			rm.type = 'button';
			rm.setAttribute('data-photo-remove', '');
			row.appendChild(rm);
		}
		side.appendChild(row);
		var msg = h('p', 'mt-1 text-xs text-rose-600 min-h-[1rem]');
		msg.setAttribute('data-photo-msg', '');
		msg.setAttribute('role', 'status');
		side.appendChild(msg);
		photo.appendChild(avatar);
		photo.appendChild(side);
		w.appendChild(photo);

		var g1 = h('div', 'space-y-4');
		g1.appendChild(h('h4', 'text-xs font-bold uppercase tracking-[0.16em] text-slate-500', 'Sobre ti'));
		PERSONAL.slice(0, 3).forEach(function (f) { g1.appendChild(mField(f)); });
		var g2 = h('div', 'space-y-4');
		g2.appendChild(h('h4', 'text-xs font-bold uppercase tracking-[0.16em] text-slate-500', 'Contacto'));
		PERSONAL.slice(3).forEach(function (f) { g2.appendChild(mField(f)); });
		w.appendChild(g1);
		w.appendChild(g2);
		return w;
	}

	function entryHead(kind, item) {
		var t, sub;
		if (kind === 'experience') { t = item.role; sub = [item.company, item.period].filter(Boolean).join(' · '); }
		else if (kind === 'education') { t = item.degree; sub = [item.school, item.period].filter(Boolean).join(' · '); }
		else { t = item.title; sub = ''; }
		return [(t || '').trim() || 'Nueva entrada', (sub || '').trim()];
	}

	function mStepList(kind, addLabel, intro) {
		var w = h('div', 'space-y-3 cv-fade');
		if (intro) { w.appendChild(h('p', 'rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-800', intro)); }
		if (mOpen[kind] === undefined || mOpen[kind] >= state[kind].length) { mOpen[kind] = state[kind].length ? 0 : -1; }

		state[kind].forEach(function (item, i) {
			var open = mOpen[kind] === i;
			var hd = entryHead(kind, item);
			var card = h('div', 'm-entry');
			card.setAttribute('data-m-entry', kind + ':' + i);
			var head = h('button', 'm-entry-head cv-btn');
			head.type = 'button';
			head.setAttribute('data-m-toggle', kind + ':' + i);
			head.setAttribute('aria-expanded', String(open));
			var txt = h('span', 'min-w-0 flex-1', null, [
				h('span', 'block truncate text-[15px] font-bold text-slate-900', hd[0]),
				hd[1] ? h('span', 'block truncate text-sm text-slate-500', hd[1]) : null
			]);
			var chev = svg('chevron', 20, 'shrink-0 text-slate-400 transition-transform' + (open ? ' rotate-180' : ''));
			head.appendChild(txt);
			head.appendChild(chev);
			card.appendChild(head);
			if (open) {
				var body = h('div', 'px-4 pb-4 space-y-4 border-t border-slate-100 pt-4');
				FIELDS[kind].forEach(function (f) { body.appendChild(buildField(kind, i, item, f)); });
				var rm = h('button', 'cv-btn w-full rounded-xl border border-rose-200 py-3 text-sm font-semibold text-rose-600', 'Eliminar esta entrada');
				rm.type = 'button';
				rm.setAttribute('data-remove', kind + ':' + i);
				body.appendChild(rm);
				card.appendChild(body);
			}
			w.appendChild(card);
		});

		if (!state[kind].length) {
			w.appendChild(h('p', 'text-sm text-slate-500 text-center py-4', 'Aún no has añadido nada.'));
		}
		var add = h('button', 'cv-btn w-full rounded-2xl border-2 border-dashed border-slate-300 py-4 text-[15px] font-semibold text-slate-600', addLabel);
		add.type = 'button';
		add.setAttribute('data-add', kind);
		w.appendChild(add);
		return w;
	}

	function mStepSkills() {
		var w = h('div', 'space-y-4 cv-fade');
		w.setAttribute('data-skill-box', '');
		var row = h('div', 'flex gap-2');
		var inp = h('input', 'cv-input');
		inp.type = 'text';
		inp.maxLength = 80;
		inp.placeholder = 'Ej. Figma, Liderazgo';
		inp.setAttribute('data-skill-input', '');
		inp.setAttribute('enterkeyhint', 'done');
		inp.setAttribute('aria-label', 'Nueva habilidad');
		var btn = h('button', 'cv-btn m-btn bg-slate-900 text-white shrink-0', 'Añadir');
		btn.type = 'button';
		btn.setAttribute('data-add-skill', '');
		row.appendChild(inp);
		row.appendChild(btn);
		w.appendChild(row);
		var chips = h('div', 'flex flex-wrap gap-2');
		chips.setAttribute('data-skill-chips', '');
		w.appendChild(chips);
		return w;
	}

	function mStepFinish() {
		var w = h('div', 'space-y-5 cv-fade');
		var p = state.personal;
		var checks = [
			['Nombre', p.name.trim() !== ''],
			['Contacto (email o teléfono)', p.email.trim() !== '' || p.phone.trim() !== ''],
			['Experiencia', state.experience.some(filled)],
			[practical() ? 'Habilidades técnicas' : 'Habilidades', state.skills.length > 0]
		];
		var list = h('ul', 'space-y-2 rounded-2xl bg-white/80 border border-slate-200 p-4');
		checks.forEach(function (c) {
			list.appendChild(h('li', 'flex items-center gap-3 text-[15px] ' + (c[1] ? 'text-slate-800' : 'text-slate-400'), null, [
				h('span', 'w-6 h-6 shrink-0 rounded-full flex items-center justify-center ' + (c[1] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'), null, c[1] ? [svg('check', 14)] : null),
				h('span', '', c[0])
			]));
		});
		w.appendChild(list);

		var prev = h('button', 'cv-btn m-btn w-full bg-white border border-slate-300 text-slate-800', 'Ver vista previa a pantalla completa');
		prev.type = 'button';
		prev.setAttribute('data-m-preview', '');
		w.appendChild(prev);

		var dl = h('button', 'cv-btn m-btn m-btn-primary w-full', 'Descargar PDF');
		dl.type = 'button';
		dl.setAttribute('data-download', '');
		w.appendChild(dl);

		var st = h('p', 'text-xs text-slate-500 min-h-[1rem]');
		st.setAttribute('data-cv-status', '');
		st.setAttribute('role', 'status');
		st.setAttribute('aria-live', 'polite');
		w.appendChild(st);
		w.appendChild(h('p', 'text-xs text-slate-500', '🔒 Tu CV y tu foto se procesan en tu navegador; nada se envía a ningún servidor.'));
		return w;
	}

	function renderMobileStep() {
		var steps = mSteps();
		var i = mIndex();
		var st = steps[i];

		mTitle.textContent = st.title;
		mHint.textContent = st.hint || '';
		mCount.textContent = 'Paso ' + (i + 1) + ' de ' + steps.length;
		mBar.style.width = ((i + 1) / steps.length * 100) + '%';
		var pb = mBar.parentNode;
		pb.setAttribute('aria-valuemax', String(steps.length));
		pb.setAttribute('aria-valuenow', String(i + 1));

		var node;
		if (st.id === 'setup') { node = mStepSetup(); }
		else if (st.id === 'data') { node = mStepData(); }
		else if (st.id === 'experience') { node = mStepList('experience', '+ Añadir experiencia', ''); }
		else if (st.id === 'education') { node = mStepList('education', '+ Añadir formación', st.optional ? 'Si no tienes títulos, pulsa «Omitir»: no aparecerá en tu CV.' : ''); }
		else if (st.id === 'achievements') { node = mStepList('achievements', '+ Añadir logro', 'Cosas que has hecho y han funcionado, con o sin título oficial.'); }
		else if (st.id === 'skills') { node = mStepSkills(); }
		else { node = mStepFinish(); }
		mStepEl.replaceChildren(node);
		if (st.id === 'skills') { renderChips(); }

		mPrevBtn.disabled = i === 0;
		var last = i === steps.length - 1;
		var skipOnly = st.optional && !state.education.some(filled);
		mNextBtn.textContent = last ? 'Descargar PDF' : (skipOnly ? 'Omitir' : 'Siguiente');
		mNextBtn.setAttribute('data-primary', String(last));
	}

	/* Vista previa a pantalla completa */
	function openPreview() {
		lastFocus = document.activeElement;
		overlay.hidden = false;
		document.documentElement.classList.add('cv-lock');
		paint(msheet);
		fitSheet(msheet, mscaler);
		var c = $('[data-m-close]');
		if (c) { c.focus(); }
	}
	function closePreview() {
		overlay.hidden = true;
		document.documentElement.classList.remove('cv-lock');
		if (lastFocus && lastFocus.focus) { lastFocus.focus({ preventScroll: true }); }
	}
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && !overlay.hidden) { closePreview(); }
	});

	function onMode() {
		app.setAttribute('data-mode', isMobile() ? 'mobile' : 'desktop');
		if (isMobile()) {
			renderMobileStep();
		} else {
			if (!overlay.hidden) { closePreview(); }
			refreshAll();
			return;
		}
		render();
	}
	if (mq.addEventListener) { mq.addEventListener('change', onMode); } else { mq.addListener(onMode); }

	/* ---------- Descarga PDF (100% local) ---------- */
	function slug(s) {
		return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'CV';
	}

	function say(msg) { $all('[data-cv-status]').forEach(function (el) { el.textContent = msg; }); }
	function lockButtons(on) {
		$all('[data-download]').forEach(function (b) { b.disabled = on; });
		mNextBtn.disabled = on && mNextBtn.getAttribute('data-primary') === 'true';
		if (!on) { mNextBtn.disabled = false; }
	}

	function downloadPdf() {
		if (!window.html2pdf) {
			say('No se pudo cargar html2pdf.js. Revisa tu conexión y recarga la página.');
			return;
		}
		lockButtons(true);
		say('Generando PDF…');

		var src = sheet;
		if (isMobile()) { paint(msheet); src = msheet; }

		var copy = src.cloneNode(true);
		copy.removeAttribute('id');
		copy.style.transform = 'none';
		copy.style.position = 'static';
		var holder = document.createElement('div');
		holder.style.cssText = 'position:fixed;left:0;top:0;width:' + PAGE_W + 'px;z-index:-1;pointer-events:none;background:#fff;';
		holder.appendChild(copy);
		document.body.appendChild(holder);

		var opt = {
			margin: 0,
			filename: 'CV-' + slug(state.personal.name) + '.pdf',
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0, windowWidth: PAGE_W },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
			pagebreak: { mode: ['css', 'legacy'], avoid: ['.avoid-break'] }
		};

		var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
		var imgs = Array.prototype.slice.call(copy.querySelectorAll('img')).map(function (im) {
			return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
		});
		Promise.all([fonts].concat(imgs)).then(function () {
			return window.html2pdf().set(opt).from(copy).save();
		}).then(function () {
			say('PDF descargado. Nada se ha enviado a ningún servidor.');
		}).catch(function () {
			say('No se pudo generar el PDF. Inténtalo de nuevo.');
		}).then(function () {
			document.body.removeChild(holder);
			lockButtons(false);
		});
	}

	/* ---------- Init ---------- */
	setFormTab('personal');
	setStyle('classic');
	setProfile('pro');
	refreshAll();
	onMode();
})();
