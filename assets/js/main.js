document.addEventListener('DOMContentLoaded', function() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;

    const GITHUB_USER = 'llorella';
    const EXCLUDED_REPOS = ['llorella.github.io'];
    const MAX_PROJECTS = 5;

    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated`)
        .then(response => response.json())
        .then(repos => {
            const filtered = repos
                .filter(repo => !EXCLUDED_REPOS.includes(repo.name))
                .slice(0, MAX_PROJECTS);

            filtered.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'project-card';

                const title = document.createElement('h3');
                const link = document.createElement('a');
                link.href = repo.html_url;
                link.textContent = repo.name;
                title.appendChild(link);
                card.appendChild(title);

                if (repo.description) {
                    const desc = document.createElement('p');
                    desc.textContent = repo.description;
                    card.appendChild(desc);
                }

                if (repo.language) {
                    const lang = document.createElement('div');
                    lang.className = 'project-language';
                    lang.textContent = repo.language;
                    card.appendChild(lang);
                }

                projectsList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
            projectsList.innerHTML = '<p>Unable to load projects.</p>';
        });
});
