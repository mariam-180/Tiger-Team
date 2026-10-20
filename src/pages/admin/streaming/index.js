import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import LiveTvRounded from '@mui/icons-material/LiveTvRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/footer';
import ParentContainer from 'components/ThisContainer/filtered';
import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';

function ConfigValue({ label, value, secret = false }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value || '');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="overline"
        sx={{ color: 'rgba(255,255,255,0.62)', letterSpacing: 1.2 }}
      >
        {label}
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          p: 1.25,
          borderRadius: 2,
          backgroundColor: 'rgba(0,0,0,0.28)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          component="code"
          sx={{
            flex: 1,
            minWidth: 0,
            color: '#fff',
            fontSize: { xs: '0.74rem', sm: '0.82rem' },
            overflowWrap: 'anywhere',
          }}
        >
          {secret ? '••••••••••••••••' : value || 'Not configured'}
        </Typography>
        <Tooltip title={copied ? 'Copied' : 'Copy'}>
          <IconButton
            aria-label={`Copy ${label}`}
            onClick={copyValue}
            disabled={!value}
            size="small"
            sx={{ color: copied ? '#66bb6a' : '#fff' }}
          >
            <ContentCopyRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

function Streaming() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_STREAM_CONFIG_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(({ data }) => setConfig(data))
      .catch(() => setError('Streaming configuration could not be loaded.'));
  }, []);

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{ backgroundColor: '#060708', color: '#fff' }}
    >
      <DefaultNavbar />
      <ParentContainer
        backgroundImage={backgroundImage}
        blur={2}
        brightness={18}
        sx={{ alignItems: 'stretch', justifyContent: 'flex-start', p: 0 }}
      >
        <DashboardLayout>
          <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
            <Button
              startIcon={<ArrowBackRounded />}
              onClick={() => navigate('/admin')}
              sx={{ color: '#fff', mb: 3, textTransform: 'none' }}
            >
              Back to admin dashboard
            </Button>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LiveTvRounded sx={{ color: '#ef5350', fontSize: 34 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Streaming setup
                  </Typography>
                </Stack>
                <Typography sx={{ color: 'rgba(255,255,255,0.68)', mt: 1 }}>
                  Configure OBS and monitor the playback endpoints for Tigers
                  Team.
                </Typography>
              </Box>
              <Chip
                label="SRS streaming"
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(239,83,80,0.2)',
                  border: '1px solid rgba(239,83,80,0.45)',
                }}
              />
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {!config && !error && (
              <Box
                sx={{ display: 'grid', placeItems: 'center', minHeight: 280 }}
              >
                <CircularProgress sx={{ color: '#ef5350' }} />
              </Box>
            )}
            {config && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Card sx={cardStyles}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                      <Typography variant="h5" sx={headingStyles}>
                        OBS connection
                      </Typography>
                      <Typography sx={helperStyles}>
                        In OBS, choose Custom Streaming Server and use these
                        values.
                      </Typography>
                      <Divider sx={dividerStyles} />
                      <ConfigValue
                        label="Server URL"
                        value={config.ingest_url}
                      />
                      <ConfigValue
                        label="Stream key"
                        value={config.stream_key}
                        secret
                      />
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        Keep the stream key private. Rotate it if it is exposed.
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Card sx={cardStyles}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                      <Typography variant="h5" sx={headingStyles}>
                        Playback endpoints
                      </Typography>
                      <Typography sx={helperStyles}>
                        Use HLS for browsers and WebRTC when low latency is
                        required.
                      </Typography>
                      <Divider sx={dividerStyles} />
                      <ConfigValue
                        label="HLS playback"
                        value={config.hls_url}
                      />
                      <ConfigValue
                        label="WebRTC playback"
                        value={config.webrtc_url}
                      />
                      <Button
                        variant="outlined"
                        endIcon={<OpenInNewRounded />}
                        href="/live"
                        sx={{
                          color: '#fff',
                          borderColor: 'rgba(255,255,255,0.35)',
                          textTransform: 'none',
                        }}
                      >
                        Open public live page
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Container>
        </DashboardLayout>
      </ParentContainer>
      <Footer />
    </Grid>
  );
}

const cardStyles = {
  height: '100%',
  color: '#fff',
  background:
    'linear-gradient(145deg, rgba(25,28,34,0.96), rgba(10,12,15,0.92))',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 3,
  boxShadow: '0 18px 45px rgba(0,0,0,0.28)',
};

const headingStyles = { fontWeight: 700, mb: 1 };
const helperStyles = { color: 'rgba(255,255,255,0.64)', lineHeight: 1.6 };
const dividerStyles = { borderColor: 'rgba(255,255,255,0.12)', my: 3 };

ConfigValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  secret: PropTypes.bool,
};

ConfigValue.defaultProps = {
  value: '',
  secret: false,
};

export default Streaming;
