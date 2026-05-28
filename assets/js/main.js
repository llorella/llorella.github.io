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

function appendDetail(parent, detail) {
  parent.appendChild(document.createTextNode(" — " + detail.label + ": "));
  if (detail.url && detail.value) {
    parent.appendChild(link(detail.url, detail.value));
  } else if (detail.value) {
    parent.appendChild(document.createTextNode(detail.value));
  } else if (detail.values && detail.values.length) {
    parent.appendChild(document.createTextNode(detail.values.join(", ")));
  }
}

function appendInterest(parent, interest) {
  parent.appendChild(document.createTextNode(interest.name));

  if (interest.links && interest.links.length) {
    parent.appendChild(document.createTextNode(" — "));
    interest.links.forEach(function(item, i) {
      if (i > 0) parent.appendChild(document.createTextNode(", "));
      parent.appendChild(link(item.url, item.label));
    });
  }

  if (interest.details && interest.details.length) {
    interest.details.forEach(function(detail) {
      appendDetail(parent, detail);
    });
  }

  if (interest.note) {
    parent.appendChild(document.createTextNode(" — " + interest.note));
  }
}

function groupByCategory(items) {
  var grouped = [];
  var lookup = {};

  items.forEach(function(item) {
    var category = item.category || "other";
    if (!lookup[category]) {
      lookup[category] = [];
      grouped.push({ category: category, items: lookup[category] });
    }
    lookup[category].push(item);
  });

  return grouped;
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
  }),

  load("/interests").then(function(d) {
    var box = el("interests");
    box.appendChild(h("h2", "interests"));

    groupByCategory(d.interests || []).forEach(function(group) {
      var p = h("p");
      p.appendChild(document.createTextNode(group.category + ": "));
      group.items.forEach(function(interest, i) {
        if (i > 0) p.appendChild(document.createTextNode("; "));
        appendInterest(p, interest);
      });
      box.appendChild(p);
    });
  }),

  load("/uses").then(function(d) {
    var box = el("uses");
    box.appendChild(h("h2", "uses"));
    var items = [
      "editor: " + d.editor,
      "terminal: " + d.terminal,
      "multiplexer: " + d.multiplexer,
      "os: " + d.os,
      "agents: " + d.ai.join(", "),
    ];
    box.appendChild(h("p", items.join(" · ")));
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
  }),

  load("/contact").then(function(d) {
    var box = el("contact");
    box.appendChild(h("h2", "contact"));
    var p = h("p");
    p.appendChild(link("mailto:" + d.email, d.email));
    box.appendChild(p);
  }),
]);
