
import { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import Auth from "./Auth";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (token && savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  return null;
});
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};

  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [formData, setFormData] = useState({
  company_name: "",
  job_role: "",
  location: "",
  application_date: "",
  status: "Applied",
  job_description: "",
  interview_date: "",
  interview_notes: ""
});

  // Fetch all applications from backend
const fetchApplications = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/applications/all",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Could not fetch applications");
    }

    const data = await response.json();
    setApplications(data);
  } catch (error) {
    console.error("Error fetching applications:", error);
  }
};

useEffect(() => {
  fetchApplications();
}, []);
  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Reset form
  const resetForm = () => {
  setFormData({
    company_name: "",
    job_role: "",
    location: "",
    application_date: "",
    status: "Applied",
    job_description: "",
    interview_date: "",
    interview_notes: ""
  });

  setEditingId(null);
  setShowForm(false);
};

  // Add or update application
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        editingId
          ? `http://localhost:5000/api/applications/${editingId}`
          : "http://localhost:5000/api/applications",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
},
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        editingId
          ? "Application updated successfully!"
          : "Application added successfully!"
      );

      resetForm();
      fetchApplications();

    } catch (error) {
      alert(error.message);
    }
  };

  // Open form with existing application details
  const handleEdit = (app) => {
  setEditingId(app.id);

  setFormData({
    company_name: app.company_name || "",
    job_role: app.job_role || "",
    location: app.location || "",
    application_date: app.application_date
      ? String(app.application_date).slice(0, 10)
      : "",
    status: app.status || "Applied",
    job_description: app.job_description || "",
    interview_date: app.interview_date
      ? String(app.interview_date).replace(" ", "T").slice(0, 16)
      : "",
    interview_notes: app.interview_notes || ""
  });

  setShowForm(true);
};

  // Delete application
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${id}`,
        {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
}
        
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert("Application deleted successfully!");
      fetchApplications();

    } catch (error) {
      alert(error.message);
    }
  };

  // Dashboard statistics
  const total = applications.length;

  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const interviews = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const selected = applications.filter(
    (app) => app.status === "Selected"
  ).length;
  const successRate = total === 0
  ? 0
  : Math.round((selected / total) * 100);
  const interviewRate = total === 0
  ? 0
  : Math.round((interviews / total) * 100);
  const pendingApplications = applications.filter(
  (app) => app.status !== "Selected" && app.status !== "Rejected"
).length;
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const monthlyApplications = applications.filter((app) => {
  if (!app.application_date) return false;

  const date = new Date(app.application_date);

  return (
    date.getMonth() === currentMonth &&
    date.getFullYear() === currentYear
  );
}).length;
const statusCounts = {
  Applied: applications.filter((app) => app.status === "Applied").length,
  Shortlisted: shortlisted,
  Interview: interviews,
  Selected: selected,
  Rejected: applications.filter((app) => app.status === "Rejected").length
};

const mostCommonStatus = total === 0
  ? "No applications"
  : Object.keys(statusCounts).reduce((a, b) =>
      statusCounts[a] >= statusCounts[b] ? a : b
    );
  const statusChartData = {
  labels: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
  datasets: [
    {
      label: "Applications",
      data: [
        applications.filter((app) => app.status === "Applied").length,
        shortlisted,
        interviews,
        selected,
        applications.filter((app) => app.status === "Rejected").length
      ],
      backgroundColor: [
        "#3b82f6",
        "#f59e0b",
        "#8b5cf6",
        "#22c55e",
        "#ef4444"
      ],
      borderWidth: 0
    }
  ]
};
const statusBarData = {
  labels: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
  datasets: [
    {
      label: "Number of Applications",
      data: [
        applications.filter((app) => app.status === "Applied").length,
        shortlisted,
        interviews,
        selected,
        applications.filter((app) => app.status === "Rejected").length
      ],
      backgroundColor: "#3b82f6",
      borderRadius: 6
    }
  ]
};
  
const filteredApplications = applications
  .filter((app) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      app.company_name.toLowerCase().includes(search) ||
      app.job_role.toLowerCase().includes(search) ||
      (app.location || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    const dateA = new Date(a.application_date || 0).getTime();
    const dateB = new Date(b.application_date || 0).getTime();

    return sortOrder === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });

  if (!user) {
  return <Auth onAuthSuccess={setUser} />;
}

return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          ApplyTrack<span> Pro</span>
        </h2>

        <p className="menu-heading">MENU</p>

        <nav>
          <a className="nav-link active" href="#">
            ▦ Dashboard
          </a>

          <a className="nav-link" href="#applications">
            ▤ My Applications
          </a>

          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              setShowForm(true);
            }}
          >
            ＋ Add Application
          </a>

          <a className="nav-link" href="#">
            ◷ Reminders
          </a>
        </nav>

        <div className="sidebar-bottom">
          <p>Stay organized.</p>
          <p>Stay prepared.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back! Here's your application overview.</p>
          </div>

          <div className="profile">
  <div className="profile-icon">A</div>
  <span>My Account</span>

  <button
    onClick={handleLogout}
    style={{
      marginLeft: "15px",
      padding: "8px 14px",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Logout
  </button>
</div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div>
            <h1>Your career journey starts here!</h1>
            <p>
              Keep track of your applications and stay one step ahead.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Application
          </button>
        </section>

        {/* Add / Edit Form */}
        {showForm && (
          <section className="applications-section form-section">

            <h2>
              {editingId ? "Edit Application" : "Add New Application"}
            </h2>

            <form onSubmit={handleSubmit}>

              <label>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Google"
                required
              />

              <label>Job Role *</label>
              <input
                type="text"
                name="job_role"
                value={formData.job_role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                required
              />

              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
              />

              <label>Application Date</label>
              <input
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
              />

              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              <label>Job Description</label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Enter job details..."
                rows="4"
              />
              <label>Interview Date & Time</label>
<input
  type="datetime-local"
  name="interview_date"
  value={formData.interview_date}
  onChange={handleChange}
/>

<label>Interview Notes</label>
<textarea
  name="interview_notes"
  value={formData.interview_notes}
  onChange={handleChange}
  placeholder="Enter interview instructions, meeting link or preparation notes..."
  rows="3"
/>

              <button type="submit" className="add-button">
                {editingId ? "Update Application" : "Save Application"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

            </form>
          </section>
        )}

        {/* Dashboard Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <p>Total Applications</p>
            <h2>{total}</h2>
            <span>All applications tracked</span>
          </div>

          <div className="stat-card">
            <p>Shortlisted</p>
            <h2>{shortlisted}</h2>
            <span>Applications shortlisted</span>
          </div>

          <div className="stat-card">
            <p>Interviews</p>
            <h2>{interviews}</h2>
            <span>Interview opportunities</span>
          </div>

          <div className="stat-card">
            <p>Selected</p>
            <h2>{selected}</h2>
            <span>Successful applications</span>
          </div>

        </section>
        <section className="applications-section">
  <h2>Application Analytics</h2>
  <p>Understand your application status distribution.</p>

  <div style={{ width: "100%", maxWidth: "400px", margin: "30px auto" }}>
    <Doughnut
      data={statusChartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          },
          title: {
            display: true,
            text: "Applications by Status"
          }
        }
      }}
        />
  </div>

  <div style={{
    background: "#f0fdf4",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    marginTop: "20px"
  }}>
    <h3>Selection Success Rate</h3>
    <h1 style={{ color: "#16a34a", fontSize: "36px" }}>
      {successRate}%
    </h1>
    <p>Percentage of applications resulting in selection</p>
    <h3 style={{ marginTop: "20px" }}>Interview Conversion Rate</h3>

<h1 style={{ color: "#2563eb", fontSize: "36px" }}>
  {interviewRate}%
</h1>

<p>Percentage of applications reaching the interview stage</p>
  </div>
  <div style={{
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "25px"
}}>
  <h3 style={{ textAlign: "center" }}>
    Application Status Comparison
  </h3>

  <Bar
    data={statusBarData}
    options={{
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }}
  />
</div>
</section>

        {/* Applications List */}
        <section className="applications-section">
  <h2>Application Insights</h2>
  <p>Get a quick overview of your job search progress.</p>

  <div className="stats-grid">
    <div className="stat-card">
      <p>Pending Applications</p>
      <h2>{pendingApplications}</h2>
      <span>Applications still in progress</span>
    </div>

    <div className="stat-card">
      <p>Applications This Month</p>
      <h2>{monthlyApplications}</h2>
      <span>Applications submitted this month</span>
    </div>

    <div className="stat-card">
      <p>Most Common Status</p>
      <h2>{mostCommonStatus}</h2>
      <span>Your most frequent application status</span>
    </div>
  </div>
</section>
        <section className="applications-section" id="applications">

          <div className="section-header">
            <div>
              <h2>Recent Applications</h2>
              <p>Your latest job and internship applications.</p>
            </div>
          </div>

{/* Search, Filter and Sort Controls */}
<div className="filter-controls">

  <input
    type="text"
    placeholder="Search company, role or location..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="filter-select"
  >
    <option value="All">All Statuses</option>
    <option value="Applied">Applied</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Interview">Interview</option>
    <option value="Selected">Selected</option>
    <option value="Rejected">Rejected</option>
  </select>

  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="filter-select"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>

</div>


          {applications.length === 0 ? (

            <div className="empty-state">
              <h3>No applications yet</h3>
              <p>Start tracking your job applications here.</p>

              <button
                className="add-button"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                + Add Your First Application
              </button>
            </div>

          ) : (

            <div className="application-list">
              {filteredApplications.length === 0 && (
  <p className="no-results">
    No matching applications found.
  </p>
)}

              {filteredApplications.map((app) => (

                <div className="application-item" key={app.id}>

                  <div>
                    <h3>{app.company_name}</h3>

                    <p>
                      {app.job_role} • {app.location || "Location not specified"}
                    </p>

                    <small>
                      {app.application_date
                        ? String(app.application_date).slice(0, 10)
                        : "Date not specified"}
                    </small>
                  </div>

                  <div className="application-actions">

                    <span className="status-label">
                      {app.status}
                    </span>

                    <button
                      className="edit-button"
                      onClick={() => handleEdit(app)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(app.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>
    </div>
  );
}

export default App;
