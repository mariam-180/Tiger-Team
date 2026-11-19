import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'authContext';
import AdminDataTable from '../AdminDataTable';
import { buildReportParams, reportTimestamp } from 'utils/adminData.mjs';

const emptyFilters = { actor: '', action: '', area: '', from: '', to: '' };
const columns = [
  { Header: 'When', accessor: 'when' },
  { Header: 'Changed by', accessor: 'actor' },
  { Header: 'Action', accessor: 'action' },
  { Header: 'Area / record', accessor: 'area' },
  { Header: 'Description', accessor: 'description' },
  { Header: 'Details', accessor: 'details', disableSortBy: true },
];
export default function AdminReports() {
  const { accessToken } = useAuth();
  const [records, setRecords] = useState([]);
  const [loadState, setLoadState] = useState('loading');
  const [filters, setFilters] = useState(emptyFilters);
  const [filterError, setFilterError] = useState('');
  const [metadata, setMetadata] = useState([]);
  const [selected, setSelected] = useState(null);
  const request = useRef(null);
  const appliedFilters = useRef(emptyFilters);
  const load = async (values = filters, background = false) => {
    let params;
    try {
      params = buildReportParams(values);
      if (!background) appliedFilters.current = { ...values };
    } catch (error) {
      setFilterError(error.message);
      return;
    }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setFilterError('');
    if (!background) setLoadState('loading');
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_ACTIVITIES_ENDPOINT || '/api/reports/',
        {
          params,
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
          timeout: 15000,
        },
      );
      if (!Array.isArray(data)) throw new Error('Invalid reports response');
      if (controller.signal.aborted) return;
      setRecords(data);
      setMetadata((previous) => [
        ...new Map([...previous, ...data].map((row) => [row.id, row])).values(),
      ]);
      setLoadState('ready');
    } catch (error) {
      if (!controller.signal.aborted && !background) setLoadState('error');
    }
  };
  useEffect(() => {
    load(emptyFilters);
    return () => request.current?.abort();
  }, [accessToken]);
  useBackgroundRefresh(
    () => load(appliedFilters.current, true),
    Boolean(accessToken),
  );
  const actors = [
    ...new Map(
      metadata.map((row) => [
        String(row.user_id),
        row.user?.email || `Account #${row.user_id}`,
      ]),
    ).entries(),
  ];
  const areas = [
    ...new Set(metadata.map((row) => row.table_name).filter(Boolean)),
  ].sort();
  const change = (event) =>
    setFilters({ ...filters, [event.target.name]: event.target.value });
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box className="admin-report-intro">
        <Typography component="h2">Activity log</Typography>
        <Typography>
          See which account changed a record, what happened and when. This is an
          audit history, not a sales or traffic report.
        </Typography>
        <Chip label={`${records.length} loaded records`} size="small" />
      </Box>
      <Box component="details" className="admin-report-filters">
        <summary>Filter the activity log</summary>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            load();
          }}
        >
          <Box className="admin-filter-grid">
            <TextField
              select
              label="Changed by"
              name="actor"
              value={filters.actor}
              onChange={change}
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="">All accounts</MenuItem>
              {actors.map(([id, label]) => (
                <MenuItem key={id} value={id}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Action"
              name="action"
              value={filters.action}
              onChange={change}
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="">All actions</MenuItem>
              {['CREATE', 'UPDATE', 'DELETE'].map((action) => (
                <MenuItem key={action} value={action}>
                  {action.toLowerCase()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Area"
              name="area"
              value={filters.area}
              onChange={change}
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="">All areas</MenuItem>
              {areas.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="From date"
              name="from"
              value={filters.from}
              onChange={change}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="Through date"
              name="to"
              value={filters.to}
              onChange={change}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {filterError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {filterError}
            </Alert>
          )}
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loadState === 'loading'}
            >
              Apply filters
            </Button>
            <Button
              disabled={loadState === 'loading'}
              onClick={() => {
                setFilters(emptyFilters);
                load(emptyFilters);
              }}
            >
              Reset filters
            </Button>
          </Box>
        </Box>
      </Box>
      <Button
        onClick={() => load()}
        disabled={loadState === 'loading'}
        sx={{ mb: 2 }}
      >
        Refresh activity
      </Button>
      <AdminDataTable
        title="Recorded activity"
        columns={columns}
        loadState={loadState}
        onRetry={() => load()}
        canSearch
        rows={records.map((row) => ({
          id: row.id,
          __sortValues: { when: reportTimestamp(row.timestamp) },
          when: row.timestamp
            ? new Date(reportTimestamp(row.timestamp)).toLocaleString()
            : 'Not recorded',
          actor: row.user?.email || `Account #${row.user_id}`,
          action: <Chip size="small" label={row.action} />,
          area: `${row.table_name} #${row.record_id}`,
          description: row.description || 'No description recorded',
          details: (
            <Button onClick={() => setSelected(row)}>View changes</Button>
          ),
        }))}
      />
      <Dialog
        className="admin-dialog"
        fullWidth
        maxWidth="md"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      >
        <DialogTitle>Recorded changes</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>{selected?.description}</Typography>
          {selected?.details ? (
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                bgcolor: '#12141c',
                borderRadius: 2,
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                color: '#fff',
                fontSize: '.8rem',
              }}
            >
              {JSON.stringify(selected.details, null, 2)}
            </Box>
          ) : (
            <Typography>No additional details were recorded.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
