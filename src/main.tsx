import React from 'react';
import {createRoot} from 'react-dom/client';
import {ClipboardList, PackageSearch, Ruler, ShieldCheck} from 'lucide-react';
import './styles.css';

const implantRows = [
  {
    reference: 'SYN-204.824',
    family: 'Cortical screw',
    size: '2.4 mm x 24 mm',
    tray: 'Mini fragment A',
    status: 'Verified',
  },
  {
    reference: 'SYN-206.018',
    family: 'Cancellous screw',
    size: '6.5 mm x 18 mm',
    tray: 'Large fragment B',
    status: 'Review',
  },
  {
    reference: 'SYN-213.040',
    family: 'Locking screw',
    size: '3.5 mm x 40 mm',
    tray: 'LCP utility',
    status: 'Verified',
  },
];

function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">ML2 orthopedic inventory</p>
          <h1 id="page-title">Implant reference search and tray control</h1>
          <p className="intro">
            A compact workspace for checking Synthes screw references, dimensions,
            tray locations, and verification status before clinical use.
          </p>
          <div className="actions" aria-label="Primary actions">
            <button type="button">
              <PackageSearch size={18} aria-hidden="true" />
              Search catalog
            </button>
            <button type="button" className="secondary">
              <ClipboardList size={18} aria-hidden="true" />
              Review list
            </button>
          </div>
        </div>

        <div className="metrics" aria-label="Inventory summary">
          <article>
            <ShieldCheck size={22} aria-hidden="true" />
            <span>214</span>
            <p>verified references</p>
          </article>
          <article>
            <Ruler size={22} aria-hidden="true" />
            <span>37</span>
            <p>sizes pending confirmation</p>
          </article>
        </div>
      </section>

      <section className="table-section" aria-labelledby="catalog-title">
        <div className="section-heading">
          <p className="eyebrow">Current working set</p>
          <h2 id="catalog-title">Reference checks</h2>
        </div>
        <div className="catalog-table" role="table" aria-label="Implant references">
          <div className="table-row table-head" role="row">
            <span role="columnheader">Reference</span>
            <span role="columnheader">Family</span>
            <span role="columnheader">Size</span>
            <span role="columnheader">Tray</span>
            <span role="columnheader">Status</span>
          </div>
          {implantRows.map((item) => (
            <div className="table-row" role="row" key={item.reference}>
              <span role="cell">{item.reference}</span>
              <span role="cell">{item.family}</span>
              <span role="cell">{item.size}</span>
              <span role="cell">{item.tray}</span>
              <span role="cell">
                <strong className={item.status === 'Verified' ? 'status-ok' : 'status-review'}>
                  {item.status}
                </strong>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root was not found.');
}

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
