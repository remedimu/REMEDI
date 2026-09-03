// ===== Mobile nav toggle =====
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
mainNav.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => mainNav.classList.remove("open"))
);

// ===== Load content.json and render everything =====
let ALL_GROUPS = [];

fetch("data/content.json")
  .then(res => res.json())
  .then(data => {
    renderCourses(data.courses);
    renderBlogs(data.groups);
    renderUpdates(data.updates);
    renderTeam(data.team);
    renderLinks(data.links);
    renderFooterBlogLinks(data.groups);
    renderResources(data.resources);
  })
  .catch(err => console.error("Could not load content.json", err));

function renderCourses(courses) {
  const grid = document.getElementById("courseGrid");
  grid.innerHTML = courses.map(c => `
    <div class="course-card">
      <div class="video-wrap">
        ${c.youtubeId
          ? `<iframe src="https://www.youtube.com/embed/${c.youtubeId}" title="${c.title}" allowfullscreen></iframe>`
          : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.9rem;">Add YouTube video ID in content.json</div>`}
      </div>
      <div class="body">
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <div class="instructor">${c.instructor}</div>
      </div>
    </div>
  `).join("");
}

function renderBlogs(groups) {
  ALL_GROUPS = groups;
  populateFilters(groups);
  drawBlogGrid(groups);
}

function drawBlogGrid(groups) {
  const grid = document.getElementById("blogGrid");
  if (!groups.length) {
    grid.innerHTML = `<p style="opacity:0.7">No groups match your search.</p>`;
    return;
  }
  grid.innerHTML = groups.map(g => `
    <div class="blog-card">
      <span class="tag-pill">${g.tag}</span>
      <h3>${g.title}</h3>
      ${g.leader ? `<div class="leader">Group Leader: ${g.leader}</div>` : ""}
      <p class="summary">${g.summary}</p>
      <div class="post-log">
        <div class="post-log-heading">Articles</div>
        ${g.posts.map(p => `
          <div class="post-row">
            <div>
              <div class="post-title">${p.postTitle}</div>
              <div class="post-date">📅 ${p.date}</div>
            </div>
            ${p.pdf ? `<a href="${p.pdf}" class="pdf-btn">PDF</a>` : `<span class="pdf-btn" style="opacity:0.5">Coming soon</span>`}
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function populateFilters(groups) {
  const topicSel = document.getElementById("topicFilter");
  const yearSel = document.getElementById("yearFilter");
  const topics = [...new Set(groups.map(g => g.tag))];
  const years = [...new Set(groups.flatMap(g => g.posts.map(p => p.date.split(" ").pop())))];
  topics.forEach(t => topicSel.insertAdjacentHTML("beforeend", `<option value="${t}">${t}</option>`));
  years.forEach(y => yearSel.insertAdjacentHTML("beforeend", `<option value="${y}">${y}</option>`));

  document.getElementById("blogSearch").addEventListener("input", applyFilters);
  topicSel.addEventListener("change", applyFilters);
  yearSel.addEventListener("change", applyFilters);
}

function applyFilters() {
  const q = document.getElementById("blogSearch").value.toLowerCase();
  const topic = document.getElementById("topicFilter").value;
  const year = document.getElementById("yearFilter").value;
  const filtered = ALL_GROUPS.filter(g => {
    const matchesQ = !q || g.title.toLowerCase().includes(q) || g.tag.toLowerCase().includes(q) || (g.leader || "").toLowerCase().includes(q);
    const matchesTopic = !topic || g.tag === topic;
    const matchesYear = !year || g.posts.some(p => p.date.endsWith(year));
    return matchesQ && matchesTopic && matchesYear;
  });
  drawBlogGrid(filtered);
}

function renderUpdates(updates) {
  const grid = document.getElementById("updateGrid");
  grid.innerHTML = updates.map(u => `
    <div class="update-card">
      <div class="thumb">${u.image ? `<img src="${u.image}" alt="${u.title}" style="width:100%;height:100%;object-fit:cover">` : "💡"}</div>
      <div class="body">
        <h3>${u.title}</h3>
        <p>${u.description}</p>
        <a href="#" class="learn-more">Learn more →</a>
      </div>
    </div>
  `).join("");
}

function renderTeam(team) {
  const commWrap = document.getElementById("committeeGrid");

  // Each committee gets its own name heading, with its members' cards below it.
  // Executive Committee (President/VP) appears first automatically because
  // it's listed first in content.json.
  commWrap.innerHTML = team.committees.map(committee => `
    <div class="committee-block">
      <h3 class="committee-title">${committee.committeeName}</h3>
      <div class="team-grid">
        ${committee.members.map(personCard).join("")}
      </div>
    </div>
  `).join("");
}

function personCard(p) {
  const initials = p.name ? p.name.split(" ").map(w => w[0]).slice(0,2).join("") : "?";
  return `
    <div class="team-card">
      <div class="avatar">${p.photo ? `<img src="${p.photo}" alt="${p.name}">` : initials}</div>
      <h4>${p.name || "Name coming soon"}</h4>
      <div class="role">${p.role}</div>
      <p class="bio">${p.bio || "Bio coming soon."}</p>
    </div>
  `;
}

function renderLinks(links) {
  document.getElementById("addressText").textContent = links.address;
  document.getElementById("emailText").textContent = links.email;
  document.getElementById("footerEmailLink").href = `mailto:${links.email}`;

  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    window.open(links.googleForm, "_blank");
  });
}

function renderFooterBlogLinks(groups) {
  const container = document.getElementById("footerBlogLinks");
  const tags = [...new Set(groups.map(g => g.tag))];
  container.innerHTML = `<h5>Blogs</h5>` + tags.map(t => `<a href="#blogs">${t}</a>`).join("");
}

function renderResources(resources) {
  const templatesList = document.getElementById("proposalTemplatesList");
  const guidesList = document.getElementById("writingGuidesList");
  const oppsText = document.getElementById("researchOppsText");

  templatesList.innerHTML = resources.proposalTemplates.map(item =>
    item.pdf
      ? `<a href="${item.pdf}">${item.name} (PDF)</a>`
      : `<span style="display:block;opacity:0.5;margin-bottom:10px;">${item.name} (PDF coming soon)</span>`
  ).join("");

  guidesList.innerHTML = resources.writingGuides.map(item =>
    item.pdf
      ? `<a href="${item.pdf}">${item.name} (PDF)</a>`
      : `<span style="display:block;opacity:0.5;margin-bottom:10px;">${item.name} (PDF coming soon)</span>`
  ).join("");

  oppsText.textContent = resources.researchOpportunities;
}
