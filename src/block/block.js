/**
 * BLOCK: dhis2-analytics
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

import { Dashboards } from './components/dashboards';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
// const { BlockControls } = wp.editor.BlockControls;
// import { TextControl } from wp.editor.TextControl;
const { InspectorControls } = wp.editor;
const { PanelBody, SelectControl, TextControl, ToggleControl, CheckboxControl } = wp.components;
let el = wp.element.createElement


/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('osx/dhis2-analytics', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('DHIS2 Analytics'), // Block title.
	icon: 'chart-bar', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__('DHIS2'),
		__('DHIS2 Dashboards'),
		__('DHIS2 Web Portal'),
	],

	attributes: {
		dashboard_description: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		dashboard_items: {
			type: 'array',
			default: []
		},
		checkboxField: {
			type: 'boolean',
			default: true,
		},
		radioField: {
			type: 'string',
			default: 'yes',
		},
		textField: {
			type: 'string',
		},
		displayItem: {
			type: 'string',
		},
		displayMode: {
			type: 'string',
		},
		displaySize: {
			type: 'string',
		},
		displayWidth: {
			type: 'string',
		},
		displayLength: {
			type: 'string',
		},
		enableCaption: {
			type: 'boolean',
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: (props) => {
		console.log(props);
		let content = props.attributes.content,
			checkboxField = props.attributes.checkboxField,
			radioField = props.attributes.radioField,
			textField = props.attributes.textField,
			toggleField = props.attributes.toggleField,
			dashboard_items = props.attributes.dashboard_items,
			displayItem = props.attributes.displayItem,
			displayMode = props.attributes.displayMode,
			displaySize = props.attributes.displaySize,
			displayWidth = props.attributes.displayWidth,
			displayLength = props.attributes.displayLength,
			enableCaption = props.attributes.enableCaption;

		const onChangeContent = (newContent) => {
			props.setAttributes({ content: newContent });
		}

		const onChangeCheckboxField = (newValue) => {
			props.setAttributes({ checkboxField: newValue });
		}

		const onChangeDisplayItem = (newValue) => {
			props.setAttributes({ displayItem: newValue });
		};

		const onChangeDisplayMode = (newValue) => {
			props.setAttributes({ displayMode: newValue });
		};

		const onChangeDisplaySize = (newValue) => {
			props.setAttributes({ displaySize: newValue });
		};

		const onChangeDisplayWidth = (newValue) => {
			props.setAttributes({ displayWidth: newValue });
		};

		const onChangeDisplayLength = (newValue) => {
			props.setAttributes({ displayLength: newValue });
		};

		const onChangeEnableCaption = (newValue) => {
			props.setAttributes({ enableCaption: newValue });
		};

		// Creates a <p class='wp-block-cgb-block-dhis2-analytics'></p>.
		const plugin_url = osxGlobal.pluginDirUrl;
		const updateSelectedItems = (item) => (e) => {
			const checked = e.target.checked;
			let { attributes: { dashboard_items } } = props

			if (checked) {
				if (dashboard_items.indexOf(item) === -1) {
					dashboard_items = [...dashboard_items, item]
				}
			} else {
				dashboard_items = dashboard_items.filter(i => i !== item)
			}
			props.attributes.dashboard_items = dashboard_items;
			// this.setAttributes({ dashboard_items: dashboard_items });
			props.setAttributes({ dashboard_items: props.attributes.dashboard_items })
			// console.log(props)
		};
		return (
			<div className={props.className}>
				<p class="instruction">Select the dashboard items that you want to be display in this block. Please note that for single item display option, you MUST select only one dashboard item </p>
				<Dashboards onChange={updateSelectedItems} />
				<InspectorControls>
					<PanelBody
						title={__('Display settings')}
						initialOpen={true}
					>
						<CheckboxControl label="Tick Me" checked={checkboxField} onChange={
							onChangeCheckboxField}>

						</CheckboxControl>

						<SelectControl
							label="Display Items"
							value={displayItem}
							options={[
								{ value: 'single', label: 'Single Item' },
								{ value: 'multiple', label: 'Multiple Items' }
							]}
							onChange={onChangeDisplayItem} >
						</SelectControl>
						<SelectControl
							label="Display Mode"
							value={displayMode}
							options={[
								{ value: 'slideshow', label: 'Slideshow Display' },
								{ value: 'stack', label: 'Stacked Display' },
								{ value: 'report', label: 'Report Display' }
							]}
							onChange={onChangeDisplayMode} >
						</SelectControl>
						<SelectControl
							label="Display Size"
							value={displaySize}
							options={[
								{ value: 'fullwidth', label: 'Fullwidth' },
								{ value: 'custom', label: 'Custom size' }
							]}
							onChange={onChangeDisplaySize} >
						</SelectControl>
						<TextControl label="Custom width (%)" value={displayWidth} onChange={onChangeDisplayWidth}></TextControl>
						<TextControl label="Custom Length (%)" value={displayLength} onChange={onChangeDisplayLength}></TextControl>
						<ToggleControl label="Enable Captions" checked={enableCaption} onChange={onChangeEnableCaption}></ToggleControl>
						{/* Panel items goes here */}
					</PanelBody>
					<PanelBody
						title={__('Slideshow settings')}
						initialOpen={false}
					></PanelBody>
				</InspectorControls>
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: (props) => {
		// console.log(props);
		return (
			null
		);
	},
});
