import axios from 'axios';
import { BorderAll, Help, Public, BarChart } from '@material-ui/icons';
// import Help from '@material-ui/icons/Help';
// import Public from '@material-ui/icons/Public';
// import BarChart from '@material-ui/icons/BarChart';

// import { DashboardLists } from './list_dashboards';
// import Icon from '@material-ui/core/Icon';
const { Component } = wp.element;

// const dhis2settings = dhis2.settings;
// eslint-disable-next-line no-undef
const dhis_settings = osxGlobal.dhis2setting;
// console.log(dhis_settings);

const dhis2_uri = dhis_settings.dhis2_uri;
const dhis2_username = dhis_settings.dhis2_username;
const dhis2_password = dhis_settings.dhis2_passsword;
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
	// console.log(res.data);
	return res.data;
};

export class Dashboards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dhisdata: [],
		};
	}

	// state = {
	//     dhisdata: [],
	// }

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

	render() {
		const { dashboards } = this.state.dhisdata;
		let listDashboards = null;
		const { onChange } = this.props;
		if (dashboards) {
			listDashboards = dashboards.filter(d => d.dashboardItems.length > 0).map((dashboard) =>
				<li className="a-items" key={dashboard.id}>
					<input type="radio" name="ac" id={dashboard.id} />
					<label htmlFor={dashboard.id}>{dashboard.name}</label>
					<div className="a-content">
						<ul className="dashboard-items">
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

									// let isChecked = true;
									return <li key={dashboardItem.data.id} className="dashboard-item">
										<label htmlFor={dashboardItem.data.id} className="dashboard-item-label">
											{icon}
											<span className="dashboard-item-name">{dashboardItem.data.displayName}</span>
											<input
												type="checkbox"
												name="dashboard_items[]"
												value={dashboardItem.data.id}
												id={dashboardItem.data.id}
												onChange={onChange(dashboardItem)}
												className="select-items"
												style={{ marginLeft: 'auto' }}
											/>
										</label>
									</li>;
								})
							}
						</ul>
					</div>
				</li>
			);
		} else {
			listDashboards = 'No Dashboard Found';
		}

		return (
			<div>
				<h1 className="dhis2-header">DHIS2 Dashboard Block Settings</h1>
				<ul className="a-container">
					{
						(dashboards) ? listDashboards : <p className="no-data-found">No Dashboards found</p>
						// this.state.dhisdata ? <div>{JSON.stringify(this.state.dhisdata)}</div> : <div> Loading Dashboards ...</div>
					}
				</ul>
			</div>
		);
	}
}
