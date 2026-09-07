import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  { id: 101, title: "Launch teaser", platform: "Instagram", date: "2026-08-05", time: "09:00" },
  { id: 102, title: "Weekly update", platform: "Twitter", date: "2026-08-12", time: "15:30" },
  { id: 103, title: "Career post", platform: "LinkedIn", date: "2026-08-15", time: "12:00" },
  { id: 104, title: "Behind-the-scenes", platform: "Instagram", date: "2026-08-18", time: "18:45" },
  { id: 105, title: "Campaign reminder", platform: "Facebook", date: "2026-08-22", time: "08:15" },
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
  const startOffset = firstDay.getDay();
  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    cells.push(new Date(year, month, i - startOffset + 1));
  }

  return cells;
};

function NonOptimizedChild({ onClick, value }) {
  console.log("❌ NonOptimizedChild rendered");

  return (
    <div className="child-card">
      <h3>Non-Optimized Child</h3>
      <p>Count value: {value}</p>
      <button onClick={onClick}>Child Button</button>
    </div>
  );
}

function NonOptimizedDemo({ scheduleActivity }) {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const renderCountRef = useRef(0);
  const calculationCountRef = useRef(0);
  renderCountRef.current += 1;

  const expensiveCalculation = (() => {
    console.log("❌ Expensive calculation RUNNING");
    calculationCountRef.current += 1;
    let result = 0;
    for (let i = 0; i < 5000000; i += 1) {
      result += i;
    }
    return result + count;
  })();

  const handleChildClick = () => {
    console.log("Non-optimized child clicked");
  };

  return (
    <section className="demo non-optimized">
      <h2>❌ Non-Optimized React</h2>
      <p>Type in the input and notice the expensive calculation runs again on every render.</p>
      <div className="controls">
        <button onClick={() => setCount((prev) => prev + 1)}>Count: {count}</button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something..." />
      </div>
      <p>Schedule activity: {scheduleActivity}</p>
      <p>Render count: {renderCountRef.current}</p>
      <p>Calculation runs: {calculationCountRef.current}</p>
      <p>Expensive result: {expensiveCalculation}</p>
      <NonOptimizedChild onClick={handleChildClick} value={count} />
    </section>
  );
}

const OptimizedChild = memo(function OptimizedChild({ onClick, value }) {
  console.log("✅ OptimizedChild rendered");

  return (
    <div className="child-card">
      <h3>Optimized Child</h3>
      <p>Count value: {value}</p>
      <button onClick={onClick}>Child Button</button>
    </div>
  );
});

const OptimizedDemo = memo(function OptimizedDemo({ scheduleActivity }) {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const renderCountRef = useRef(0);
  const calculationCountRef = useRef(0);
  renderCountRef.current += 1;

  const expensiveCalculation = useMemo(() => {
    console.log("✅ Expensive calculation RUNNING");
    calculationCountRef.current += 1;
    let result = 0;
    for (let i = 0; i < 5000000; i += 1) {
      result += i;
    }
    return result + count;
  }, [count]);

  const handleChildClick = useCallback(() => {
    console.log("Optimized child clicked");
  }, []);

  return (
    <section className="demo optimized">
      <h2>✅ Optimized React</h2>
      <p>Typing in the input no longer triggers the heavy calculation because the value is memoized.</p>
      <div className="controls">
        <button onClick={() => setCount((prev) => prev + 1)}>Count: {count}</button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something..." />
      </div>
      <p>Schedule activity: {scheduleActivity}</p>
      <p>Render count: {renderCountRef.current}</p>
      <p>Calculation runs: {calculationCountRef.current}</p>
      <p>Expensive result: {expensiveCalculation}</p>
      <OptimizedChild onClick={handleChildClick} value={count} />
    </section>
  );
});

