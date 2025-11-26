import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function NotesPage() {
  /** Authenticated notes workspace page with 3-pane layout. */
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeTag, setActiveTag] = useState(null);

  const tags = useMemo(() => {
    const set = new Set();
    (notes || []).forEach(n => (n.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [notes]);

  const loadNotes = async (opts = {}) => {
    setLoading(true);
    try {
      const { data } = await api.listNotes(
        { q: opts.search ?? search, tag: opts.tag ?? activeTag, page: opts.page ?? page, pageSize },
        token
      );
      // Expecting array or {items, total}
      const items = Array.isArray(data) ? data : data?.items || [];
      setNotes(items);
      if (items.length && !selected) setSelected(items[0]);
    } catch (e) {
      // Could show alert
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (selected && (selected.id || selected._id)) {
        const id = selected.id || selected._id;
        const { data } = await api.updateNote(id, payload, token);
        const updated = data || { ...payload, id };
        setNotes(prev => prev.map(n => (n.id === id || n._id === id ? updated : n)));
        setSelected(updated);
      } else {
        const { data } = await api.createNote(payload, token);
        const created = data || payload;
        setNotes(prev => [created, ...prev]);
        setSelected(created);
      }
    } catch (e) {
      // Handle error UI if desired
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (n) => {
    if (!n) return;
    const id = n.id || n._id;
    try {
      await api.deleteNote(id, token);
      setNotes(prev => prev.filter(x => (x.id || x._id) !== id));
      setSelected(null);
    } catch (e) {
      // Handle error
    }
  };

  const newNote = () => {
    setSelected({ title: '', content: '', tags: [] });
  };

  return (
    <div className="nv-app">
      <Header />
      <main className="nv-main">
        <div className="nv-layout">
          <Sidebar tags={tags} activeTag={activeTag} onSelectTag={(t) => { setActiveTag(t); setPage(1); loadNotes({ tag: t, page: 1 }); }} />
          <section className="nv-pane">
            <div className="nv-pane-header">
              <h2 className="nv-pane-title">Notes</h2>
              <button className="nv-btn nv-btn-primary" onClick={newNote}>New Note</button>
            </div>
            <NoteList
              notes={notes}
              selectedId={selected?.id || selected?._id}
              onSelect={setSelected}
              onPageChange={(p) => { setPage(p); loadNotes({ page: p }); }}
              page={page}
              pageSize={pageSize}
              total={notes.length}
              onSearch={(q) => { setSearch(q); setPage(1); loadNotes({ search: q, page: 1 }); }}
              search={search}
            />
          </section>
          <section className="nv-pane">
            {loading && <div className="nv-skeleton">Loading notes...</div>}
            {!loading && (
              selected ? (
                <NoteEditor note={selected} onSave={handleSave} onDelete={handleDelete} saving={saving} />
              ) : (
                <div className="nv-empty">Select or create a note to begin.</div>
              )
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
