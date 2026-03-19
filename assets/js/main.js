// Change this to your deployed Cloudflare Workers URL
const API_BASE = "https://personal-api.lucianolauro77.workers.dev";

// Dark mode toggle
var toggle = document.getElementById("theme-toggle");
if (toggle) {
  var currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  updateToggleIcon(currentTheme);

  toggle.addEventListener("click", function () {
    var theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateToggleIcon(theme);
  });
}

function updateToggleIcon(theme) {
  if (toggle) {
    toggle.textContent = theme === "dark" ? "\u2600" : "\u263D";
  }
}

// API fetching
async function fetchAPI(endpoint) {
  var response = await fetch(API_BASE + endpoint);
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}

function renderError(el, label) {
  if (el) el.innerHTML = '<p class="error-message">Could not load ' + label + ".</p>";
}

function renderAbout(data, el) {
  if (!el) return;
  var html = '<p>' + data.bio + '</p>';
  html += '<div class="about-meta">';
  html += '<span class="label">Role</span>' + data.role + " &mdash; " + data.location;
  html += '<span class="label">Education</span>' + data.education;
  html += '<span class="label">Languages</span>' + data.languages.map(function (l) {
    return '<span class="tag">' + l + "</span>";
  }).join(" ");
  html += '<span class="label">Interests</span>' + data.interests.join(", ");
  html += "</div>";
  el.innerHTML = html;
}

function renderNow(data, el) {
  if (!el) return;
  var now = data.now;
  var html = '<p class="now-focus">' + now.focus + "</p>";
  if (now.building) {
    html += '<div class="now-list-label">Building</div>';
    html += '<div class="now-items">' + now.building.map(function (b) {
      return '<span class="tag">' + b + "</span>";
    }).join(" ") + "</div>";
  }
  if (now.exploring) {
    html += '<div class="now-list-label">Exploring</div>';
    html += '<div class="now-items">' + now.exploring.map(function (e) {
      return '<span class="tag">' + e + "</span>";
    }).join(" ") + "</div>";
  }
  html += '<div class="now-updated">Updated ' + now.updated + "</div>";
  el.innerHTML = html;
}

function renderProjects(data, el) {
  if (!el) return;
  el.innerHTML = "";
  data.projects.forEach(function (project) {
    var card = document.createElement("div");
    card.className = "project-card";

    var h3 = document.createElement("h3");
    var a = document.createElement("a");
    a.href = project.url;
    a.textContent = project.name;
    h3.appendChild(a);
    card.appendChild(h3);

    if (project.description) {
      var p = document.createElement("p");
      p.textContent = project.description;
      card.appendChild(p);
    }

    if (project.language) {
      var lang = document.createElement("div");
      lang.className = "project-language";
      lang.textContent = project.language;
      card.appendChild(lang);
    }

    el.appendChild(card);
  });

  if (data.github) {
    var link = document.createElement("a");
    link.href = data.github;
    link.className = "view-all";
    link.textContent = "View all on GitHub \u2192";
    el.parentElement.appendChild(link);
  }
}

function renderContact(data, el) {
  if (!el) return;
  var html = "<p>" + data.message + "</p>";
  html += '<p><a href="mailto:' + data.email + '">' + data.email + "</a></p>";
  el.innerHTML = html;
}

function renderLinks(data, el) {
  if (!el) return;
  el.innerHTML = data.links.map(function (link) {
    return '<a href="' + link.url + '">' + link.name.toLowerCase() + "</a>";
  }).join(" &middot; ");
}

// Init
var endpoints = [
  { path: "/about", render: renderAbout, container: "about-content" },
  { path: "/now", render: renderNow, container: "now-content" },
  { path: "/projects", render: renderProjects, container: "projects-list" },
  { path: "/contact", render: renderContact, container: "contact-content" },
  { path: "/links", render: renderLinks, container: "footer-links" },
];

Promise.allSettled(
  endpoints.map(function (ep) {
    return fetchAPI(ep.path)
      .then(function (data) {
        ep.render(data, document.getElementById(ep.container));
      })
      .catch(function () {
        renderError(document.getElementById(ep.container), ep.path.slice(1));
      });
  })
);