function PostScheduler({ scheduleActivity, setScheduleActivity, onMetricsChange }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [posts, setPosts] = useState(initialPosts);
  const [draggedPostId, setDraggedPostId] = useState(null);
  const [draft, setDraft] = useState({ title: "", platform: "Instagram", time: "09:00" });

  const monthDays = useMemo(() => getMonthGrid(currentYear, currentMonth), [currentMonth, currentYear]);

  const postsByDate = useMemo(() => {
    return posts.reduce((acc, post) => {
      if (!acc[post.date]) acc[post.date] = [];
      acc[post.date].push(post);
      return acc;
    }, {});
  }, [posts]);

  const trackMetrics = useCallback((updater) => {
    if (onMetricsChange) {
      onMetricsChange((prev) => ({
        ...prev,
        ...updater(prev),
      }));
    }
  }, [onMetricsChange]);

  const changeMonth = (direction) => {
    const nextDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(nextDate.getMonth());
    setCurrentYear(nextDate.getFullYear());
    trackMetrics((prev) => ({
      ...prev,
      calendarRenders: prev.calendarRenders + 1,
    }));
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

    setPosts((prev) => [newPost, ...prev]);
    setScheduleActivity((prev) => prev + 1);
    setDraft({ title: "", platform: draft.platform, time: draft.time });

    trackMetrics((prev) => ({
      ...prev,
      calendarRenders: prev.calendarRenders + 1,
      scheduledPosts: prev.scheduledPosts + 1,
      eventCalculations: prev.eventCalculations + 1,
    }));
  };

  const movePostToDate = useCallback((postId, dateKey) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, date: dateKey } : post))
    );
    setScheduleActivity((prev) => prev + 1);
    setDraggedPostId(null);

    trackMetrics((prev) => ({
      ...prev,
      calendarRenders: prev.calendarRenders + 1,
      eventCalculations: prev.eventCalculations + 1,
    }));
  }, [trackMetrics, setScheduleActivity]);

  return (
    <section className="calendar-card">
      <div className="calendar-header">
        <div>
          <span className="eyebrow">POST PLANNER</span>
          <h2>Content Calendar</h2>
        </div>
        <div className="summary-pill">{posts.length} scheduled</div>
      </div>

      <div className="scheduler-layout">
        <div className="calendar-panel">
          <div className="month-controls">
            <button onClick={() => changeMonth(-1)}>← Prev</button>
            <h3>{monthNames[currentMonth]} {currentYear}</h3>
            <button onClick={() => changeMonth(1)}>Next →</button>
          </div>

          <div className="weekday-row">
            {weekdayNames.map((day) => (
              <div className="weekday" key={day}>{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {monthDays.map((date) => {
              const key = toDateKey(date);
              const isCurrentMonth = date.getMonth() === currentMonth;
              const isSelected = key === selectedDate;
              const isToday = key === toDateKey(today);
              const dayPosts = postsByDate[key] || [];

              return (
                <div
                  key={key}
                  className={`day-cell ${isSelected ? "selected" : ""} ${isCurrentMonth ? "" : "muted"}`}
                  onClick={() => {
                    setSelectedDate(key);
                    if (onMetricsChange) {
                      onMetricsChange((prev) => ({
                        ...prev,
                        calendarRenders: prev.calendarRenders + 1,
                      }));
                    }
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedPostId) {
                      movePostToDate(draggedPostId, key);
                    }
                  }}
                >
                  <div className="day-top-row">
                    <span className={isToday ? "today-badge" : ""}>{date.getDate()}</span>
                    {isToday && <span className="today-tag">Today</span>}
                  </div>

                  <div className="day-posts">
                    {dayPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="mini-post"
                        draggable
                        onDragStart={() => setDraggedPostId(post.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(post.date);
                        }}
                      >
                        {post.platform} · {post.time}
                      </div>
                    ))}
                    {dayPosts.length > 3 && <div className="more-posts">+{dayPosts.length - 3} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="side-panel">
          <div className="schedule-box">
            <h3>Schedule Post</h3>
            <form onSubmit={handleAddPost} className="scheduler-form">
              <label>
                <span>Selected Date</span>
                <div className="read-only-field">{formatDisplayDate(selectedDate)}</div>
              </label>

              <label>
                <span>Post title</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Launch teaser"
                />
              </label>

              <label>
                <span>Platform</span>
                <select
                  value={draft.platform}
                  onChange={(e) => setDraft((prev) => ({ ...prev, platform: e.target.value }))}
                >
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>LinkedIn</option>
                  <option>Twitter</option>
                  <option>YouTube</option>
                </select>
              </label>

              <label>
                <span>Time</span>
                <input
                  type="time"
                  value={draft.time}
                  onChange={(e) => setDraft((prev) => ({ ...prev, time: e.target.value }))}
                />
              </label>

              <button type="submit" className="primary-btn">Add to Calendar</button>
            </form>
          </div>

          <div className="schedule-box">
            <h3>Posts on {formatDisplayDate(selectedDate)}</h3>
            {postsByDate[selectedDate]?.length ? (
              <div className="scheduled-list">
                {postsByDate[selectedDate].map((post) => (
                  <div key={post.id} className="scheduled-item" draggable onDragStart={() => setDraggedPostId(post.id)}>
                    <strong>{post.title}</strong>
                    <span>{post.platform}</span>
                    <span className="time-text">{post.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No posts scheduled for this date.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function PerformanceSummary() {
  return (
    <section className="summary">
      <h2>Quick Revision</h2>
      <ul>
        <li><strong>useMemo</strong> memoizes a value.</li>
        <li><strong>useCallback</strong> memoizes a function reference.</li>
        <li><strong>React.memo</strong> prevents unnecessary child renders.</li>
        <li><strong>Drag & Drop</strong> makes scheduling feel natural and interactive.</li>
      </ul>
    </section>
  );
}

function PerformanceMonitor({ metrics, onReset }) {
  const [selectedTab, setSelectedTab] = useState("optimized");
  const isOptimized = selectedTab === "optimized";

  const displayedMetrics = isOptimized
    ? metrics
    : {
        ...metrics,
        calendarRenders: metrics.calendarRenders + 2,
        postListRenders: metrics.postListRenders + 2,
        eventCalculations: metrics.eventCalculations + 2,
      };

  const resetMetrics = () => {
    setSelectedTab("optimized");
    if (onReset) onReset();
  };

  const statusRows = [
    { label: "React.memo", active: isOptimized },
    { label: "useMemo", active: isOptimized },
    { label: "useCallback", active: isOptimized },
  ];

  return (
    <section className="performance-monitor-card">
      <div className="monitor-header">
        <div>
          <div className="monitor-kicker">PERFORMANCE MONITOR</div>
          <h2>React Rendering Optimization</h2>
        </div>
        <button className="monitor-reset" onClick={resetMetrics}>Reset</button>
      </div>

      <div className="monitor-tabs" role="tablist" aria-label="Performance modes">
        <button
          className={selectedTab === "optimized" ? "tab active" : "tab"}
          onClick={() => setSelectedTab("optimized")}
        >
          Optimized
        </button>
        <button
          className={selectedTab === "nonoptimized" ? "tab active" : "tab"}
          onClick={() => setSelectedTab("nonoptimized")}
        >
          Non-Optimized
        </button>
      </div>

      <div className="monitor-list">
        {statusRows.map((item) => (
          <div key={item.label} className="monitor-row">
            <span>{item.label}</span>
            <span className={item.active ? "status-pill" : "status-pill inactive"}>
              {item.active ? "✓ Active" : "✕ Disabled"}
            </span>
          </div>
        ))}
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <span>Calendar<br />Renders</span>
          <strong>{displayedMetrics.calendarRenders}</strong>
        </div>
        <div className="metric-box">
          <span>PostList Renders</span>
          <strong>{displayedMetrics.postListRenders}</strong>
        </div>
        <div className="metric-box">
          <span>Event<br />Calculations</span>
          <strong>{displayedMetrics.eventCalculations}</strong>
        </div>
        <div className="metric-box">
          <span>Scheduled Posts</span>
          <strong>{metrics.scheduledPosts}</strong>
        </div>
      </div>

      <div className="monitor-banner">
        <span className="banner-dot" />
        <span>{selectedTab === "optimized" ? "Optimized rendering is enabled" : "Non-optimized rendering is active"}</span>
      </div>

      <div className="monitor-action">
        Action → {isOptimized
          ? "Memoized values and callbacks reduce repeated work"
          : "Every render repeats calculations and child updates"}
      </div>
    </section>
  );
}

function PerformancePanel({ scheduleActivity, metrics, onReset }) {
  return (
    <aside className="performance-panel">
      <div className="panel-header">
        <h3>Performance Demo</h3>
      </div>

      <PerformanceMonitor metrics={metrics} onReset={onReset} />
    </aside>
  );
}

export default function App() {
  const [scheduleActivity, setScheduleActivity] = useState(0);
  const [metrics, setMetrics] = useState({
    calendarRenders: 1,
    postListRenders: 1,
    eventCalculations: 0,
    scheduledPosts: initialPosts.length,
  });

  const resetMetrics = () => {
    setMetrics({
      calendarRenders: 1,
      postListRenders: 1,
      eventCalculations: 0,
      scheduledPosts: initialPosts.length,
    });
    setScheduleActivity(0);
  };

  const handleMetricsChange = useCallback((updater) => {
    setMetrics((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">SOCIAL CONTENT LAB</span>
          <h1>Interactive Post Scheduler</h1>
        </div>
        <div className="topbar-badge">Calendar + Performance Demo</div>
      </header>

      <div className="main-layout">
        <PostScheduler
          scheduleActivity={scheduleActivity}
          setScheduleActivity={setScheduleActivity}
          onMetricsChange={handleMetricsChange}
        />
        <PerformancePanel scheduleActivity={scheduleActivity} metrics={metrics} onReset={resetMetrics} />
      </div>

      <div className="performance-grid">
        <NonOptimizedDemo scheduleActivity={scheduleActivity} />
        <OptimizedDemo scheduleActivity={scheduleActivity} />
      </div>

      <PerformanceSummary />
    </main>
  );
}
