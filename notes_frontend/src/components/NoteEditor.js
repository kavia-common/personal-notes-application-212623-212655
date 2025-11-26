import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onDelete, saving }) {
  /** Main editor panel for a single note with title, tags, content. */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState((note?.tags || []).join(', '));

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTags((note?.tags || []).join(', '));
  }, [note]);

  const submit = (e) => {
    e?.preventDefault();
    const cleanTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    onSave?.({ title, content, tags: cleanTags });
  };

  return (
    <div className="nv-editor">
      <form onSubmit={submit} className="nv-form">
        <div className="nv-form-row">
          <input
            className="nv-input nv-input-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            aria-label="Note title"
          />
          <div className="nv-editor-actions">
            {note && (
              <button
                type="button"
                className="nv-btn nv-btn-danger"
                onClick={() => onDelete?.(note)}
                aria-label="Delete note"
              >
                Delete
              </button>
            )}
            <button type="submit" className="nv-btn nv-btn-primary" disabled={!!saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="nv-form-row">
          <input
            className="nv-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            aria-label="Tags"
          />
        </div>
        <div className="nv-form-row">
          <textarea
            className="nv-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            aria-label="Note content"
            rows={16}
          />
        </div>
      </form>
    </div>
  );
}
