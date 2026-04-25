export default function Page() {
  return (
    <div className="hero" data-screen-label="Hero">
      <nav className="nav-wrap">
        <div className="nav" role="navigation" aria-label="Primary">
          <div className="logo" aria-label="Pixelglow logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
              <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
            </svg>
          </div>
          <div className="nav-links">
            <a className="nav-link" href="#">
              Product
            </a>
            <a className="nav-link" href="#">
              Docs
            </a>
            <a className="nav-link" href="#">
              Pricing
            </a>
          </div>
          <button className="signin" type="button">
            Sign in
          </button>
        </div>
      </nav>

      <div className="headline">
        <h1>
          Ship code,
          <br />
          not regressions
        </h1>
      </div>

      <section className="card" aria-labelledby="card-title">
        <p className="sub" id="card-title">
          An autonomous QA agent that writes, runs, and maintains your tests.
        </p>

        <div className="ctas">
          <button className="btn btn-primary" type="button">
            Get started
          </button>
          <button className="btn btn-ghost" type="button">
            ▶  Watch demo
          </button>
        </div>

        <div className="divider" />

        <div className="features">
          <a className="feature" href="#" aria-label="API testing">
            <div className="icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="8 7 3 12 8 17" />
                <polyline points="16 7 21 12 16 17" />
              </svg>
            </div>
            <h3>
              API testing <span className="arrow">›</span>
            </h3>
            <p>Cut manual setup, scripting, and upkeep.</p>
          </a>

          <a className="feature" href="#" aria-label="UI testing">
            <div className="icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="4" y1="7" x2="16" y2="7" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="14" y2="17" />
              </svg>
            </div>
            <h3>
              UI testing <span className="arrow">›</span>
            </h3>
            <p>Skip recording, flakes, and broken selectors.</p>
          </a>
        </div>
      </section>

      <div className="hero-tail" />
    </div>
  );
}
