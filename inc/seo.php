<?php
/**
 * SEO técnico: título, meta description, Open Graph / Twitter Cards y JSON-LD.
 *
 * Personalización:
 *  - Filtro `cvcraft_org` para nombre, URL, logo y email de la organización.
 *  - Campo personalizado `cvcraft_meta_description` en cualquier página para su meta description.
 *  - Imagen social por defecto: assets/img/og-default.png (1200×630).
 *
 * @package cv-craft-premium
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Datos de la organización (filtrables).
 *
 * @return array
 */
function cvcraft_org() {
	$logo_path = get_template_directory() . '/assets/img/logo.png';
	$org       = array(
		'name'  => get_bloginfo( 'name' ) ? get_bloginfo( 'name' ) : 'CV Craft',
		'url'   => home_url( '/' ),
		'logo'  => file_exists( $logo_path ) ? get_template_directory_uri() . '/assets/img/logo.png' : '',
		'email' => get_option( 'admin_email' ),
	);
	return apply_filters( 'cvcraft_org', $org );
}

/**
 * Preguntas frecuentes (fuente única para el patrón y para el JSON-LD FAQPage).
 *
 * @return array[] Lista de [pregunta, respuesta].
 */
function cvcraft_faq_items() {
	return array(
		array( __( '¿Guardan mis datos o mi foto?', 'cv-craft-premium' ), __( 'No. Todo se procesa en tu navegador, incluida la foto. Si recargas o cierras la página, la información se borra.', 'cv-craft-premium' ) ),
		array( __( '¿Es gratis crear mi CV?', 'cv-craft-premium' ), __( 'Sí, puedes crear y descargar tu currículum sin registrarte y sin coste.', 'cv-craft-premium' ) ),
		array( __( '¿Qué formato tiene el archivo?', 'cv-craft-premium' ), __( 'PDF en tamaño A4, optimizado para impresión y para enviarlo por correo.', 'cv-craft-premium' ) ),
		array( __( '¿Puedo hacer un CV sin estudios o sin títulos?', 'cv-craft-premium' ), __( 'Sí. El perfil práctico da más peso a tu experiencia, tus habilidades técnicas y tus logros, y la formación es opcional.', 'cv-craft-premium' ) ),
	);
}

/**
 * Título del documento en la portada.
 */
function cvcraft_front_title( $title ) {
	if ( is_front_page() ) {
		return 'Crear CV Gratis Online – Generador de Currículum en PDF';
	}
	return $title;
}
add_filter( 'pre_get_document_title', 'cvcraft_front_title' );

/**
 * Meta description de la página actual.
 *
 * @return string
 */
function cvcraft_meta_description() {
	$default = 'Crea tu CV profesional gratis en segundos: elige estilo clásico o moderno, añade tu foto y descarga un PDF A4. 100% privado y sin registro.';

	if ( is_front_page() ) {
		return $default;
	}

	if ( is_singular() ) {
		$post   = get_queried_object();
		$custom = $post ? get_post_meta( $post->ID, 'cvcraft_meta_description', true ) : '';
		if ( $custom ) {
			return wp_strip_all_tags( $custom );
		}
		$by_slug = array(
			'politica-de-privacidad' => 'Política de privacidad: tus datos y tu foto se procesan 100% en tu navegador y nunca se almacenan en nuestros servidores ni en bases de datos.',
			'terminos-de-servicio'   => 'Términos de servicio y aviso legal del generador gratuito de currículums: condiciones de uso, propiedad intelectual y responsabilidad.',
			'contacto'               => 'Contacta con el equipo del generador de CV: dudas, sugerencias o solicitudes sobre tus datos. Te respondemos lo antes posible.',
		);
		if ( $post && isset( $by_slug[ $post->post_name ] ) ) {
			return $by_slug[ $post->post_name ];
		}
		if ( $post && has_excerpt( $post ) ) {
			return wp_trim_words( wp_strip_all_tags( get_the_excerpt( $post ) ), 28, '…' );
		}
	}

	return $default;
}

/**
 * URL de la imagen social por defecto (si existe el archivo).
 *
 * @return string
 */
function cvcraft_og_image() {
	$path = get_template_directory() . '/assets/img/og-default.png';
	return file_exists( $path ) ? get_template_directory_uri() . '/assets/img/og-default.png' : '';
}

/**
 * Meta description, Open Graph y Twitter Cards.
 */
