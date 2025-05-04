import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// === Load and render all projects initially ===
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleEl = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

renderProjects(projects, projectsContainer, 'h2');
if (titleEl) titleEl.textContent = `${projects.length} Projects`;

let query = '';
let selectedIndex = -1;

// === Reactive Pie Chart Rendering ===
function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  const svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();
  d3.select('.legend').selectAll('*').remove();

  arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', selectedIndex === i ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        // Update paths
        svg.selectAll('path')
          .attr('class', (_, idx) => (selectedIndex === idx ? 'selected' : ''));

        // Update legend
        d3.select('.legend')
          .selectAll('li')
          .attr('class', (_, idx) => `legend-item ${selectedIndex === idx ? 'selected' : ''}`);

        renderFilteredProjects();
      });
  });

  const legend = d3.select('.legend');
  data.forEach((d, i) => {
    legend.append('li')
      .attr('class', `legend-item ${selectedIndex === i ? 'selected' : ''}`)
      .attr('style', `--color:${colors(i)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        svg.selectAll('path').nodes()[i].dispatchEvent(new Event('click'));
      });
  });
}

// === Filter by search AND selected pie wedge ===
function renderFilteredProjects() {
  let filtered = projects.filter((p) =>
    Object.values(p).join(' ').toLowerCase().includes(query.toLowerCase())
  );

  if (selectedIndex !== -1) {
    let year = d3.rollups(projects, v => v.length, d => d.year)[selectedIndex][0];
    filtered = filtered.filter(p => p.year === year);
  }

  renderProjects(filtered, projectsContainer, 'h2');
  if (titleEl) {
    titleEl.textContent = `${filtered.length} Project${filtered.length !== 1 ? 's' : ''}`;
  }
}

// === Live search input ===
searchInput.addEventListener('input', (e) => {
  query = e.target.value;
  renderFilteredProjects();
  renderPieChart(
    projects.filter((p) =>
      Object.values(p).join(' ').toLowerCase().includes(query.toLowerCase())
    )
  );
});

// === Initial render
renderPieChart(projects);
