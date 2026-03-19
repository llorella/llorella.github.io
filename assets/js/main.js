const API = "https://personal-api.lucianolauro77.workers.dev";

function el(id) { return document.getElementById(id); }

function h(tag, text, attrs) {
  var e = document.createElement(tag);
  if (text) e.textContent = text;
  if (attrs) Object.keys(attrs).forEach(function(k) { e.setAttribute(k, attrs[k]); });
  return e;
}

function link(url, text) {
  return h("a", text, { href: url });
}

async function load(path) {
  var r = await fetch(API + path);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

Promise.allSettled([
  load("/about").then(function(d) {
    var box = el("about");
    box.appendChild(h("h2", "about"));
    box.appendChild(h("p", d.bio));
    box.appendChild(h("p", d.role + " — " + d.location));
    var meta = h("p", d.languages.join(", "));
    meta.className = "meta";
    box.appendChild(meta);
  }),

  load("/now").then(function(d) {
    var box = el("now");
    box.appendChild(h("h2", "now"));
    box.appendChild(h("p", d.now.focus));
    if (d.now.building) {
      box.appendChild(h("p", "building: " + d.now.building.join(", ")));
    }
    if (d.now.exploring) {
      box.appendChild(h("p", "exploring: " + d.now.exploring.join(", ")));
    }
    var meta = h("p", "updated " + d.now.updated);
    meta.className = "meta";
    box.appendChild(meta);
  }),

  load("/projects").then(function(d) {
    var box = el("projects");
    box.appendChild(h("h2", "projects"));
    var ul = document.createElement("ul");
    d.projects.forEach(function(p) {
      var li = document.createElement("li");
      li.appendChild(link(p.url, p.name));
      if (p.description) {
        li.appendChild(document.createTextNode(" — " + p.description));
      }
      ul.appendChild(li);
    });
    box.appendChild(ul);
    if (d.github) {
      var p = h("p");
      p.appendChild(link(d.github, "all repos →"));
      box.appendChild(p);
    }
  }),

  load("/contact").then(function(d) {
    var box = el("contact");
    box.appendChild(h("h2", "contact"));
    var p = h("p");
    p.appendChild(link("mailto:" + d.email, d.email));
    box.appendChild(p);
  }),
]);
