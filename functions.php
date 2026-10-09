<?php
/**
 * CV Craft Premium – funciones del tema.
 *
 * @package cv-craft-premium
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CVCRAFT_VERSION', wp_get_theme()->get( 'Version' ) );

require_once get_template_directory() . '/inc/seo.php';

/**
 * URL de Google Fonts (Inter, Lora, Plus Jakarta Sans).
 */
function cvcraft_fonts_url() {
	return 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
}

/**
 * Preload de la hoja de fuentes para adelantar su descarga (menos swap → menos CLS).
 */
function cvcraft_preload_fonts() {
	printf( "<link rel=\"preload\" as=\"style\" href=\"%s\">\n", esc_url( cvcraft_fonts_url() ) );
}
add_action( 'wp_head', 'cvcraft_preload_fonts', 1 );

/**
 * Soporte del tema.
 */
function cvcraft_setup() {
	load_theme_textdomain( 'cv-craft-premium', get_template_directory() . '/languages' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'title-tag' );
}
add_action( 'after_setup_theme', 'cvcraft_setup' );

/**
 * Categoría de patrones propia.
 */
function cvcraft_register_pattern_category() {
	register_block_pattern_category(
		'cv-craft-premium',
		array( 'label' => __( 'CV Craft Premium', 'cv-craft-premium' ) )
	);
}
add_action( 'init', 'cvcraft_register_pattern_category', 5 );

/**
 * ¿La petición actual necesita el generador de CV?
 */
function cvcraft_needs_generator() {
	if ( is_front_page() ) {
		return true;
	}
	if ( is_singular() ) {
		$post = get_post();
		return $post && false !== strpos( $post->post_content, 'id="cv-app"' );
	}
	return false;
}

/**
 * Recursos del front-end: Tailwind v3 (CDN), Google Fonts, html2pdf.js y JS de la app.
 */
function cvcraft_enqueue_assets() {
	// Google Fonts: Inter (app), Lora (clásico), Plus Jakarta Sans (moderno).
	wp_enqueue_style(
		'cvcraft-google-fonts',
		cvcraft_fonts_url(),
		array(),
		null
	);

	// Tailwind CSS v3 por CDN (solo para desarrollo/MVP; migrar a build estático en producción).
	wp_enqueue_script( 'cvcraft-tailwind', 'https://cdn.tailwindcss.com/3.4.17', array(), null, false );
	wp_add_inline_script(
		'cvcraft-tailwind',
		'tailwind.config = {
			corePlugins: { preflight: false },
			theme: { extend: { fontFamily: {
				inter: ["Inter", "system-ui", "sans-serif"],
				lora: ["Lora", "Georgia", "serif"],
				jakarta: ["Plus Jakarta Sans", "Inter", "sans-serif"]
			} } }
		};'
	);

	wp_enqueue_style(
		'cvcraft-app',
		get_template_directory_uri() . '/assets/css/app.css',
		array( 'cvcraft-google-fonts' ),
		CVCRAFT_VERSION
	);

	if ( cvcraft_needs_generator() ) {
		wp_enqueue_script(
			'cvcraft-html2pdf',
			'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
			array(),
			'0.10.1',
			true
		);
		wp_enqueue_script(
			'cvcraft-generator',
			get_template_directory_uri() . '/assets/js/cv-generator.js',
			array( 'cvcraft-html2pdf' ),
			CVCRAFT_VERSION,
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'cvcraft_enqueue_assets' );

/**
 * Preconnect para fuentes.
 */
function cvcraft_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = array( 'href' => 'https://fonts.googleapis.com' );
		$urls[] = array(
			'href'        => 'https://fonts.gstatic.com',
			'crossorigin' => 'anonymous',
		);
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'cvcraft_resource_hints', 10, 2 );

/**
 * Formulario de contacto (admin-post.php). No se guarda nada en base de datos.
 */
function cvcraft_handle_contact() {
	$back = wp_get_referer();
	$back = $back ? remove_query_arg( 'contacto', $back ) : home_url( '/' );

	$finish = function ( $status ) use ( $back ) {
		wp_safe_redirect( add_query_arg( 'contacto', $status, $back ) . '#contacto' );
		exit;
	};

	// Sin nonce: el formulario es HTML estático (patrón) y un nonce caducaría. La protección
	// anti-spam se basa en honeypot + límite por IP. Si usas caché de página, esto es lo correcto.
	// phpcs:disable WordPress.Security.NonceVerification.Missing

	// Honeypot: los bots rellenan este campo oculto.
	if ( ! empty( $_POST['cvcraft_website'] ) ) {
		$finish( 'ok' );
	}

	// Límite simple: un envío cada 30 s por IP.
	$ip_key = 'cvcraft_rl_' . md5( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' );
	if ( get_transient( $ip_key ) ) {
		$finish( 'espera' );
	}

	$name    = isset( $_POST['cvcraft_name'] ) ? sanitize_text_field( wp_unslash( $_POST['cvcraft_name'] ) ) : '';
	$email   = isset( $_POST['cvcraft_email'] ) ? sanitize_email( wp_unslash( $_POST['cvcraft_email'] ) ) : '';
	$message = isset( $_POST['cvcraft_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['cvcraft_message'] ) ) : '';
	$consent = ! empty( $_POST['cvcraft_consent'] );

	if ( '' === $name || ! is_email( $email ) || strlen( $message ) < 10 || strlen( $message ) > 5000 || ! $consent ) {
		$finish( 'invalido' );
	}

	$subject = sprintf(
		/* translators: %s: nombre del remitente */
		__( '[CV Craft] Nuevo mensaje de %s', 'cv-craft-premium' ),
		$name
	);
	$body    = sprintf( "Nombre: %s\nEmail: %s\n\n%s", $name, $email, $message );
	$headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );

	$sent = wp_mail( get_option( 'admin_email' ), $subject, $body, $headers );
	if ( $sent ) {
		set_transient( $ip_key, 1, 30 );
	}
	$finish( $sent ? 'ok' : 'error' );
}
add_action( 'admin_post_nopriv_cvcraft_contact', 'cvcraft_handle_contact' );
add_action( 'admin_post_cvcraft_contact', 'cvcraft_handle_contact' );
