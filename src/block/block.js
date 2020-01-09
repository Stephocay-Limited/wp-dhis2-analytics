/**
 * BLOCK: dhis2-analytics
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';
import axios from 'axios';
import { BorderAll, Help, Public, BarChart} from '@material-ui/icons';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const { Component } = wp.element;
const { PanelBody, SelectControl, TextControl, ToggleControl } = wp.components;

// eslint-disable-next-line no-undef
const dhis_settings = osxGlobal.dhis2setting;
const dhis2_uri = dhis_settings.dhis2_uri;
const dhis2_username = dhis_settings.dhis2_username;
const dhis2_password = dhis_settings.dhis2_password;
const dashboard_url = dhis2_uri + '/api/dashboards.json?paging=false&fields=id,name,dashboardItems[type,reportTable[id,displayName],chart[id,displayName],map[id,displayName]]';

const getDashboards = async () => {
	const res = await axios.get(dashboard_url, {
		params: {},
		withCredentials: true,
		auth: {
			username: dhis2_username,
			password: dhis2_password,
		},
	});
	return res.data;
};
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
			default: [],
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
	edit: class extends Component {
		constructor() {
			super(...arguments);
			this.state = { dhisdata: [], expanded: null };
		}

		onChangeContent = (newContent) => {
			this.props.setAttributes({ content: newContent });
		}

		onChangeCheckboxField = (newValue) => {
			this.props.setAttributes({ checkboxField: newValue });
		}

		onChangeDisplayItem = (newValue) => {
			this.props.setAttributes({ displayItem: newValue });
		};

		onChangeDisplayMode = (newValue) => {
			this.props.setAttributes({ displayMode: newValue });
		};

		onChangeDisplaySize = (newValue) => {
			this.props.setAttributes({ displaySize: newValue });
		};

		onChangeDisplayWidth = (newValue) => {
			this.props.setAttributes({ displayWidth: newValue });
		};

		onChangeDisplayLength = (newValue) => {
			this.props.setAttributes({ displayLength: newValue });
		};

		onChangeEnableCaption = (newValue) => {
			this.props.setAttributes({ enableCaption: newValue });
		};

		handleChange = panel => (event, isExpanded) => {
			this.setState({
				expanded: isExpanded ? panel : false
			})
		};

		componentDidMount() {
			getDashboards().then(data => {
				const filtered = data.dashboards.map(dashboard => {
					const dashboardItems = dashboard.dashboardItems.map(item => {
						return { ...item, data: item.reportTable || item.map || item.chart };
					}).filter(di => {
						return di.data;
					});
					return { ...dashboard, dashboardItems };
				});
				this.setState(
					{ dhisdata: { dashboards: filtered } }
				);
			});
		}
		updateSelectedItems = (item) => (e) => {
			const checked = e.target.checked;
			let { attributes: { dashboard_items } } = this.props;
			if (checked) {
				if (dashboard_items.indexOf(item) === -1) {
					dashboard_items = [...dashboard_items, item];
				}
			} else {
				dashboard_items = dashboard_items.filter(i => {
					return i.data.id !== item.data.id;
				});
			}
			this.props.setAttributes({ dashboard_items });
		};

		render() {
			const { dashboards } = this.state.dhisdata;

			const { displayItem, displayMode, displaySize, displayWidth, displayLength, enableCaption } = this.props.attributes;
			let listDashboards = null;
			if (dashboards) {
				listDashboards = dashboards.filter(d => d.dashboardItems.length > 0).map((dashboard) =>
					<ExpansionPanel expanded={this.state.expanded === dashboard.id} onChange={this.handleChange(dashboard.id)}>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
						>
							<Typography className="dashboard-name" style={{marginTop:0, marginBottom:0}}>{dashboard.name}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>

							<ul className="dashboard-items" style={{margin:0, padding:0}}>
								{
									dashboard.dashboardItems.map((dashboardItem) => {
										const type = dashboardItem.type;
										let icon = <Help className="item-type-icon" />;
										if (type === 'CHART') {
											icon = <BarChart className="item-type-icon" />;
										} else if (type === 'REPORT_TABLE') {
											icon = <BorderAll className="item-type-icon" />;
										} else if (type === 'MAP') {
											icon = <Public className="item-type-icon" />;
										}
										return <li key={dashboardItem.data.id} className="dashboard-item">
											<label htmlFor={dashboardItem.data.id} className="dashboard-item-label">
												{icon}
												<span className="dashboard-item-name">{dashboardItem.data.displayName}</span>
												<input type="checkbox"
													checked={this.props.attributes.dashboard_items.map(i => i.data.id).indexOf(dashboardItem.data.id) !== -1}
													value={dashboardItem.data.id}
													id={dashboardItem.data.id}
													onChange={this.updateSelectedItems(dashboardItem)}
													className="select-items"
													style={{ marginLeft: 'auto' }}
												/>
											</label>
										</li>;
									})
								}
							</ul>
						</ExpansionPanelDetails>
					</ExpansionPanel>

				);
			} else {
				listDashboards = 'No Dashboard Found';
			}
			return (
				<div>
					<h4 className="dhis2-header">DHIS2 Dashboard Block Settings</h4>
					<ul className="analytics-dashboards" style={{margin:0, padding:0}}>
						{
							(dashboards) ? listDashboards : <CircularProgress />
						}
					</ul>
					<InspectorControls>
						<PanelBody
							title={__('Display settings')}
							initialOpen={true}
						>
							<SelectControl
								label="Display Items"
								value={displayItem}
								options={[
									{ value: '', label: 'Select Options' },
									{ value: 'single', label: 'Single Item' },
									{ value: 'multiple', label: 'Multiple Items' }
								]}
								onChange={this.onChangeDisplayItem} >
							</SelectControl>
							<SelectControl
								label="Display Mode"
								value={displayMode}
								options={[
									{ value: '', label: 'Select Options' },
									{ value: 'slideshow', label: 'Slideshow Display' },
									{ value: 'stack', label: 'Stacked Display' },
									{ value: 'report', label: 'Report Display' }
								]}
								onChange={this.onChangeDisplayMode} >
							</SelectControl>
							<SelectControl
								label="Display Size"
								value={displaySize}
								options={[
									{ value: '', label: 'Select Options' },
									{ value: 'fullwidth', label: 'Fullwidth' },
									{ value: 'custom', label: 'Custom size' }
								]}
								onChange={this.onChangeDisplaySize} >
							</SelectControl>
							<TextControl label="Custom width (%)" value={displayWidth} onChange={this.onChangeDisplayWidth}></TextControl>
							<TextControl label="Custom Length (%)" value={displayLength} onChange={this.onChangeDisplayLength}></TextControl>
							<ToggleControl label="Enable Captions" checked={enableCaption} onChange={this.onChangeEnableCaption}></ToggleControl>
							{/* Panel items goes here */}
						</PanelBody>
						<PanelBody
							title={__('Slideshow settings')}
							initialOpen={false}
						></PanelBody>
					</InspectorControls>
				</div>
			);
		}
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
	save: () => {
		return (
			null
		);
	},
});
