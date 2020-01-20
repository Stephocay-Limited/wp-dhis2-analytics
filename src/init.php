<?php

/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package OSX
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

function remove_theme_jquery_scripts()
{
	//Add other Theme JQUERY for all Custom themes supported here
	wp_dequeue_script('jquery.min');
}
add_action('wp_print_scripts', 'remove_theme_jquery_scripts', 100);


function dhis2_analytics_assets()
{
	// Register block styles for both frontend + backend.
	wp_register_style(
		'dhis2_analytics-style-css', // Handle.
		plugins_url('dist/blocks.style.build.css', dirname(__FILE__)), // Block style CSS.
		array('wp-editor', 'wp-blocks'), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
	wp_enqueue_style('dhis2_analytics-style-css');
	// Register block styles for both frontend + backend.
	wp_register_style(
		'ext-plugin-gray-css', // Handle.
		plugins_url('src/assets/css/v216_ext-plugin-gray.css', dirname(__FILE__)), // Block style CSS.
		array('wp-editor', 'wp-blocks'), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
	wp_enqueue_style('ext-plugin-gray-css');

	// Register block editor styles for backend.
	wp_register_style(
		'dhis2_analytics-editor-css', // Handle.
		plugins_url('dist/blocks.editor.build.css', dirname(__FILE__)), // Block editor CSS.
		array('wp-edit-blocks'), // Dependency to include the CSS after it.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
		false
	);
	wp_enqueue_style('dhis2_analytics-editor-css');

	wp_deregister_script('jquery');
	wp_register_script(
		'jquery', // Handle.
		plugins_url('src/assets/js/jquery.js', dirname(__FILE__)), // JQuery.js: We register the block here.
		array('wp-blocks', 'wp-components', 'wp-element', 'wp-i18n', 'wp-editor'), // Dependencies, defined above.
		false,
		false // Load script in footer.
	);
	wp_enqueue_script('jquery');

	wp_register_script(
		'ext-all-js',
		plugins_url('src/assets/js/ext-all.js', dirname(__FILE__)),
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'jquery'), // Dependencies, defined above.
		null,
		false
	);
	wp_enqueue_script('ext-all-js');

	wp_register_script(
		'dhis2_analytics-js', // Handle.
		plugins_url('/dist/blocks.build.js', dirname(__FILE__)), // Block.build.js: We register the block here. Built with Webpack.
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'jquery', 'ext-all-js'), // Dependencies, defined above.
		false, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		false // Enqueue the script in the footer.
	);

	wp_enqueue_script('dhis2_analytics-js');

	wp_register_script(
		'openlayer-js',
		plugins_url('src/assets/js/openlayers/OpenLayers.js', dirname(__FILE__)),
		['jquery', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('openlayer-js');

	wp_register_script(
		'googlemaps-js',
		plugins_url('src/assets/js/new/googlemaps.js', dirname(__FILE__)),
		['jquery', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('googlemaps-js');

	wp_register_script(
		'plugin-tables-js',
		plugins_url('src/assets/js/new/reporttable.js', dirname(__FILE__)),
		['jquery', 'dhis2_analytics-js', 'ext-all-js', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('plugin-tables-js');

	wp_register_script(
		'plugin-maps-js',
		plugins_url('src/assets/js/new/map.js', dirname(__FILE__)),
		['jquery', 'openlayer-js', 'dhis2_analytics-js', 'ext-all-js', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('plugin-maps-js');

	wp_register_script(
		'plugin-chart-js',
		plugins_url('src/assets/js/new/chart.js', dirname(__FILE__)),
		['jquery', 'ext-all-js', 'dhis2_analytics-js', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('plugin-chart-js');

	wp_register_script(
		'bxslider-js',
		plugins_url('src/assets/bxslider/jquery.bxslider.min.js', dirname(__FILE__)),
		['jquery', 'wp-blocks', 'wp-editor', 'ext-all-js'],
		true,
		false
	);
	wp_enqueue_script('bxslider-js');

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `osxGlobal` object.
	$settings = get_option('dhis2_settings');
	wp_localize_script(
		'dhis2_analytics-js',
		'osxGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path(__DIR__),
			'pluginDirUrl'  => plugin_dir_url(__DIR__),
			'dhis2setting' => $settings,
			// Add more data here that you want to access from `osxGlobal` object.
		]
	);
	// WP Localozed DHIS2 Settings to JS via dhis2
	wp_localize_script('dhis2-analytics-js', 'dhis2', array(
		'settings' => $settings,
	));

	register_block_type(
		'osx/dhis-block',
		array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'dhis2_analytics-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'dhis2_analytics-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'dhis2_analytics-editor-css',
		)
	);
}

add_action('wp_enqueue_scripts', 'dhis2_analytics_assets');
add_action('admin_enqueue_scripts', 'dhis2_analytics_assets');


// Front end Assets ONLY
function dhis2_analytics_style()
{
	wp_enqueue_style(
		'dhis2_analytics-frontend-css',
		plugins_url('src/assets/css/frontend/dhis2-analytics.css', dirname(__FILE__)),
		false
	);

	wp_enqueue_style(
		'bxslider-css',
		plugins_url('src/assets/bxslider/jquery.bxslider.min.css', dirname(__FILE__)),
		false
	);
}

function dhis2_analytics_script()
{
	wp_enqueue_script(
		'dhis2_analytics-frontend-js',
		plugins_url('src/assets/js/frontend/dhis2-analytics.js', dirname(__FILE__)),
		['jquery'],
		false
	);
}
add_action('wp_enqueue_scripts', 'dhis2_analytics_style');
add_action('wp_enqueue_scripts', 'dhis2_analytics_script');

//Creates DYnamic Blocks
add_action('plugins_loaded', 'register_dynamic_block');
function register_dynamic_block()
{
	// Only load if Gutenberg is available.
	if (!function_exists('register_block_type')) {
		return;
	}
	// Hook server side rendering into render callback
	// Make sure name matches registerBlockType in ./index.js
	register_block_type('osx/dhis2-analytics', array(
		'attributes' => array(
			'displaySize' => array(
				'type' => 'string',
				'default' => 'fullwidth',
			),
			'displayMode' => array(
				'type' => 'string',
				'default' => 'slideshow',
			),
			'displayItem' => array(
				'type' => 'string',
				'default' => 'single',
			),
			'enableCaption' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'slideshowSettings' => array(
				'type' => 'object',
				'default' => array(),
			)
		),
		'render_callback' => 'render_dynamic_block'
	));
}

function displayTable($objects, $details)
{
	$elements = json_encode($objects);
?>
	<script>
		var dhis2 = <?php echo $details; ?>;
		var rt_objects = <?php echo $elements; ?>;
		reportTablePlugin.url = dhis2.dhis2_uri;
		reportTablePlugin.username = dhis2.dhis2_username;
		reportTablePlugin.password = dhis2.dhis2_password;
		reportTablePlugin.loadingIndicator = true;
		reportTablePlugin.load(rt_objects);
	</script>
<?php
}

function displayMap($map_analysis, $details)
{
	$map_elements = json_encode($map_analysis);
?>
	<script>
		var dhis2 = <?php echo $details; ?>;
		var mp_objects = <?php echo $map_elements; ?>;
		mapPlugin.url = dhis2.dhis2_uri;
		mapPlugin.username = dhis2.dhis2_username;
		mapPlugin.password = dhis2.dhis2_password;
		mapPlugin.loadingIndicator = true;
		mapPlugin.load(mp_objects);
	</script>
<?php
};


function displayChart($chart_analysis, $details)
{
	$elements = json_encode($chart_analysis);
?>
	<script>
		var dhis2 = <?php echo $details; ?>;
		var ct_objects = <?php echo $elements; ?>;
		// var ct_objects = JSON.parse(chart_objects);
		chartPlugin.url = dhis2.dhis2_uri;
		chartPlugin.username = dhis2.dhis2_username;
		chartPlugin.password = dhis2.dhis2_password;
		chartPlugin.loadingIndicator = true;
		chartPlugin.load(ct_objects);
	</script>
	<?php
};

function gen_uuid()
{
	return sprintf(
		'%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
		// 32 bits for "time_low"
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff),

		// 16 bits for "time_mid"
		mt_rand(0, 0xffff),

		// 16 bits for "time_hi_and_version",
		// four most significant bits holds version number 4
		mt_rand(0, 0x0fff) | 0x4000,

		// 16 bits, 8 bits for "clk_seq_hi_res",
		// 8 bits for "clk_seq_low",
		// two most significant bits holds zero and one for variant DCE1.1
		mt_rand(0, 0x3fff) | 0x8000,

		// 48 bits for "node"
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff)
	);
}

function render_dynamic_block($attributes)
{
	$displayItems = $attributes['displayItem'];
	$displayMode = $attributes['displayMode'];
	$displaySize = $attributes['displaySize'];
	$enableCaption = $attributes['enableCaption'];
	$height = '440px';
	$width = '100%';
	if ($displaySize == 'custom') {
		$height = isset($attributes['displayHeight']) ? $attributes['displayHeight'] : $height;
		$width = isset($attributes['displayWidth']) ? $attributes['displayWidth'] : $width;
	};

	$height_width_style = 'width:' . $width . ';height:' . $height . '; overflow:auto;';
	$slideshowSettings = json_encode($attributes['slideshowSettings']);
	ob_start();
	$dashboard_items = $attributes['dashboard_items'];
	$settings = get_option('dhis2_settings');
	$details = json_encode($settings);
	$base = $settings['dhis2_uri'];
	// $base = $settings['dhis_uri'];

	$reporttable_analysis = array();
	$chart_analysis = array();
	$map_analysis = array();
	$rt_ids = array();
	$map_ids = array();
	$chart_ids = array();

	$rt = 1;
	$mp = 1;
	$ct = 1;
	if (is_array($dashboard_items) && !empty($dashboard_items)) {
		// print_r($dashboard_items);
		foreach ($dashboard_items as $dashboard_item) {

			$type = $dashboard_item['type'];
			$uuid = gen_uuid();
			// echo $type;
			switch ($type) {
				case "REPORT_TABLE":
					$rt_id = $dashboard_item['reportTable']['id'];
					$rt_element = array("el" => "reportTable_" . $uuid, "id" => $rt_id);
					array_push($reporttable_analysis, $rt_element);
					// print_r($reporttable_analysis);
					if (!in_array("reportTable_" . $uuid, $rt_ids)) {
						array_push($rt_ids, "reportTable_" . $uuid);
					}
					$rt++;
					break;
				case 'MAP':
					$map_id = $dashboard_item['map']['id'];
					$map_element = array("url" => $base, "el" => "map_" . $uuid, "id" => $map_id);
					array_push($map_analysis, $map_element);
					if (!in_array("map_" . $uuid, $map_ids)) {
						array_push($map_ids, "map_" . $uuid);
					}
					$mp++;
					break;
				case 'CHART':
					$chart_id = $dashboard_item['chart']['id'];
					$ct_element = array("el" => "chart_" . $uuid, "id" => $chart_id);
					array_push($chart_analysis, $ct_element);

					if (!in_array("chart_" . $uuid, $chart_ids)) {
						array_push($chart_ids, "chart_" . $uuid);
					}
					$ct++;
					break;
				default:
					echo "DHIS2 Analytics Object not supported";
					break;
			}
		}
	}

	if (!empty($reporttable_analysis)) {
		displayTable($reporttable_analysis, $details);
	}
	if (!empty($map_analysis)) {
		displayMap($map_analysis, $details);
	}
	if (!empty($chart_analysis)) {
		displayChart($chart_analysis, $details);
	}
	$all_ids = array_merge($rt_ids, $map_ids, $chart_ids);
	if ($displayItems == "single") {
		$id = $all_ids[0];
	?>
		<div id="<?php echo $id; ?>" style="<?php echo $height_width_style; ?>"></div>
	<?php
	} else {
	?>
		<div class=<?php echo $displayMode; ?> style="height:<?php echo $height; ?>;width:450px;">
			<?php
			if (!empty($all_ids)) {
				foreach ($all_ids as $id) {
			?>
					<div title=<?php echo $id; ?> id=<?php echo $id; ?> style="height:<?php echo $height; ?>;" class="dhis2-slide"></div>
				<?php
				}
			}
			if (strcmp($displayMode, 'slideshow') == 0) {
				?>
				<script>
					var x = <?php echo $slideshowSettings; ?>;
					var defaultConfig = {
						mode: 'fade',
						pause: 20000,
						responsive: true,
						captions: true,
						slideSelector: 'div.dhis2-slide',
						pager: false,
						auto: true,
						autoDirection: true,
						autoHover: true,
						keyboardEnabled: true,
						captions: true,
					}
					// for (var prop in x) {
					// 	defaultConfig[prop] = x[prop];
					// }
					console.log(JSON.stringify(defaultConfig, null, 2));

					$('.slideshow').bxSlider(defaultConfig);
				</script>
			<?php
			} else if (strcmp($displayMode, 'report') == 0) {
			} else if (strcmp($displayMode, 'stacked') == 0) {
			}
			?>

		</div>
<?php
	}
	$output = ob_get_contents(); // collect output
	ob_end_clean(); // Turn off ouput buffer
	return $output; // Print output
}

include __DIR__ . '/lib/settings.php';
//Amin Settings
register_activation_hook(__FILE__, 'get_dhis2_settings');
