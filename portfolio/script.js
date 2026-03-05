// ==========================================================
// 1. 3D Tilt Effect for Glass Cards (ULTRA-FAST GPU)
// ==========================================================
function applyCardInteractions() {
    const cards = document.querySelectorAll(".glass-card:not([data-tilt-applied])");
    
    cards.forEach((card) => {
        card.dataset.tiltApplied = "true"; 
        let bounds;

        card.addEventListener("mouseenter", () => {
            bounds = card.getBoundingClientRect();
            // Remove any delay so it instantly locks to the mouse
            card.style.transition = "none"; 
        });

        card.addEventListener("mousemove", (e) => {
            requestAnimationFrame(() => {
                if (!bounds) bounds = card.getBoundingClientRect();
                
                const x = e.clientX - bounds.left; 
                const y = e.clientY - bounds.top;  
                
                const centerX = bounds.width / 2;
                const centerY = bounds.height / 2;
                
                // Cranked up to 20 for a much sharper, faster tilt!
                const rotateX = ((y - centerY) / centerY) * -20; 
                const rotateY = ((x - centerX) / centerX) * 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
        });

        card.addEventListener("mouseleave", () => {
            requestAnimationFrame(() => {
                // Add a smooth 0.5s transition just for the snap-back
                card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease";
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            });
            bounds = null; 
        });
    });
}
// Run immediately for static cards (Like on the About page)
applyCardInteractions();

// ==========================================================
// 2. Scroll Reveal Animations
// ==========================================================
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(section => {
    observer.observe(section);
});

// ==========================================================
// 3. Typing Animation (For Landing Page)
// ==========================================================
const typedTextSpan = document.querySelector(".typing-text");
const textArray = [
    "Cybersecurity Enthusiast.", 
    "C++ Systems Programmer.",
    "Linux System Administrator.", 
    "Python Developer.",
    "Network Defender.",
    "Aspiring Security Officer."
];
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (!typedTextSpan) return;
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000); 
    }
}

function erase() {
    if (!typedTextSpan) return;
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, 500); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typedTextSpan) setTimeout(type, 1000);
});

// ==========================================================
// 4. Advanced Liveness GitHub API Fetcher
// ==========================================================
async function fetchGitHubProjects() {
    const container = document.getElementById('github-projects');
    if (!container) return;

    try {
        const response = await fetch('https://api.github.com/users/abhinavkumarrath/repos?sort=updated&direction=desc');
        const repos = await response.json();
        
        container.innerHTML = ''; 
        const topRepos = repos.filter(repo => !repo.fork).slice(0, 6);

        const langColors = {
            "C++": "#f34b7d", "C": "#555555", "Python": "#3572A5", "Shell": "#89e051", 
            "JavaScript": "#f1e05a", "HTML": "#e34c26", "CSS": "#563d7c", "TypeScript": "#3178c6"
        };

        for (const repo of topRepos) {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = "_blank";
            card.className = "glass-card fade-up visible"; 

            const lastUpdate = new Date(repo.pushed_at);
            const now = new Date();
            const diffTime = Math.abs(now - lastUpdate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // CRITICAL FIX: Only generate the HTML for Active or Stable projects
            let statusHtml = '';
            if (diffDays <= 7) {
                statusHtml = `
                    <div class="status-indicator status-active" style="display: flex; align-items: center; font-size: 0.75rem; opacity: 0.8; margin-top: 5px;">
                        <span class="status-dot"></span>
                        <span>ACTIVE (Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago)</span>
                    </div>`;
            } else if (diffDays <= 30) {
                statusHtml = `
                    <div class="status-indicator status-stable" style="display: flex; align-items: center; font-size: 0.75rem; opacity: 0.8; margin-top: 5px;">
                        <span class="status-dot"></span>
                        <span>STABLE (Updated ${diffDays} days ago)</span>
                    </div>`;
            }

            const desc = repo.description || 'Systems and security development project actively maintained on GitHub.';

            let cardHTML = `
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0;">${repo.name}</h3>
                    ${statusHtml} 
                </div>
                <p>${desc}</p>
                <div class="tech-tags" style="margin-top: auto; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span class="tag"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="tag"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
            `;

            try {
                const langResponse = await fetch(repo.languages_url);
                const languages = await langResponse.json();
                const totalBytes = Object.values(languages).reduce((sum, value) => sum + value, 0);

                if (totalBytes > 0) {
                    let langBarHTML = `<div class="language-bar">`;
                    let langTagsHTML = `<div class="tech-tags" style="margin-top: 0.5rem;">`;
                    
                    const sortedLanguages = Object.entries(languages).sort(([, a], [, b]) => b - a);
                    
                    sortedLanguages.forEach(([name, bytes]) => {
                        const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                        const color = langColors[name] || 'var(--accent-1)';
                        
                        langBarHTML += `<div class="lang-segment" style="width: ${percentage}%; background-color: ${color};" data-lang-info="${name}: ${percentage}%"></div>`;
                        langTagsHTML += `<span class="tag" style="border-color:${color}40; color:${color};">${name} (${percentage}%)</span>`;
                    });

                    langBarHTML += `</div>`; 
                    langTagsHTML += `</div>`; 
                    
                    cardHTML += langBarHTML + langTagsHTML;
                }
            } catch (err) { console.error("Error fetching languages for " + repo.name, err); }

            card.innerHTML = cardHTML;
            container.appendChild(card);
        }
        
        // CRITICAL FIX: Bind the new ultra-fast 3D hover effect to the newly generated GitHub cards!
        applyCardInteractions();

    } catch (error) {
        console.error("Critical GitHub API error", error);
        container.innerHTML = '<p style="text-align:center; color: #ef4444;">Error connecting to GitHub. Check network architecture or API rate limits.</p>';
    }
}
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);