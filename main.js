/**
 * Main JavaScript for Math 121 Website
 * Contains shared logic for Navigation, Dark Mode, Feedback, and Utils
 */

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar(); // Dynamic Navbar
    loadFooter(); // Dynamic Footer
    initDarkModeAndScroll();
    initFeedbackSystem();
    initLastUpdated();
    initVisitorCounter();
    initTabs();
    initQuiz();
    initTOC();
    initUnitNavigation();
});

// 1. Mobile Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
            }
        });
    }
}

// 10. Unit Navigation (Next/Prev/PDF)
// 10. Unit Navigation (Next/Prev/PDF)
function initUnitNavigation() {
    const units = [
        { file: 'u1.html', title: 'كثيرات الحدود', pdf: 'ملفات/عروض تقديمية/عرض تقديمي الوحدة الاولى.pdf', ex: 'ex1.html' },
        { file: 'u2.html', title: 'المصفوفات والمحددات', pdf: 'ملفات/عروض تقديمية/عرض تقديمي الوحدة الثانية.pdf', ex: 'ex2.html' },
        { file: 'u3.html', title: 'المعادلات', pdf: 'ملفات/عروض تقديمية/عرض تقديمي الوحدة الثالثة.pdf', ex: 'ex3.html' },
        { file: 'u4.html', title: 'النهايات والاتصال', pdf: 'ملفات/عروض تقديمية/عرض تقديمي الوحدة الرابعة.pdf', ex: 'ex4.html' },
        { file: 'u5.html', title: 'التفاضل', pdf: 'ملفات/عروض تقديمية/عرض تقديمي الوحدة الخامسة.pdf', ex: 'ex5.html' },
        { file: 'u6.html', title: 'التكامل', pdf: 'ملفات/عروض تقديمية/عرض تقديمي الوحدة السادسة.pdf', ex: 'ex6.html' }
    ];

    const currentPath = window.location.pathname;
    let currentUnitIndex = units.findIndex(u => currentPath.endsWith(u.file));
    let isExercisePage = false;

    // Check if it's an exercise page
    if (currentUnitIndex === -1) {
        currentUnitIndex = units.findIndex(u => u.ex && currentPath.endsWith(u.ex));
        if (currentUnitIndex !== -1) isExercisePage = true;
    }

    if (currentUnitIndex === -1) return; // Not a unit or exercise page

    let contentWrapper = document.querySelector('.content-wrapper') || document.querySelector('main');

    // Fallback for exercise pages that might not have main tag but have slides
    if (!contentWrapper && isExercisePage) {
        const firstSlide = document.querySelector('.slide');
        if (firstSlide) {
            contentWrapper = firstSlide.parentElement;
        }
        // Fallback 2: Look for the specific container style or structure if headers are used? 
        // Assuming consistent structure: Header -> Container
        if (!contentWrapper) {
            const header = document.querySelector('header.hero');
            if (header && header.nextElementSibling && header.nextElementSibling.classList.contains('container')) {
                contentWrapper = header.nextElementSibling;
            }
        }
    }

    if (!contentWrapper) return;

    const navContainer = document.createElement('div');
    navContainer.className = 'unit-nav';

    if (isExercisePage) {
        // --- Exercise Page Navigation ---

        // 1. Back to Lesson
        const lessonBtn = document.createElement('a');
        lessonBtn.href = units[currentUnitIndex].file;
        lessonBtn.className = 'nav-btn';
        lessonBtn.innerHTML = `<span>📖</span> العودة للوحدة: ${units[currentUnitIndex].title}`;
        navContainer.appendChild(lessonBtn);

        // 2. Next Unit
        if (currentUnitIndex < units.length - 1) {
            const nextUnit = units[currentUnitIndex + 1];
            const nextBtn = document.createElement('a');
            nextBtn.href = nextUnit.file;
            nextBtn.className = 'nav-btn primary';
            nextBtn.innerHTML = `الوحدة التالية: ${nextUnit.title} <span>⬅️</span>`;
            navContainer.appendChild(nextBtn);
        } else {
            // End of course
            const homeBtn = document.createElement('a');
            homeBtn.href = 'index.html';
            homeBtn.className = 'nav-btn primary';
            homeBtn.innerHTML = `العودة للرئيسية <span>🏠</span>`;
            navContainer.appendChild(homeBtn);
        }

    } else {
        // --- Unit Page Navigation (Existing Logic) ---

        // Previous Button
        if (currentUnitIndex > 0) {
            const prevUnit = units[currentUnitIndex - 1];
            const prevBtn = document.createElement('a');
            prevBtn.href = prevUnit.file;
            prevBtn.className = 'nav-btn';
            prevBtn.innerHTML = `<span>➡️</span> السابق: ${prevUnit.title}`;
            navContainer.appendChild(prevBtn);
        } else {
            const spacer = document.createElement('div');
            navContainer.appendChild(spacer);
        }

        // Exercises Button
        const currentUnit = units[currentUnitIndex];
        if (currentUnit.ex) {
            const exBtn = document.createElement('a');
            exBtn.href = currentUnit.ex;
            exBtn.className = 'nav-btn';
            exBtn.style.background = 'var(--bg-body)';
            exBtn.style.color = 'var(--accent)';
            exBtn.style.borderColor = 'var(--accent)';
            exBtn.innerHTML = `<span>📝</span> تمارين الوحدة`;
            navContainer.appendChild(exBtn);
        }

        // Next Button
        if (currentUnitIndex < units.length - 1) {
            const nextUnit = units[currentUnitIndex + 1];
            const nextBtn = document.createElement('a');
            nextBtn.href = nextUnit.file;
            nextBtn.className = 'nav-btn primary';
            nextBtn.innerHTML = `التالي: ${nextUnit.title} <span>⬅️</span>`;
            navContainer.appendChild(nextBtn);
        } else {
            const homeBtn = document.createElement('a');
            homeBtn.href = 'index.html';
            homeBtn.className = 'nav-btn primary';
            homeBtn.innerHTML = `العودة للرئيسية <span>🏠</span>`;
            navContainer.appendChild(homeBtn);
        }
    }

    contentWrapper.appendChild(navContainer);
}

