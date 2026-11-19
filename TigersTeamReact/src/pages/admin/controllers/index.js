import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import LoadingScreen from 'components/LoadingScreen';
import { useAuth } from 'authContext';
import { useSnackbar } from 'context/SnackbarContext';
import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import {
  SITE_SETTINGS,
  settingSummary,
  settingPayload,
  localDateInput,
} from 'utils/siteSettings.mjs';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import './settings.css';

export default function AdminControllers() {
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [removing, setRemoving] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const endpoint = process.env.REACT_APP_CONTROLLERS_ENDPOINT;
  const headers = { Authorization: `Bearer ${accessToken}` };

  async function load(background = false) {
    if (!background) {
      setLoading(true);
      setError('');
    }
    try {
      const all = [];
      for (let skip = 0; ; skip += 100) {
        const { data } = await axios.get(endpoint, {
          headers,
          params: { skip, limit: 100 },
        });
        if (!Array.isArray(data)) throw new Error('Invalid settings response');
        all.push(...data);
        if (data.length < 100) break;
      }
      setRecords(all);
      setError('');
    } catch {
      if (!background) setError('Settings could not be loaded. Please retry.');
    } finally {
      if (!background) setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  useBackgroundRefresh(() => load(true), Boolean(accessToken));

  function edit(definition, record) {
    setFormError('');
    setEditor({
      definition,
      draft: record
        ? { ...record }
        : {
            name: definition.name,
            value: definition.value,
            value_type: definition.type,
            start_date: null,
            end_date: null,
          },
    });
  }
  function change(field, value) {
    setEditor((previous) => ({
      ...previous,
      draft: { ...previous.draft, [field]: value },
    }));
  }
  async function save(event) {
    event.preventDefault();
    if (saving) return;
    let payload;
    try {
      payload = settingPayload(editor.definition, editor.draft);
    } catch (failure) {
      setFormError(failure.message);
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (editor.draft.id != null)
        await axios.patch(`${endpoint}${editor.draft.id}`, payload, {
          headers,
        });
      else await axios.post(endpoint, payload, { headers });
      setEditor(null);
      showSnackbar('Setting saved. Connected pages will update.', 'success');
      await load(true);
    } catch {
      setFormError(
        'Could not save. Your changes are still here; please retry.',
      );
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    if (deleting || !removing) return;
    setDeleting(true);
    try {
      await axios.delete(`${endpoint}${removing.id}`, { headers });
      setRemoving(null);
      await load(true);
      showSnackbar('Setting removed.', 'success');
    } catch {
      showSnackbar('Could not remove the setting. Please retry.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const unknown = records.filter(
    (record) => !SITE_SETTINGS.some((def) => def.name === record.name),
  );
  const filtered = unknown.filter((record) =>
    record.name.toLowerCase().includes(query.toLowerCase()),
  );
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(filtered.length / 8) - 1),
  );
  const definition = editor?.definition;
  const draft = editor?.draft;
  const type = definition?.type || draft?.value_type;

  return (
    <Box className="site-settings">
      <div className="settings-guide">
        <span className="settings-eyebrow">HOW IT WORKS</span>
        <h2>Choose a feature. See its effect. Save your change.</h2>
        <p>
          Each card explains where a setting is used. Select Configure or Edit,
          change its value, then Save. Nothing changes until you save.
        </p>
      </div>
      {loading && (
        <LoadingScreen fullScreen={false} label="Loading site settings" />
      )}
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => load()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!loading && !error && (
        <>
          <div className="settings-section-heading">
            <h2>Site features</h2>
            <span>{SITE_SETTINGS.length} connected settings</span>
          </div>
          <div className="settings-grid">
            {SITE_SETTINGS.map((def) => {
              const matches = records.filter(
                (record) => record.name === def.name,
              );
              const record = matches[0];
              return (
                <article className="setting-card" key={def.name}>
                  <div className="setting-card-top">
                    <span className="settings-eyebrow">{def.area}</span>
                    <span className="setting-badge">
                      {record ? 'Configured' : 'Default behavior'}
                    </span>
                  </div>
                  <h3>{def.title}</h3>
                  <p>{def.description}</p>
                  <div className="setting-current">
                    <span>Currently</span>
                    <strong>{settingSummary(def, record)}</strong>
                  </div>
                  {!record && (
                    <p className="setting-note">
                      Not configured yet. The behavior above is the site
                      default.
                    </p>
                  )}
                  {matches.length > 1 && (
                    <Alert severity="warning">
                      Duplicate names found. The site uses the first entry.
                      Remove redundant entries below before editing.
                    </Alert>
                  )}
                  <div className="setting-actions">
                    <button
                      type="button"
                      className="setting-primary"
                      disabled={matches.length > 1}
                      onClick={() => edit(def, record)}
                    >
                      {record ? 'Edit setting' : 'Configure'}
                    </button>
                    {record && matches.length === 1 && (
                      <button type="button" onClick={() => setRemoving(record)}>
                        Reset to default
                      </button>
                    )}
                  </div>
                  {matches.length > 1 &&
                    matches.slice(1).map((duplicate) => (
                      <button
                        className="setting-duplicate"
                        type="button"
                        key={duplicate.id}
                        onClick={() => setRemoving(duplicate)}
                      >
                        Delete duplicate #{duplicate.id}
                      </button>
                    ))}
                </article>
              );
            })}
          </div>
          <details className="settings-custom">
            <summary>Other saved settings ({unknown.length})</summary>
            <p>
              No connection was found for these names in the current frontend
              code. Adding a name here does not create a new site feature.
            </p>
            <label className="setting-field">
              Find a saved setting
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                placeholder="Search by name"
              />
            </label>
            <div className="settings-grid">
              {filtered
                .slice(currentPage * 8, (currentPage + 1) * 8)
                .map((record) => (
                  <article className="setting-card" key={record.id}>
                    <span className="setting-badge">
                      No known site connection
                    </span>
                    <h3>{record.name}</h3>
                    <p>Saved value ({record.value_type})</p>
                    <pre className="setting-raw">{record.value}</pre>
                    <div className="setting-actions">
                      <button type="button" onClick={() => edit(null, record)}>
                        Edit saved value
                      </button>
                      <button type="button" onClick={() => setRemoving(record)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
            </div>
            {!filtered.length && <p>No matching saved settings.</p>}
            {filtered.length > 8 && (
              <nav
                className="setting-actions"
                aria-label="Other settings pages"
              >
                <button
                  disabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage + 1} of {Math.ceil(filtered.length / 8)}
                </span>
                <button
                  disabled={(currentPage + 1) * 8 >= filtered.length}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </button>
              </nav>
            )}
          </details>
        </>
      )}
      <Dialog
        className="admin-dialog"
        fullWidth
        maxWidth="sm"
        open={Boolean(editor)}
        onClose={saving ? undefined : () => setEditor(null)}
      >
        <DialogTitle>
          {definition?.title || `Edit ${draft?.name || 'saved setting'}`}
        </DialogTitle>
        <form onSubmit={save} className="site-settings">
          <DialogContent>
            <p>
              {definition?.description ||
                'No matching feature was found in the current frontend. This edits the saved value only.'}
            </p>
            {definition && (
              <p className="setting-note">Affects: {definition.area}</p>
            )}
            {formError && <Alert severity="error">{formError}</Alert>}
            <fieldset disabled={saving} className="setting-fields">
              {type === 'BOOLEAN' ? (
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={draft?.value === 'true'}
                    onChange={(event) =>
                      change('value', String(event.target.checked))
                    }
                  />
                  <span>
                    {draft?.value === 'true'
                      ? definition?.on || 'Enabled'
                      : definition?.off || 'Disabled'}
                  </span>
                </label>
              ) : type === 'DATE' && definition ? (
                <label className="setting-field">
                  Countdown target (your local timezone)
                  <input
                    required
                    type="datetime-local"
                    value={localDateInput(draft?.start_date)}
                    onChange={(event) =>
                      change(
                        'start_date',
                        event.target.value
                          ? new Date(event.target.value).toISOString()
                          : '',
                      )
                    }
                  />
                </label>
              ) : (
                <label className="setting-field">
                  {definition ? 'Messages, separated by commas' : 'Saved value'}
                  <textarea
                    rows={4}
                    value={draft?.value || ''}
                    onChange={(event) => change('value', event.target.value)}
                  />
                </label>
              )}
              {type === 'DATE' && !definition && (
                <>
                  <label className="setting-field">
                    Start date (your local timezone)
                    <input
                      required
                      type="datetime-local"
                      value={localDateInput(draft?.start_date)}
                      onChange={(event) =>
                        change(
                          'start_date',
                          event.target.value
                            ? new Date(event.target.value).toISOString()
                            : '',
                        )
                      }
                    />
                  </label>
                  <p className="setting-note">
                    Existing end date is preserved.
                  </p>
                </>
              )}
            </fieldset>
          </DialogContent>
          <DialogActions>
            <Button disabled={saving} onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button disabled={saving} variant="contained" type="submit">
              {saving ? 'Saving…' : 'Save change'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <DeleteConfirmationDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={remove}
        controllerName={removing?.name || ''}
        description={
          SITE_SETTINGS.find((item) => item.name === removing?.name)
            ? `Removing this saved entry returns the feature to its default when no other entry with this name remains: ${SITE_SETTINGS.find((item) => item.name === removing?.name).fallback}.`
            : 'No connection was found for this setting in the current frontend code.'
        }
        pending={deleting}
      />
    </Box>
  );
}
