console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'CV' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/derrickdollesin/', title: 'GitHub' },
];

let nav = document.createElement('nav');
let ul = document.createElement('ul');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/website/";         // GitHub Pages repo name


for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );
    
    if (a.host !== location.host) {
        a.target = '_blank';
    }
    
    let li = document.createElement('li');
    li.appendChild(a);
    ul.appendChild(li);
}
    
nav.appendChild(ul);
document.body.prepend(nav);

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select id="theme-select">
                <option value="auto">Automatic</option>
                <option value="light">Light</option>      
                <option value="dark">Dark</option>   
            </select>
        </label>
    `,
);

const select = document.querySelector('#theme-select');

function loadTheme() {
    const saved = localStorage.colorScheme || 'auto';
  
    // Update the CSS `color-scheme` property
    document.documentElement.style.setProperty('color-scheme', saved);
  
    // Update your own theme attribute
    if (saved === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', saved);
    }
  
    // Sync <select> dropdown
    const select = document.querySelector('#theme-select');
    if (select) select.value = saved;
}

loadTheme();

select.addEventListener('input', function (event) {
    localStorage.colorScheme = event.target.value;

    const value = event.target.value;

    console.log('color scheme changed to', event.target.value);

    document.documentElement.style.setProperty('color-scheme', event.target.value);

    if (value === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', value);
    }
    
    // Save to localStorage
    localStorage.colorScheme = value;
});

const form = document.querySelector('form');

form?.addEventListener('submit', (event) => {
  event.preventDefault(); // Stop the default behavior

  const data = new FormData(form);
  const params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const queryString = params.join('&');
  const email = form.getAttribute('action'); // e.g. mailto:dollesinderrick@gmail.com
  const fullURL = `${email}?${queryString}`;

  console.log('Opening:', fullURL);
  location.href = fullURL;
});