// 11. Tabs Logic (New)
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.content-section');

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Activate clicked
            tab.classList.add('active');

            // Show Content
            const targetId = tab.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// 9. Table of Contents (Side Menu)
function initTOC() {
    const main = document.querySelector('main');
    // Only run if we have slides/sections and it's not the homepage (simple check)
    // We check if there are multiple h2 headings 
    const Headings = main ? main.querySelectorAll('h2') : [];

    if (!main || Headings.length < 2) return;

    // Don't run on index.html if it has many h2s but different layout (index usually has sections with IDs)
    // Stronger check: check if filename starts with 'u' or contains 'ex+'? 
    // Or just check if we are on a "unit" page. Unit pages usually have title in head different from index.
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        // Double check if index has specific structure we want to avoid?
        // Index has slides too, but maybe we don't want TOC there?
        // User asked "add sidebar to all UNITS".
        // Let's check for specific file naming or just exclude index.
        const path = window.location.pathname;
        if (path.endsWith('index.html') || path === '/' || path.endsWith('/pr/')) return;
    }

    // 1. Create Wrapper Layout
    // 1. Create Wrapper Layout
    const sidebar = document.createElement('aside');
    sidebar.className = 'toc-sidebar';
    sidebar.innerHTML = `
        <div class="toc-header">
            <h3>محتويات الوحدة</h3>
            <button class="toc-toggle" title="تصغير/توسيع القائمة">
                <span class="icon-open">◀</span>
                <span class="icon-closed">▶</span>
            </button>
        </div>
        <ul class="toc-list"></ul>
    `;

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';

    // Move all main children to contentWrapper
    while (main.firstChild) {
        contentWrapper.appendChild(main.firstChild);
    }

    // Append back
    main.appendChild(sidebar);
    main.appendChild(contentWrapper);
    main.classList.add('with-sidebar');

    // Toggle Logic
    const toggleBtn = sidebar.querySelector('.toc-toggle');

    // Function to apply collapsed state
    const setSidebarState = (isCollapsed) => {
        if (isCollapsed) {
            main.classList.add('collapsed');
            sidebar.classList.add('collapsed');
        } else {
            main.classList.remove('collapsed');
            sidebar.classList.remove('collapsed');
        }
    };

    // Restore saved state
    const savedState = localStorage.getItem('toc-collapsed') === 'true';
    setSidebarState(savedState);

    toggleBtn.addEventListener('click', () => {
        const isCollapsed = !sidebar.classList.contains('collapsed');
        setSidebarState(isCollapsed);
        localStorage.setItem('toc-collapsed', isCollapsed);
    });

    // 2. Build Links
    const tocList = sidebar.querySelector('.toc-list');

    Headings.forEach((heading, index) => {
        // Ensure ID
        if (!heading.id) {
            heading.id = `section-${index}`;
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        a.className = 'toc-link';

        // Smooth scroll
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(heading.id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update active state manually
            document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
            a.classList.add('active');
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    // 3. Scroll Spy (Highlight active link)
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.toc-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    Headings.forEach(heading => observer.observe(heading));
}

// 2. Dark Mode & Scroll To Top
function initDarkModeAndScroll() {
    // Create Floating Container
    const floatContainer = document.createElement('div');
    floatContainer.style.cssText = "position: fixed; bottom: 80px; left: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9998;";

    // Dark Mode Toggle
    const darkModeBtn = document.createElement('button');
    darkModeBtn.innerHTML = "🌙";
    darkModeBtn.className = "float-btn";
    darkModeBtn.title = "الوضع الليلي";
    darkModeBtn.onclick = toggleDarkMode;

    // Scroll Top
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = "⬆️";
    scrollTopBtn.className = "float-btn";
    scrollTopBtn.title = "للأعلى";
    scrollTopBtn.style.display = "none";
    scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    floatContainer.appendChild(scrollTopBtn);
    floatContainer.appendChild(darkModeBtn);
    document.body.appendChild(floatContainer);

    // Scroll Listener
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) scrollTopBtn.style.display = 'block';
        else scrollTopBtn.style.display = 'none';
    });

    // Check Saved Theme
    if (localStorage.getItem('theme') === 'dark') {
        enableDarkMode();
    }
}

