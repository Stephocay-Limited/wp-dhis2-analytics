export const DashboardLists = props => {
    const dashboards = props;
    console.log(dashboards);

    const listDashboards = dashboards.map((dashboard) =>
        <li key={dashboard.id}>{dashboard.name}</li> 
    );
    return (
        <div className="dashboard-list">
            <ul>
                {
                    listDashboards
                }
            </ul>
        </div>
    );
}