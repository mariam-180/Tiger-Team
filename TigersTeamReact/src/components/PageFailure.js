import React from 'react';
import './PageFailure.css';

export default function PageFailure() {
  return (
    <main className="page-failure" role="alert">
      <section
        className="page-failure-card"
        aria-labelledby="page-failure-title"
      >
        <div className="page-failure-brand">TIGERS TEAM / PIT STOP</div>
        <div className="page-failure-symbol" aria-hidden="true">
          !
        </div>
        <p className="page-failure-kicker">A brief interruption</p>
        <h1 id="page-failure-title">This page could not load.</h1>
        <p>
          Please reload to try again. If the problem continues, return to your
          starting page and try another section.
        </p>
        <div className="page-failure-actions">
          <button type="button" onClick={() => window.location.reload()}>
            Reload page <span aria-hidden="true">↻</span>
          </button>
          <a href="/">
            Back to start <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
