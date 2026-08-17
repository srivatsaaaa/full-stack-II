export function DashboardPage({ user, onLogout }) {
  return (
    <div className="page-card">
      <h2>Dashboard</h2>
      <p>Welcome, <strong>{user?.username || "User"}</strong>!</p>
      <p>Role: <strong>{user?.role}</strong></p>
      <p>This page is visible after authentication.</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export function AdminPage() {
  return (
    <div className="page-card">
      <h2>Admin Panel</h2>
      <p>Only users with the <strong>admin</strong> role can access this area.</p>
      <ul>
        <li>Manage users</li>
        <li>View system logs</li>
        <li>Change application settings</li>
      </ul>
    </div>
  );
}

export function EditorPage() {
  return (
    <div className="page-card">
      <h2>Editor Workspace</h2>
      <p>Only users with the <strong>editor</strong> role can access this page.</p>
      <ul>
        <li>Create content</li>
        <li>Edit posts</li>
        <li>Review drafts</li>
      </ul>
    </div>
  );
}

export function ViewerPage() {
  return (
    <div className="page-card">
      <h2>Viewer Area</h2>
      <p>Only users with the <strong>viewer</strong> role can access this page.</p>
      <ul>
        <li>Read reports</li>
        <li>View analytics</li>
        <li>Browse shared documents</li>
      </ul>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="page-card">
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page.</p>
    </div>
  );
}
