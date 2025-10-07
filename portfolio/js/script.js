document.addEventListener('DOMContentLoaded', () => {
    // Typing effect
    const typingEffect = document.getElementById('typing-effect');
    if (typingEffect) {
        const text = 'Cyber Security Enthusiast';
        let index = 0;

        function type() {
            if (index < text.length) {
                typingEffect.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }

        type();
    }

    // Fetch GitHub projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        const githubUsername = 'abhinavkumarrath'; // <-- Replace with your GitHub username if different

        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    data.forEach(repo => {
                        const projectCard = document.createElement('div');
                        projectCard.classList.add('project-card');

                        projectCard.innerHTML = `
                            <h3>${repo.name}</h3>
                            <p>${repo.description || 'No description available.'}</p>
                            <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                        `;

                        projectsContainer.appendChild(projectCard);
                    });
                } else {
                    projectsContainer.innerHTML = '<p>No projects found. Please check your GitHub username.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub projects:', error);
                projectsContainer.innerHTML = '<p style="color: red;">Failed to load projects. Please check the username and API rate limits.</p>';
            });
    }
});