function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    const btn = document.querySelector('button[title="الوضع الليلي"]');
    if (btn) btn.innerHTML = "☀️";
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    const btn = document.querySelector('button[title="الوضع الليلي"]');
    if (btn) btn.innerHTML = "🌙";
}

// 3. Feedback System
function initFeedbackSystem() {
    // Button
    const btn = document.createElement('button');
    btn.id = 'feedback-btn';
    btn.innerHTML = '<span>📝</span> ملاحظات';
    document.body.appendChild(btn);

    // Modal
    const overlay = document.createElement('div');
    overlay.id = 'feedback-modal-overlay';
    overlay.innerHTML = `
        <div id="feedback-modal">
            <button class="btn-close">&times;</button>
            <h3>أرسل ملاحظاتك</h3>
            <form id="feedback-form" action="https://formspree.io/f/mojjvkzz" method="POST">
                <textarea name="message" placeholder="اكتب ملاحظاتك أو اقتراحاتك هنا..." required></textarea>
                <button type="submit" class="btn-send">إرسال</button>
            </form>
            <div id="feedback-status"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Logic
    const closeBtn = overlay.querySelector('.btn-close');
    const form = overlay.querySelector('#feedback-form');
    const statusMsg = overlay.querySelector('#feedback-status');

    // Open
    btn.addEventListener('click', () => {
        overlay.style.display = 'flex';
    });

    // Close
    const close = () => {
        overlay.style.display = 'none';
        statusMsg.style.display = 'none';
        statusMsg.textContent = '';
        statusMsg.style.color = 'inherit';
    };
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    // Submit AJAX
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const submitBtn = form.querySelector('.btn-send');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                statusMsg.textContent = "شكراً لك! تم استلام ملاحظاتك.";
                statusMsg.style.color = "#22C55E"; // Green
                statusMsg.style.display = "block";
                setTimeout(close, 2000);
            } else {
                statusMsg.textContent = "حدث خطأ أثناء الإرسال. حاول مرة أخرى.";
                statusMsg.style.color = "#EF4444"; // Red
                statusMsg.style.display = "block";
            }
        } catch (error) {
            statusMsg.textContent = "حدث خطأ في الاتصال.";
            statusMsg.style.color = "#EF4444";
            statusMsg.style.display = "block";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// 4. Last Updated Date
function initLastUpdated() {
    const el = document.getElementById('last-updated-date');
    if (el) {
        el.innerText = new Date().toLocaleDateString('ar-SA');
    }
}

// 5. Visitor Counter
function initVisitorCounter() {
    const countEl = document.getElementById('visits-count');
    if (!countEl) return;

    const namespace = 'math121-nawaf';
    const key = 'visits';

    fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
        .then(res => res.json())
        .then(data => {
            countEl.innerText = data.count;
        })
        .catch(err => {
            console.error('Error fetching visits:', err);
            countEl.innerText = "غير متاح";
        });
    // --- Protected Downloads (PIN) ---
    initProtectedDownloads();
}

// 6. PIN Protection Logic
let pendingDownloadUrl = null;
const CORRECT_PIN = "2030";

function initProtectedDownloads() {
    // Inject Modal HTML if not exists
    if (!document.getElementById('pin-modal-overlay')) {
        const modalHTML = `
            <div id="pin-modal-overlay">
                <div id="pin-modal">
                    <h3>🔒 محتوى محمي</h3>
                    <p>الرجاء إدخال الرمز السري لتحميل الملف</p>
                    <input type="password" id="pin-input" class="pin-input" maxlength="4" placeholder="----">
                    <div id="pin-error" class="pin-error">الرمز غير صحيح!</div>
                    <div class="pin-buttons">
                        <button class="pin-btn pin-btn-cancel" onclick="closePinModal()">إلغاء</button>
                        <button class="pin-btn pin-btn-submit" onclick="submitPin()">تحميل</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Enter key support
        document.getElementById('pin-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') submitPin();
        });

        // Clear error on input
        document.getElementById('pin-input').addEventListener('input', function () {
            document.getElementById('pin-error').style.display = 'none';
        });
    }

    // Attach listeners to protected links
    document.addEventListener('click', function (e) {
        const link = e.target.closest('.protected-link');
        if (link) {
            e.preventDefault();
            pendingDownloadUrl = link.href;
            openPinModal();
        }
    });
}