function cvcraft_print_meta() {
	if ( is_admin() || is_feed() || is_404() || is_search() ) {
		return;
	}

	$org   = cvcraft_org();
	$desc  = cvcraft_meta_description();
	$title = wp_get_document_title();
	$url   = is_singular() ? get_permalink() : home_url( '/' );
	$image = cvcraft_og_image();

	$tags = array(
		array( 'name', 'description', $desc ),
		array( 'name', 'theme-color', '#1e3a5f' ),
		array( 'property', 'og:locale', 'es_ES' ),
		array( 'property', 'og:type', is_front_page() ? 'website' : 'article' ),
		array( 'property', 'og:site_name', $org['name'] ),
		array( 'property', 'og:title', $title ),
		array( 'property', 'og:description', $desc ),
		array( 'property', 'og:url', $url ),
		array( 'name', 'twitter:card', $image ? 'summary_large_image' : 'summary' ),
		array( 'name', 'twitter:title', $title ),
		array( 'name', 'twitter:description', $desc ),
	);
	if ( $image ) {
		$tags[] = array( 'property', 'og:image', $image );
		$tags[] = array( 'property', 'og:image:width', '1200' );
		$tags[] = array( 'property', 'og:image:height', '630' );
		$tags[] = array( 'property', 'og:image:alt', $org['name'] . ' – ' . __( 'Generador de currículum online', 'cv-craft-premium' ) );
		$tags[] = array( 'name', 'twitter:image', $image );
	}

	foreach ( $tags as $tag ) {
		printf( "<meta %s=\"%s\" content=\"%s\">\n", esc_attr( $tag[0] ), esc_attr( $tag[1] ), esc_attr( $tag[2] ) );
	}
}
add_action( 'wp_head', 'cvcraft_print_meta', 5 );

/**
 * Datos estructurados JSON-LD (@graph).
 */
function cvcraft_print_jsonld() {
	if ( is_admin() || is_feed() || is_404() || is_search() ) {
		return;
	}

	$org      = cvcraft_org();
	$home     = $org['url'];
	$org_id   = $home . '#organization';
	$site_id  = $home . '#website';
	$page_url = is_singular() ? get_permalink() : $home;

	$organization = array(
		'@type' => 'Organization',
		'@id'   => $org_id,
		'name'  => $org['name'],
		'url'   => $home,
	);
	if ( ! empty( $org['logo'] ) ) {
		$organization['logo'] = array(
			'@type' => 'ImageObject',
			'url'   => $org['logo'],
		);
	}
	if ( ! empty( $org['email'] ) ) {
		$organization['contactPoint'] = array(
			'@type'             => 'ContactPoint',
			'contactType'       => 'customer support',
			'email'             => $org['email'],
			'availableLanguage' => 'es',
		);
	}

	$graph = array(
		$organization,
		array(
			'@type'       => 'WebSite',
			'@id'         => $site_id,
			'url'         => $home,
			'name'        => $org['name'],
			'inLanguage'  => 'es-ES',
			'publisher'   => array( '@id' => $org_id ),
		),
		array(
			'@type'       => 'WebPage',
			'@id'         => $page_url . '#webpage',
			'url'         => $page_url,
			'name'        => wp_get_document_title(),
			'description' => cvcraft_meta_description(),
			'inLanguage'  => 'es-ES',
			'isPartOf'    => array( '@id' => $site_id ),
		),
	);

	if ( is_front_page() ) {
		$graph[] = array(
			'@type'               => 'WebApplication',
			'@id'                 => $home . '#app',
			'name'                => 'Generador de CV online',
			'url'                 => $home,
			'applicationCategory' => 'BusinessApplication',
			'operatingSystem'     => 'Any',
			'browserRequirements' => 'Requiere JavaScript',
			'inLanguage'          => 'es-ES',
			'isAccessibleForFree' => true,
			'description'         => 'Generador de currículums gratuito con vista previa en tiempo real, dos estilos, foto y descarga en PDF A4 procesada en tu navegador.',
			'featureList'         => array(
				'Estilo clásico corporativo y moderno creativo',
				'Perfil profesional/académico y perfil práctico sin títulos',
				'Carga de foto procesada localmente',
				'Descarga en PDF A4 sin guardar datos en el servidor',
			),
			'offers'              => array(
				'@type'         => 'Offer',
				'price'         => '0',
				'priceCurrency' => 'EUR',
			),
			'publisher'           => array( '@id' => $org_id ),
		);

		$entities = array();
		foreach ( cvcraft_faq_items() as $qa ) {
			$entities[] = array(
				'@type'          => 'Question',
				'name'           => $qa[0],
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => $qa[1],
				),
			);
		}
		$graph[] = array(
			'@type'      => 'FAQPage',
			'@id'        => $home . '#faq',
			'mainEntity' => $entities,
		);
	}

	$data = array(
		'@context' => 'https://schema.org',
		'@graph'   => $graph,
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG ) . "</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'cvcraft_print_jsonld', 6 );

/**
 * Campo personalizado editable para la meta description.
 */
function cvcraft_register_seo_meta() {
	register_post_meta(
		'page',
		'cvcraft_meta_description',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_pages' );
			},
		)
	);
}
add_action( 'init', 'cvcraft_register_seo_meta' );
