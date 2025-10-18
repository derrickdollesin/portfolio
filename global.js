console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/* Adding nav bar with JS */

// let navLinks = $$("nav a")

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  // add the rest of your pages 
  { url: 'resume/', title: 'Resume'},
  { url: 'contact/', title: 'Contact'},
  { url: 'https://github.com/derrickdollesin/', title: 'GitHub'},
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/website/";         // GitHub Pages repo name


for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  // next step: create link and add it to nav
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  if (a.host != location.host) {
    a.target = '_blank'
  }

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );  

  nav.append(a);
}

/* Light and Dark Mode */
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<!-- TODO add <option> elements here -->
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`,
);

let select = document.querySelector('.color-scheme select') 

select.addEventListener('input', function (event) {  
  const value = event.target.value;

  localStorage.colorScheme = value;

  document.documentElement.style.colorScheme = value;

  select.value = value;

  console.log('Color scheme changed to', value);
});

if ("colorScheme" in localStorage) {
  document.documentElement.style.colorScheme = localStorage.colorScheme;
  select.value = localStorage.colorScheme;
}

/* Improved Contact */

let form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  let data = new FormData(form);

  let url = form.action + '?';

  for (let [name, value] of data) {
    url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
  }

  url = url.slice(0, -1);

  console.log('Final encoded URL:', url);

  location.href = url;
});
