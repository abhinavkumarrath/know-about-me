document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

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
            } else {
                // Optional: Reset and re-type
                setTimeout(() => {
                    typingEffect.textContent = '';
                    index = 0;
                    type();
                }, 5000);
            }
        }

        type();
    }

    // Fetch GitHub projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        const githubUsername = 'abhinavkumarrath';

        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    data.forEach(repo => {
                        const projectCard = document.createElement('div');
                        projectCard.classList.add('project-card');

                        projectCard.innerHTML = `
                            <img src="previews/projects/${repo.name}/${repo.name}.jpg" alt="${repo.name} preview">
                            <div class="project-card-content">
                                <h3>${repo.name}</h3>
                                <p>${repo.description || 'No description available.'}</p>
                                <a href="${repo.html_url}" target="_blank">View on GitHub <i class="fas fa-arrow-right"></i></a>
                            </div>
                        `;

                        projectsContainer.appendChild(projectCard);
                    });
                } else {
                    projectsContainer.innerHTML = '<p>No projects found on GitHub.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub projects:', error);
                projectsContainer.innerHTML = '<p style="color: red;">Failed to load projects. Please try again later.</p>';
            });
    }

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // Scroll animations
    const scrollElements = document.querySelectorAll('.section-title, .about-content, .skills-grid, .projects-grid, .contact-form');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;

        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    }

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        })
    }

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
});