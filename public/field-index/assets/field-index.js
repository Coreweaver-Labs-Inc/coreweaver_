/* Coreweaver Field Index — Evidence Ledger: dependency-free, source-led record discovery with no remote code execution or provider calls. */
const state = { records: [], query: '', type: 'All', layer: 'All' };
const basePath = document.documentElement.dataset.fieldIndexBase || '';
const elements = {
  search: document.querySelector('#record-search'),
  typeFilters: document.querySelector('#type-filters'),
  layerFilters: document.querySelector('#layer-filters'),
  reset: document.querySelector('#reset-filters'),
  list: document.querySelector('#record-list'),
  count: document.querySelector('#result-count'),
  dialog: document.querySelector('#record-dialog'),
  dialogContent: document.querySelector('#dialog-content'),
  dialogClose: document.querySelector('#dialog-close'),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function recordName(id) {
  return state.records.find((record) => record.id === id)?.name ?? id;
}

function activeRecords() {
  const query = state.query.toLocaleLowerCase();
  return state.records.filter((record) => {
    const searchable = [record.name, record.record_type, record.primary_layer, record.summary, record.scope_note].join(' ').toLocaleLowerCase();
    return (!query || searchable.includes(query))
      && (state.type === 'All' || record.record_type === state.type)
      && (state.layer === 'All' || record.primary_layer === state.layer);
  });
}

function filterControl(group, values, label) {
  const selection = group === 'type' ? state.type : state.layer;
  const destination = group === 'type' ? elements.typeFilters : elements.layerFilters;
  destination.innerHTML = ['All', ...values].map((value) => `
    <button class="filter-button" type="button" data-filter-group="${group}" data-filter-value="${escapeHtml(value)}" aria-pressed="${selection === value}">
      ${escapeHtml(value)}
    </button>`).join('');
}

function renderFilterControls() {
  filterControl('type', [...new Set(state.records.map((record) => record.record_type))].sort(), 'Record type');
  filterControl('layer', [...new Set(state.records.map((record) => record.primary_layer))].sort(), 'Primary layer');
}

function renderRecords() {
  const records = activeRecords();
  const noun = records.length === 1 ? 'record' : 'records';
  elements.count.textContent = `${records.length} ${noun} shown`;
  if (!records.length) {
    elements.list.innerHTML = `<p class="notice">No public records match these filters. Reset the search or remove a filter to inspect the full field.</p>`;
    return;
  }
  elements.list.innerHTML = records.map((record, index) => `
    <article class="record" aria-labelledby="record-${escapeHtml(record.id)}">
      <div class="record__index">${String(index + 1).padStart(2, '0')}</div>
      <div class="record__main">
        <div class="record__meta"><span>${escapeHtml(record.record_type)}</span><span>${escapeHtml(record.primary_layer)}</span></div>
        <h3 id="record-${escapeHtml(record.id)}">${escapeHtml(record.name)}</h3>
        <p class="record__summary">${escapeHtml(record.summary)}</p>
      </div>
      <button class="record__button" type="button" data-record-id="${escapeHtml(record.id)}">Open record <span aria-hidden="true">↗</span></button>
    </article>`).join('');
}

function renderDialog(recordId) {
  const record = state.records.find((item) => item.id === recordId);
  if (!record) return;
  const relations = record.relationships.map((relationship) => `<li><button type="button" data-related-id="${escapeHtml(relationship.record_id)}">${escapeHtml(recordName(relationship.record_id))}</button> <span>— ${escapeHtml(relationship.label)}</span></li>`).join('');
  const changes = record.change_log.map((entry) => `<li><strong>${escapeHtml(entry.date)}</strong> — ${escapeHtml(entry.note)}</li>`).join('');
  elements.dialogContent.innerHTML = `
    <p class="dialog-eyebrow">${escapeHtml(record.record_type)} / ${escapeHtml(record.status)}</p>
    <h2 class="dialog-title" id="dialog-title">${escapeHtml(record.name)}</h2>
    <p class="dialog-summary">${escapeHtml(record.summary)}</p>
    <section class="dialog-section">
      <dl class="dialog-meta">
        <div><dt>Primary layer</dt><dd>${escapeHtml(record.primary_layer)}</dd></div>
        <div><dt>Last verified</dt><dd>${escapeHtml(record.last_verified)}</dd></div>
        <div><dt>Record status</dt><dd>${escapeHtml(record.status)}</dd></div>
      </dl>
    </section>
    <section class="dialog-section"><h3>Why this record is here</h3><p class="dialog-scope">${escapeHtml(record.scope_note)}</p></section>
    <section class="dialog-section"><h3>Primary source</h3><a class="dialog-source" href="${escapeHtml(record.source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(record.source.name)} <span aria-hidden="true">↗</span></a></section>
    <section class="dialog-section"><h3>Documented relationships</h3><ul class="relationship-list">${relations}</ul></section>
    <section class="dialog-section"><h3>Editorial caveat</h3><p class="caveat">${escapeHtml(record.caveat)}</p></section>
    <section class="dialog-section"><h3>Change log</h3><ul class="changelog">${changes}</ul></section>`;
  if (typeof elements.dialog.showModal === 'function') elements.dialog.showModal();
  else elements.dialog.setAttribute('open', '');
}

function closeDialog() {
  if (typeof elements.dialog.close === 'function') elements.dialog.close();
  else elements.dialog.removeAttribute('open');
}

function update({ query = state.query, type = state.type, layer = state.layer } = {}) {
  state.query = query;
  state.type = type;
  state.layer = layer;
  renderFilterControls();
  renderRecords();
}

document.addEventListener('click', (event) => {
  const filter = event.target.closest('[data-filter-group]');
  if (filter) {
    const group = filter.dataset.filterGroup;
    update(group === 'type' ? { type: filter.dataset.filterValue } : { layer: filter.dataset.filterValue });
    return;
  }
  const recordButton = event.target.closest('[data-record-id]');
  if (recordButton) return renderDialog(recordButton.dataset.recordId);
  const relatedButton = event.target.closest('[data-related-id]');
  if (relatedButton) return renderDialog(relatedButton.dataset.relatedId);
});

elements.search.addEventListener('input', (event) => update({ query: event.target.value.trim() }));
elements.reset.addEventListener('click', () => {
  window.setTimeout(() => {
    elements.search.value = '';
    update({ query: '', type: 'All', layer: 'All' });
  }, 0);
});
elements.dialogClose.addEventListener('click', closeDialog);
elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) closeDialog();
});

async function start() {
  try {
    const response = await fetch(`${basePath}data/records.json`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`The record data returned ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('The record data is not an array.');
    state.records = data;
    update();
  } catch (error) {
    elements.count.textContent = 'Records unavailable';
    elements.list.innerHTML = `<p class="notice">The local record file could not be loaded. Start a simple static server from this project folder, then refresh. Technical detail: ${escapeHtml(error.message)}</p>`;
  }
}

start();
