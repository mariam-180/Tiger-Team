import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'authContext';
import { useSnackbar } from 'context/SnackbarContext';
import AdminDataTable from '../AdminDataTable';
import { useAdminConfirm } from '../AdminWorkspace';
import {
  isClosedBranch,
  reservationFingerprint,
  reservationTimestamp,
  reservationInputValue,
} from 'utils/adminData.mjs';

const displayTime = (value) => {
  const timestamp = reservationTimestamp(value);
  return Number.isNaN(timestamp)
    ? 'Not recorded'
    : new Date(timestamp).toLocaleString('en-GB', { timeZone: 'Asia/Amman' });
};
export default function AdminReservations() {
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const confirmDelete = useAdminConfirm();
  const [records, setRecords] = useState([]);
  const [loadState, setLoadState] = useState('loading');
  const [includeEnded, setIncludeEnded] = useState(false);
  const [unreviewedOnly, setUnreviewedOnly] = useState(false);
  const [reviewed, setReviewed] = useState({});
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const request = useRef(null);
  const load = useCallback(
    async (background = false) => {
      if (request.current) return;
      const controller = new AbortController();
      request.current = controller;
      if (background !== true) setLoadState('loading');
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_RESERVATION_ENDPOINT || '/api/reservations/',
          {
            headers: { Authorization: `Bearer ${accessToken}`, history: true },
            signal: controller.signal,
            timeout: 15000,
          },
        );
        if (!Array.isArray(data))
          throw new Error('Invalid reservations response');
        if (!controller.signal.aborted) {
          setRecords(data.filter((row) => !isClosedBranch(row.branch_name)));
          setLoadState('ready');
        }
      } catch (error) {
        if (!controller.signal.aborted && background !== true)
          setLoadState('error');
      } finally {
        if (request.current === controller) request.current = null;
      }
    },
    [accessToken],
  );
  useEffect(() => {
    load();
    return () => {
      request.current?.abort();
      request.current = null;
    };
  }, [load]);
  useBackgroundRefresh(() => load(true), Boolean(accessToken));
  const isReviewed = (row) => reviewed[row.id] === reservationFingerprint(row);
  const toggleReviewed = (row) =>
    setReviewed((previous) => {
      const next = { ...previous };
      if (next[row.id] === reservationFingerprint(row)) delete next[row.id];
      else next[row.id] = reservationFingerprint(row);
      return next;
    });
  const remove = async (row) => {
    if (
      deletingId !== null ||
      !(await confirmDelete(`Delete reservation #${row.id}?`))
    )
      return;
    setDeletingId(row.id);
    try {
      await axios.delete(
        `${process.env.REACT_APP_RESERVATION_ENDPOINT || '/api/reservations/'}${row.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 15000 },
      );
      showSnackbar('Reservation deleted.', 'success');
      await load();
    } catch (error) {
      showSnackbar(
        error.response?.data?.detail || 'Reservation could not be deleted.',
        'error',
      );
    } finally {
      setDeletingId(null);
    }
  };
  const save = async () => {
    if (!selected || saving) return;
    const start = reservationTimestamp(selected.reservation_start);
    const end = reservationTimestamp(selected.reservation_end);
    const duration = (end - start) / 60000;
    if (!Number.isInteger(duration) || duration <= 0) {
      showSnackbar('Choose valid start and end times.', 'warning');
      return;
    }
    setSaving(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_RESERVATION_ENDPOINT || '/api/reservations/'}${selected.id}`,
        {
          reservation_start: new Date(start).toISOString(),
          reservation_end: new Date(end).toISOString(),
          duration,
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 15000 },
      );
      setSelected(null);
      showSnackbar(
        'Reservation updated. The server recalculated the booking cost.',
        'success',
      );
      await load();
    } catch (error) {
      const detail = error.response?.data?.detail;
      showSnackbar(
        typeof detail === 'string'
          ? detail
          : 'Reservation could not be saved. Check the times and try again.',
        'error',
      );
    } finally {
      setSaving(false);
    }
  };
  const columns = [
    { Header: 'Reviewed', accessor: 'reviewed', disableSortBy: true },
    { Header: 'Branch', accessor: 'branch' },
    { Header: 'PC', accessor: 'pc' },
    { Header: 'Customer', accessor: 'customer' },
    { Header: 'Starts', accessor: 'start' },
    { Header: 'Ends', accessor: 'end' },
    { Header: 'Duration', accessor: 'duration' },
    { Header: 'Cost', accessor: 'cost' },
    { Header: 'Actions', accessor: 'action', disableSortBy: true },
  ];
  const visible = records.filter(
    (row) =>
      (includeEnded ||
        reservationTimestamp(row.reservation_end) >= Date.now()) &&
      (!unreviewedOnly || !isReviewed(row)),
  );
  return (
    <Box sx={{ minWidth: 0 }}>
      <div className="admin-reservation-controls">
        <FormControlLabel
          control={
            <Switch
              checked={includeEnded}
              onChange={(event) => setIncludeEnded(event.target.checked)}
            />
          }
          label="Include ended bookings"
        />
        <FormControlLabel
          control={
            <Switch
              checked={unreviewedOnly}
              onChange={(event) => setUnreviewedOnly(event.target.checked)}
            />
          }
          label="Unreviewed only"
        />
        <Button onClick={load} disabled={loadState === 'loading'}>
          Refresh
        </Button>
      </div>
      <Typography
        sx={{ color: '#c6c6d3', fontSize: '.8rem', lineHeight: 1.8, mb: 3 }}
      >
        Times use venue time (UTC+03:00). Reviewed is a checklist mark for this
        visit, not a payment or booking confirmation. Updated bookings need
        review again. Closed branches are excluded.
      </Typography>
      <AdminDataTable
        title="PC reservations"
        columns={columns}
        loadState={loadState}
        onRetry={load}
        canSearch
        rows={visible.map((row) => ({
          id: row.id,
          __sortValues: {
            start: reservationTimestamp(row.reservation_start),
            end: reservationTimestamp(row.reservation_end),
            duration: row.duration,
          },
          reviewed: (
            <Checkbox
              checked={isReviewed(row)}
              onChange={() => toggleReviewed(row)}
              inputProps={{
                'aria-label': `Mark reservation ${row.id} as reviewed`,
              }}
            />
          ),
          branch: row.branch_name || 'Branch unavailable',
          pc: row.pc_number,
          customer: row.user_name || 'Account unavailable',
          start: displayTime(row.reservation_start),
          end: displayTime(row.reservation_end),
          duration: `${row.duration} min`,
          cost: row.total_cost,
          action: (
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Button
                disabled={
                  reservationTimestamp(row.reservation_start) <= Date.now()
                }
                onClick={() =>
                  setSelected({
                    ...row,
                    reservation_start: reservationInputValue(
                      row.reservation_start,
                    ),
                    reservation_end: reservationInputValue(row.reservation_end),
                  })
                }
              >
                Edit times
              </Button>
              <Button
                color="error"
                disabled={deletingId !== null}
                onClick={() => remove(row)}
              >
                Delete
              </Button>
            </Box>
          ),
        }))}
        entriesPerPage={{ defaultValue: 10, entries: [5, 10, 20, 50] }}
      />
      <Dialog
        className="admin-dialog"
        fullWidth
        maxWidth="sm"
        open={Boolean(selected)}
        onClose={saving ? undefined : () => setSelected(null)}
      >
        <DialogTitle>Edit booking times</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3, color: '#c9c9d6' }}>
            The server checks availability and recalculates the cost when you
            save.
          </Typography>
          <TextField
            label="Branch / PC"
            value={
              selected
                ? `${selected.branch_name} / PC ${selected.pc_number}`
                : ''
            }
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Customer"
            value={selected?.user_name || ''}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{ mb: 3 }}
          />
          {['reservation_start', 'reservation_end'].map((field) => (
            <TextField
              key={field}
              label={
                field === 'reservation_start'
                  ? 'Starts (venue time)'
                  : 'Ends (venue time)'
              }
              type="datetime-local"
              inputProps={{ step: 1 }}
              InputLabelProps={{ shrink: true }}
              value={selected?.[field] || ''}
              onChange={(event) =>
                setSelected({ ...selected, [field]: event.target.value })
              }
              fullWidth
              sx={{ mb: 3 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={() => setSelected(null)}>
            Cancel
          </Button>
          <Button variant="contained" disabled={saving} onClick={save}>
            {saving ? 'Saving...' : 'Save times'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
