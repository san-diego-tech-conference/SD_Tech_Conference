console.log('IT’S ALIVE!');

// Utility function to select elements
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Automating the current page link highlight
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = $$('nav a');
  const currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
  );
  
  // Add 'current' class to the active link
  currentLink?.classList.add('current');
});

// Automatically creating the navigation menu
document.addEventListener('DOMContentLoaded', () => {
  const pages = [
    { url: "index.html", title: "Home" },
    { url: "application/", title: "Application" },
    {
      title: "Proceedings",
      children: [
        { url: "2025-publishing/", title: "2025" },
        { url: "2026-publishing/", title: "2026" },
      ],
    },
    { url: "faq/", title: "FAQ" },
    { url: "contact/", title: "Contact" },
  ];

  const nav = document.createElement('nav');
  document.body.prepend(nav);

  const ARE_WE_HOME = document.documentElement.classList.contains('home');

  
  function makeLink(p) {
    let url = p.url;
    if (!ARE_WE_HOME && !url.startsWith('http')) {
      url = '../' + url;
    }
    const a = document.createElement('a');
    a.href = url;
    a.textContent = p.title;

    if (a.host === location.host && a.pathname === location.pathname) {
      a.classList.add('current');
    }
    if (a.host !== location.host) {
      a.target = "_blank";
    }
    return a;
  }

  for (const p of pages) {
    if (!p.children) {
      nav.append(makeLink(p));
      continue;
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'dropdown-toggle';
    toggle.textContent = `${p.title} ▾`;
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    for (const child of p.children) {
      const link = makeLink(child);
      menu.append(link);
      // Highlight "Proceedings" when you're on 2025 or 2026
      if (link.classList.contains('current')) toggle.classList.add('current');
    }

    // Click support for touch screens / keyboard
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    dropdown.append(toggle, menu);
    nav.append(dropdown);
  }
});




// // Dark mode functionality
// document.addEventListener('DOMContentLoaded', () => {
//   // Add the dark mode switcher
//   document.body.insertAdjacentHTML(
//     'afterbegin',
//     `
//     <label class="color-scheme">
//       Theme:
//       <select>
//         <option value="light dark">Automatic</option>
//         <option value="light">Light</option>
//         <option value="dark">Dark</option>
//       </select>
//     </label>`
//   );

//   const select = document.querySelector('select');
  
//   // Load and set the user's preference if available
//   if (localStorage.colorScheme) {
//     document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
//     select.value = localStorage.colorScheme;
//   }

//   // Update color scheme based on selection
//   select.addEventListener('input', function (event) {
//     const value = event.target.value;
//     document.documentElement.style.setProperty('color-scheme', value);
//     localStorage.colorScheme = value;
//   });
// });



export async function fetchJSON(url) { //export causes errors and nav menu disappears
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
        console.log(response)
      }
      const data = await response.json();
      return data; 

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }

}
// fetchJSON('../lib/projects.json');

const ARE_WE_HOME = document.documentElement.classList.contains('home');
export function renderProjects(projects, containerElement, headingLevel = 'h2') { //project is list
  
  containerElement.innerHTML = '';
  for (let project of projects) { 
  const article = document.createElement('article');
  let img_here = project.image
  if (!ARE_WE_HOME && !img_here.startsWith('http')) {
    img_here = '../' + img_here;
  }
  article.innerHTML = `
    <h3 class="project-title">${project.title}</h3>
    <img src="${img_here}" alt="${project.title}" style="width: 300px; height: auto;">
    <p>${project.description}</p>
    <p>${project.year}</p>
`; 
  containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}