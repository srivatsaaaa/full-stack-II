import React, { useMemo, useState } from "react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialPosts = [
  { id: 1, date: "2026-08-05", time: "09:00", platform: "Instagram", title: "Launch teaser" },
  { id: 2, date: "2026-08-12", time: "15:30", platform: "Twitter", title: "Weekly update" },
  { id: 3, date: "2026-08-15", time: "12:00", platform: "LinkedIn", title: "Career post" },
  { id: 4, date: "2026-08-18", time: "18:45", platform: "Instagram", title: "Behind-the-scenes" },
  { id: 5, date: "2026-08-22", time: "08:15", platform: "Facebook", title: "Campaign reminder" },
];

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(year, month, i - startOffset + 1);
    cells.push(date);
  }

  return cells;
};

function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [posts, setPosts] = useState(initialPosts);
  const [draggedPostId, setDraggedPostId] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    platform: "Instagram",
    time: "09:00",
  });

  const monthDays = useMemo(
    () => getMonthGrid(currentYear, currentMonth),
    [currentMonth, currentYear]
  );

  const postsByDate = useMemo(() => {
    return posts.reduce((acc, post) => {
      if (!acc[post.date]) acc[post.date] = [];
      acc[post.date].push(post);
      return acc;
    }, {});
  }, [posts]);

  const changeMonth = (direction) => {
    const nextDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(nextDate.getMonth());
    setCurrentYear(nextDate.getFullYear());
  };

  const handleAddPost = (event) => {
    event.preventDefault();

    if (!draft.title.trim()) return;

    const newPost = {
      id: Date.now(),
      date: selectedDate,
      title: draft.title.trim(),
      platform: draft.platform,
      time: draft.time,
    };

    setPosts((prev) => [...prev, newPost]);
    setDraft({ title: "", platform: draft.platform, time: draft.time });
  };

  const movePostToDate = (postId, dateKey) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, date: dateKey } : post))
    );
    setDraggedPostId(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7ff 0%, #eef8ff 100%)",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(42, 79, 145, 0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #3f6ef6 0%, #7b61ff 100%)",
            color: "#fff",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", letterSpacing: "1.2px", opacity: 0.8 }}>
              CONTENT CALENDAR
            </div>
            <h1 style={{ margin: "8px 0 0", fontSize: "30px" }}>Social Post Scheduler</h1>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.14)",
              padding: "10px 14px",
              borderRadius: "999px",
              fontWeight: "700",
            }}
          >
            {posts.length} posts planned
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", padding: "24px" }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={() => changeMonth(-1)}
                style={navButtonStyle}
              >
                ← Prev
              </button>
              <h2 style={{ margin: 0, fontSize: "28px", color: "#1f2d3d" }}>
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                style={navButtonStyle}
              >
                Next →
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                gap: "8px",
              }}
            >
              {weekdayNames.map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#58657a",
                    padding: "10px 0",
                  }}
                >
                  {day}
                </div>
              ))}

              {monthDays.map((date) => {
                const key = toDateKey(date);
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isSelected = key === selectedDate;
                const isToday = key === toDateKey(today);
                const dayPosts = postsByDate[key] || [];

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggedPostId) {
                        movePostToDate(draggedPostId, key);
                      }
                    }}
                    style={{
                      minHeight: "118px",
                      background: isSelected ? "#eef4ff" : "#f9fbff",
                      border: isSelected ? "2px solid #5d7df5" : "1px solid #e9edf5",
                      borderRadius: "14px",
                      padding: "8px",
                      cursor: "pointer",
                      opacity: isCurrentMonth ? 1 : 0.55,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: isToday ? "#2b5df7" : "#2d3748",
                        }}
                      >
                        {date.getDate()}
                      </span>
                      {isToday && (
                        <span
                          style={{
                            background: "#2b5df7",
                            color: "#fff",
                            borderRadius: "999px",
                            fontSize: "10px",
                            padding: "2px 7px",
                          }}
                        >
                          Today
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {dayPosts.slice(0, 3).map((post) => (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={() => setDraggedPostId(post.id)}
                          onClick={(event) => event.stopPropagation()}
                          style={{
                            background:
                              post.platform === "Instagram"
                                ? "#ffeff1"
                                : post.platform === "Twitter"
                                ? "#ecf6ff"
                                : post.platform === "LinkedIn"
                                ? "#edf9f0"
                                : "#fff7df",
                            color: "#213047",
                            borderRadius: "8px",
                            padding: "4px 6px",
                            fontSize: "11px",
                            lineHeight: "1.4",
                            border: "1px solid rgba(0,0,0,0.04)",
                          }}
                        >
                          <strong>{post.platform}</strong>
                          <div>{post.time}</div>
                          <div>{post.title}</div>
                        </div>
                      ))}

                      {dayPosts.length > 3 && (
                        <div style={{ fontSize: "11px", color: "#4f5d75", fontWeight: 600 }}>
                          +{dayPosts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside
            style={{
              background: "#f8faff",
              border: "1px solid #edf1f9",
              borderRadius: "18px",
              padding: "20px",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#243247" }}>Schedule Post</h3>
            <p style={{ marginTop: "-6px", color: "#58657a" }}>
              Selected date: <strong>{formatDisplayDate(selectedDate)}</strong>
            </p>

            <form onSubmit={handleAddPost} style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Platform</label>
                <select
                  value={draft.platform}
                  onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
                  style={inputStyle}
                >
                  <option>Instagram</option>
                  <option>Twitter</option>
                  <option>LinkedIn</option>
                  <option>Facebook</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Time</label>
                <input
                  type="time"
                  value={draft.time}
                  onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Post Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Example: Product launch"
                  style={inputStyle}
                />
              </div>

              <button type="submit" style={submitButtonStyle}>
                Add to Calendar
              </button>
            </form>

            <div style={{ marginTop: "24px" }}>
              <h4 style={{ color: "#243247", marginBottom: "12px" }}>Posts on selected day</h4>
              {(postsByDate[selectedDate] || []).length === 0 ? (
                <div style={{ color: "#6b7280" }}>No posts scheduled for this day.</div>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {(postsByDate[selectedDate] || []).map((post) => (
                    <div
                      key={post.id}
                      style={{
                        background: "#fff",
                        border: "1px solid #e6ebf5",
                        borderRadius: "12px",
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{post.title}</div>
                      <div style={{ color: "#58657a", fontSize: "13px" }}>
                        {post.platform} • {post.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const navButtonStyle = {
  background: "#eef3ff",
  color: "#243247",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #dfe7fb",
  fontSize: "14px",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#46556f",
  fontWeight: 700,
  fontSize: "13px",
};

const submitButtonStyle = {
  background: "linear-gradient(90deg, #3f6ef6 0%, #7b61ff 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "12px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

export default App;
