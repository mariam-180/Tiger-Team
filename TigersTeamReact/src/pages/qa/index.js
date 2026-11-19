import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import RacingPage, { panelSx, kickerSx } from 'examples/design/RacingUI';
import { filterHelp, helpTopics } from 'utils/helpData.mjs';

export default function QA() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const topics = filterHelp(helpTopics, query, group);
  const groups = ['All', ...new Set(helpTopics.map((topic) => topic.group))];
  return (
    <RacingPage>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0,1fr)',
            md: 'minmax(0,0.8fr) minmax(0,1.2fr)',
          },
          gap: { xs: 4, md: 7 },
          alignItems: 'start',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={kickerSx}>Tigers Team / The driver guide</Typography>
          <Typography
            component="h1"
            sx={{
              color: '#fff',
              fontSize: 'clamp(2.5rem,5vw,4.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
            }}
          >
            Less guessing.
            <br />
            <Box component="span" sx={{ color: '#f18a9b' }}>
              More racing.
            </Box>
          </Typography>
          <Typography sx={{ color: '#aaaabd', lineHeight: 1.8, mt: 3, mb: 4 }}>
            Your guide to sessions, accounts, gear, and the live room. Find the
            answer, then get back on track.
          </Typography>
          <Box sx={{ ...panelSx, p: 3 }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
              Ready to take your seat?
            </Typography>
            <Typography
              sx={{
                color: '#aaaabd',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                mb: 1,
              }}
            >
              Explore the available locations and plan your next session.
            </Typography>
            <Button
              component={Link}
              to="/reservations"
              sx={{ color: '#f18a9b', px: 0 }}
            >
              Explore reservations
            </Button>
          </Box>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <TextField
            label="Search questions"
            type="search"
            fullWidth
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setExpanded(false);
            }}
            sx={{ mb: 2.5 }}
          />
          <Box
            role="group"
            aria-label="Question categories"
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}
          >
            {groups.map((item) => (
              <Button
                key={item}
                onClick={() => {
                  setGroup(item);
                  setExpanded(false);
                }}
                aria-pressed={group === item}
                sx={{
                  border: '1px solid',
                  borderColor: group === item ? '#c71935' : '#34343f',
                  bgcolor:
                    group === item ? 'rgba(199,25,53,0.15)' : 'transparent',
                  color: group === item ? '#f18a9b' : '#aaaabd',
                  borderRadius: '100px',
                  px: 2,
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
          <Typography
            role="status"
            sx={{ color: '#9292aa', fontSize: '0.75rem', mb: 2 }}
          >
            {topics.length} {topics.length === 1 ? 'answer' : 'answers'}
          </Typography>
          {topics.map((topic) => (
            <Accordion
              key={topic.id}
              expanded={expanded === topic.id}
              onChange={(_, open) => setExpanded(open ? topic.id : false)}
              disableGutters
              elevation={0}
              sx={{
                ...panelSx,
                mb: 1.5,
                '&::before': { display: 'none' },
                '&.Mui-expanded': { borderColor: '#7a3048' },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    component="span"
                    sx={{ color: '#ee8da1', fontSize: '1.4rem' }}
                  >
                    +
                  </Box>
                }
                aria-controls={`answer-${topic.id}`}
                id={`question-${topic.id}`}
                sx={{ px: 2.5, py: 1 }}
              >
                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    color: '#eeeef7',
                    fontSize: '0.95rem',
                    pr: 2,
                  }}
                >
                  {topic.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pb: 3 }}>
                <Typography
                  sx={{
                    color: '#aaaabd',
                    fontSize: '0.88rem',
                    lineHeight: 1.9,
                  }}
                >
                  {topic.answer}
                </Typography>
                {topic.link && (
                  <Button
                    component={Link}
                    to={topic.link}
                    sx={{ color: '#f18a9b', px: 0, mt: 2 }}
                  >
                    {topic.action}
                  </Button>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
          {topics.length === 0 && (
            <Box sx={{ ...panelSx, p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                No matching answers.
              </Typography>
              <Typography sx={{ color: '#aaaabd', fontSize: '0.85rem' }}>
                Try another keyword or browse all topics.
              </Typography>
              <Button
                onClick={() => {
                  setQuery('');
                  setGroup('All');
                }}
                sx={{ color: '#f18a9b', mt: 2 }}
              >
                Clear filters
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </RacingPage>
  );
}
