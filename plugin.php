<?php
/**
 * Plugin Name: DHIS2 Analytics
 * Plugin URI: https://stephocay.com/dhis2-analytics/
 * Description: DHIS2 Analytics is a Wordpress DHIS2 webportal Plugin that allows adding DHIS2 dashboards to a Wordpress website.
 * Author: Stephen Ocaya, HISP Uganda
 * Author URI: https://stephocay.com/
 * Version: 1.0.1
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package OSX
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