function openPinModal() {
    const overlay = document.getElementById('pin-modal-overlay');
    const modal = document.getElementById('pin-modal');
    const input = document.getElementById('pin-input');

    overlay.style.display = 'flex';
    // Small delay to allow display flex to apply before adding active class for animation
    setTimeout(() => modal.classList.add('active'), 10);

    input.value = '';
    document.getElementById('pin-error').style.display = 'none';
    input.focus();
}

function closePinModal() {
    const overlay = document.getElementById('pin-modal-overlay');
    const modal = document.getElementById('pin-modal');

    modal.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
        pendingDownloadUrl = null;
    }, 200);
}

function submitPin() {
    const input = document.getElementById('pin-input');
    const error = document.getElementById('pin-error');

    if (input.value === CORRECT_PIN) {
        // Success
        closePinModal();
        if (pendingDownloadUrl) {
            window.location.href = pendingDownloadUrl;
        }
    } else {
        // Failure
        error.style.display = 'block';
        input.value = '';
        input.focus();

        // Shake animation effect
        const modal = document.getElementById('pin-modal');
        modal.style.transform = 'translateX(10px)';
        setTimeout(() => modal.style.transform = 'translateX(-10px)', 100);
        setTimeout(() => modal.style.transform = 'translate(0)', 200);
    }
}

