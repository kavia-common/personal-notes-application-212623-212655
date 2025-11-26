import React, { useEffect, useMemo, useState } from 'react';

// Sort helpers
const sorters = {
  updated_desc: (a, b) => new Date(b.updated_at || b.updatedAt || b.updated || b.created_at || b.createdAt) - new Date(a.updated_at || a.updatedAt || a.updated || a.created_at || a.createdAt),
  title_asc: (a, b) => (a.title || '').localeCompare(b.title || ''),
};

// PUBLIC_INTERFACE
export default function NoteList({ notes, onSelect, selectedId, onPageChange, page = 1, pageSize = 10, total = 0, onSearch, search = '' }) {
  /** Left list pane with search, sort, pagination and note selection. */
  const [sort, setSort] = useState('updated_desc');
  const [query, setQuery] = useState(search);

  useEffect(() => setQuery(search), [search]);

  const visibleNotes = useMemo(() => {
    const copy = [...(notes || [])];
    const sorter = sorters[sort] || sorters.updated_desc;
    copy.sort(sorter);
    return copy;
  }, [notes, sort]);

  const pages = Math.max(1, Math.ceil((total || notes?.length || 0) / pageSize));

  return (
    <div className="nv-list">
      <div className="nv-list-controls">
        <input
          className="nv-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          aria-label="Search notes"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch?.(query);
          }}
        />
        <select className="nv-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort notes">
          <option value="updated_desc">Recently updated</option>
          <option value="title_asc">Title A-Z</option>
        </select>
        <button className="nv-btn" onClick={() => onSearch?.(query)}>Search</button>
      </div>
      <ul className="nv-items" role="list">
        {visibleNotes.map((n) => (
          <li
            key={n.id || n._id}
            className={`nv-item ${selectedId === (n.id || n._id) ? 'selected' : ''}`}
            onClick={() => onSelect?.(n)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect?.(n)}
          >
            <div className="nv-item-title">{n.title || 'Untitled'}</div>
            <div className="nv-item-snippet">{(n.content || '').slice(0, 80)}</div>
            <div className="nv-item-meta">{(n.tags || []).map((t) => <span className="nv-tag" key={t}>#{t}</span>)}</div>
          </li>
        ))}
      </ul>
      <div className="nv-pagination">
        <button className="nv-btn nv-btn-ghost" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>Prev</button>
        <span className="nv-page-info">Page {page} / {pages}</span>
        <button className="nv-btn nv-btn-ghost" disabled={page >= pages} onClick={() => onPageChange?.(page + 1)}>Next</button>
      </div>
    </div>
  );
}
