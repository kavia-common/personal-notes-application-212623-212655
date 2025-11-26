import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ tags = [], activeTag, onSelectTag }) {
  /** Sidebar for tag filters. */
  return (
    <aside className="nv-sidebar" aria-label="Sidebar with note filters">
      <div className="nv-sidebar-section">
        <div className="nv-sidebar-title">Filters</div>
        <button
          className={`nv-chip ${!activeTag ? 'active' : ''}`}
          onClick={() => onSelectTag(null)}
        >
          All
        </button>
        {tags.map((t) => (
          <button
            key={t}
            className={`nv-chip ${activeTag === t ? 'active' : ''}`}
            onClick={() => onSelectTag(t)}
          >
            #{t}
          </button>
        ))}
      </div>
    </aside>
  );
}