// 7. Tab Switching Logic
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.dataset.target;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 8. Quiz Interaction Logic
function initQuiz() {
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.quiz-question');
            const isCorrect = this.dataset.correct === "true";
            parent.querySelectorAll('.quiz-option').forEach(opt => {
                opt.style.background = 'white';
                opt.style.borderColor = '#E2E8F0';
            });
            if (isCorrect) {
                this.style.background = '#F0FDF4';
                this.style.borderColor = '#22C55E';
            } else {
                this.style.background = '#FEF2F2';
                this.style.borderColor = '#EF4444';
            }
        });
    });
}
// 12. Dynamic Navbar Loader
// NOTE: We use inlined HTML strings to ensure this works offline (file:// protocol) where fetch() would fail due to CORS.
const NAVBAR_HTML = `
<nav class="navbar">
    <div class="container nav-content">
        <button class="hamburger" aria-label="Toggle navigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
        <a href="index.html" class="nav-logo">
            <img src="white__logo.svg" alt="Math 121 Logo">
        </a>
        <ul class="nav-links">
            <li><a href="index.html">الرئيسية</a></li>
            <li><a href="index.html#units">الوحدات</a></li>
            <li><a href="index.html#exercises">التمارين</a></li>
            <li><a href="index.html#book-section">الكتاب</a></li>
            <li><a href="index.html#presentations-section">عروض تقديمية</a></li>
            <li><a href="index.html#worksheets-section">أوراق عمل</a></li>
            <li><a href="https://mttvtcedu-my.sharepoint.com/:f:/g/personal/nawafa1_tvtc_gov_sa/IgD0LzC_TO1ITaxdzHu-_9_TAWZI9ZKdXa5H__EnekEh34w?e=I2t1Yp">بنوك الأسئلة</a></li>
            <li><a href="ex+.html" class="active">تمارين إثرائية</a></li>
        </ul>
    </div>
</nav>
`;

const FOOTER_HTML = `
<footer class="footer">
    <div class="container" style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        <p style="margin: 0;">الصفحة الالكترونية لمقرر الرياضيات (رياض 121)</p>
        <p style="margin: 0;">تطوير/ أ. نواف العنزي</p>
        <p style="margin: 0;">&copy; 2025 جميع الحقوق محفوظة</p>
        <p style="margin: 0; font-size: 0.85rem; opacity: 0.8;">آخر تحديث: <span id="last-updated-date"></span></p>
        <div class="visits-badge" title="عدد الزيارات" style="margin-top: 5px;">
            عدد الزيارات: <span id="visits-count">...</span>
        </div>
    </div>
</footer>
`;

async function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    try {
        // Determine relative path based on main.js location
        const scripts = document.querySelectorAll('script');
        let basePath = '';
        scripts.forEach(script => {
            if (script.getAttribute('src') && script.getAttribute('src').includes('main.js')) {
                const src = script.getAttribute('src');
                basePath = src.replace('main.js', '');
            }
        });
        if (basePath === null) basePath = '';

        // Inject HTML directly
        navbarContainer.innerHTML = NAVBAR_HTML;

        // Correct paths for Links and Images
        const elements = navbarContainer.querySelectorAll('a, img');
        elements.forEach(el => {
            const keys = ['href', 'src'];
            keys.forEach(key => {
                const val = el.getAttribute(key);
                // Only adjust relative paths (not http, #, or data)
                if (val && !val.startsWith('http') && !val.startsWith('#') && !val.startsWith('data:') && !val.startsWith('javascript:')) {
                    el.setAttribute(key, basePath + val);
                }
            });
        });

        // Highlight Active Link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = navbarContainer.querySelectorAll('.nav-links a');

        links.forEach(link => link.classList.remove('active'));

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith(currentPage)) {
                link.classList.add('active');
            }
        });

        // Special case for enrichment exercises being active on subpages
        if (window.location.href.includes('تمارين اثرائية') || window.location.href.includes('ex+.html')) {
            links.forEach(link => {
                if (link.href && link.href.includes('ex+.html')) link.classList.add('active');
            });
        }

        initNavigation();

    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

// 13. Dynamic Footer Loader
async function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    try {
        // Determine relative path based on main.js location
        const scripts = document.querySelectorAll('script');
        let basePath = '';
        scripts.forEach(script => {
            if (script.getAttribute('src') && script.getAttribute('src').includes('main.js')) {
                const src = script.getAttribute('src');
                basePath = src.replace('main.js', '');
            }
        });
        if (basePath === null) basePath = '';

        // Inject HTML directly
        footerContainer.innerHTML = FOOTER_HTML;

    } catch (error) {
        console.error('Error loading footer:', error);
    }
}
