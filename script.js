// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userProfile = document.querySelector('.user-profile');
const userName = document.getElementById('user-name');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const closeButtons = document.querySelectorAll('.close');
const issueDetailModal = document.getElementById('issue-detail-modal');

// Navigation Elements
const homeTabs = {
    home: document.getElementById('home-tab'),
    report: document.getElementById('report-tab'),
    myReports: document.getElementById('my-reports-tab'),
    about: document.getElementById('about-tab')
};

const sections = {
    home: document.getElementById('home-section'),
    report: document.getElementById('report-section'),
    myReports: document.getElementById('my-reports-section'),
    about: document.getElementById('about-section')
};

// Dashboard Elements
const reportForm = document.getElementById('report-form');
const issuesContainer = document.getElementById('issues-container');
const myIssuesContainer = document.getElementById('my-issues-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');
const issueDetailContainer = document.getElementById('issue-detail-container');

// Stats Elements
const totalReportsElement = document.getElementById('total-reports');
const resolvedReportsElement = document.getElementById('resolved-reports');
const inProgressReportsElement = document.getElementById('in-progress-reports');
const pendingReportsElement = document.getElementById('pending-reports');

// Sample data (would be replaced with backend API in production)
let currentUser = null;
let issues = [
    {
        id: 1,
        title: 'Pothole on Main Street',
        category: 'roads',
        location: '123 Main St, Downtown',
        description: 'Large pothole approximately 2 feet wide causing traffic hazards and potential vehicle damage.',
        photo: '/api/placeholder/500/250',
        priority: 'high',
        status: 'in-progress',
        date: '2025-03-25',
        reportedBy: 'john.doe@example.com',
        upvotes: 15,
        comments: [
            { author: 'Jane Smith', date: '2025-03-26', text: 'I noticed this too. It\'s getting worse!' },
            { author: 'City Maintenance', date: '2025-03-28', text: 'We\'ve scheduled repairs for next week.' }
        ]
    },
    {
        id: 2,
        title: 'Broken Streetlight',
        category: 'utilities',
        location: 'Corner of Elm St and Oak Ave',
        description: 'Streetlight has been out for over a week creating a safety hazard for pedestrians at night.',
        photo: '/api/placeholder/500/250',
        priority: 'medium',
        status: 'pending',
        date: '2025-03-27',
        reportedBy: 'sarah.jones@example.com',
        upvotes: 8,
        comments: [
            { author: 'Robert Johnson', date: '2025-03-28', text: 'I\'ve reported this to the city last month too.' }
        ]
    },
    {
        id: 3,
        title: 'Overflowing Trash Bins',
        category: 'sanitation',
        location: 'Central Park, North Entrance',
        description: 'Trash bins have not been emptied for days and are now overflowing, attracting wildlife and causing odor.',
        photo: '/api/placeholder/500/250',
        priority: 'medium',
        status: 'resolved',
        date: '2025-03-20',
        reportedBy: 'mike.thompson@example.com',
        upvotes: 23,
        comments: [
            { author: 'Park Services', date: '2025-03-21', text: 'Thank you for reporting. We\'ll increase collection frequency.' },
            { author: 'Lisa Chen', date: '2025-03-25', text: 'Much better now, thanks for the quick response!' }
        ]
    },
    {
        id: 4,
        title: 'Suspicious Activity',
        category: 'safety',
        location: 'Parking lot behind 45 River Rd',
        description: 'Several individuals loitering in the parking lot late at night. Seems to be increasing in frequency.',
        photo: '/api/placeholder/500/250',
        priority: 'high',
        status: 'pending',
        date: '2025-03-29',
        reportedBy: 'david.wilson@example.com',
        upvotes: 10,
        comments: [
            { author: 'Community Watch', date: '2025-03-30', text: 'We\'ll increase patrols in this area.' }
        ]
    }
];

let users = [
    {
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123' // Would use proper authentication in production
    }
];

// Initialize Application
function init() {
    setupEventListeners();
    updateStats();
    renderIssues();
    renderMyIssues();
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab Navigation
    Object.keys(homeTabs).forEach(tab => {
        homeTabs[tab].addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(tab);
        });
    });

    // Login/Register Modal
    loginBtn.addEventListener('click', () => showModal(loginModal));
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(registerModal);
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(registerModal);
        showModal(loginModal);
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(registerModal);
            hideModal(issueDetailModal);
        });
    });

    // Forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    reportForm.addEventListener('submit', handleReportSubmission);
    logoutBtn.addEventListener('click', handleLogout);

    // Filters
    searchBtn.addEventListener('click', filterIssues);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterIssues();
    });
    categoryFilter.addEventListener('change', filterIssues);
    statusFilter.addEventListener('change', filterIssues);

    // Window click to close modal
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) hideModal(loginModal);
        if (e.target === registerModal) hideModal(registerModal);
        if (e.target === issueDetailModal) hideModal(issueDetailModal);
    });
}

// Tab Navigation
function switchTab(tabName) {
    // Hide all sections
    Object.values(sections).forEach(section => section.classList.add('hidden'));
    
    // Remove active class from all tabs
    Object.values(homeTabs).forEach(tab => tab.classList.remove('active'));
    
    // Show selected section and mark tab as active
    sections[tabName].classList.remove('hidden');
    homeTabs[tabName].classList.add('active');
}

// Modal Functions
function showModal(modal) {
    modal.style.display = 'block';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

// Authentication Handlers
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        updateUserInterface();
        hideModal(loginModal);
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    const newUser = { name, email, password };
    users.push(newUser);
    currentUser = newUser;
    
    updateUserInterface();
    hideModal(registerModal);
    showNotification('Registration successful!', 'success');
}

function handleLogout() {
    currentUser = null;
    updateUserInterface();
    switchTab('home');
    showNotification('Logged out successfully', 'success');
}

function updateUserInterface() {
    if (currentUser) {
        loginBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        userName.textContent = currentUser.name;
        homeTabs.myReports.style.display = 'block';
        renderMyIssues();
    } else {
        loginBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
        homeTabs.myReports.style.display = 'none';
        if (!sections.myReports.classList.contains('hidden')) {
            switchTab('home');
        }
    }
}

// Issue Report Handlers
function handleReportSubmission(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to report an issue', 'error');
        showModal(loginModal);
        return;
    }
    
    const newIssue = {
        id: issues.length + 1,
        title: document.getElementById('issue-title').value,
        category: document.getElementById('issue-category').value,
        location: document.getElementById('issue-location').value,
        description: document.getElementById('issue-description').value,
        photo: '/api/placeholder/500/250', // Placeholder for demo
        priority: document.querySelector('input[name="priority"]:checked').value,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        reportedBy: currentUser.email,
        upvotes: 0,
        comments: []
    };
    
    issues.unshift(newIssue);
    reportForm.reset();
    
    updateStats();
    renderIssues();
    renderMyIssues();
    switchTab('home');
    showNotification('Issue reported successfully!', 'success');
}

// Rendering Functions
function renderIssues(filteredIssues = null) {
    const issuesToRender = filteredIssues || issues;
    
    issuesContainer.innerHTML = '';
    
    if (issuesToRender.length === 0) {
        issuesContainer.innerHTML = '<p class="no-issues">No issues found matching your criteria.</p>';
        return;
    }
    
    issuesToRender.forEach(issue => {
        const issueCard = createIssueCard(issue);
        issuesContainer.appendChild(issueCard);
    });
}

function renderMyIssues() {
    if (!currentUser) return;
    
    const myIssues = issues.filter(issue => issue.reportedBy === currentUser.email);
    myIssuesContainer.innerHTML = '';
    
    if (myIssues.length === 0) {
        myIssuesContainer.innerHTML = '<p class="no-issues">You haven\'t reported any issues yet.</p>';
        return;
    }
    
    myIssues.forEach(issue => {
        const issueCard = createIssueCard(issue);
        myIssuesContainer.appendChild(issueCard);
    });
}

function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = 'issue-card';
    card.innerHTML = `
        <div class="issue-header">
            <h3 class="issue-title">${issue.title}</h3>
            <div class="issue-meta">
                <span>${formatDate(issue.date)}</span>
                <span class="issue-category">${getCategoryName(issue.category)}</span>
            </div>
        </div>
        <div class="issue-body">
            <div class="issue-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${issue.location}</span>
            </div>
            <p class="issue-description">${truncateText(issue.description, 100)}</p>
        </div>
        <div class="issue-footer">
            <span class="issue-status status-${issue.status}">${capitalizeFirstLetter(issue.status)}</span>
            <div class="issue-actions">
                <button class="view-details" data-id="${issue.id}">View Details</button>
            </div>
        </div>
    `;
    
    // Add event listener for viewing issue details
    card.querySelector('.view-details').addEventListener('click', () => showIssueDetails(issue.id));
    
    return card;
}

function showIssueDetails(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;
    
    issueDetailContainer.innerHTML = `
        <div class="issue-detail">
            <div class="issue-detail-header">
                <h2 class="issue-detail-title">${issue.title}</h2>
                <div class="issue-detail-meta">
                    <span>Reported on ${formatDate(issue.date)}</span>
                    <span class="issue-detail-category">${getCategoryName(issue.category)}</span>
                </div>
            </div>
            
            <img src="${issue.photo}" alt="${issue.title}" class="issue-detail-image">
            
            <div class="issue-detail-content">
                <div class="issue-detail-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${issue.location}</span>
                </div>
                <p class="issue-detail-description">${issue.description}</p>
            </div>
            
            <div class="issue-detail-status status-${issue.status}">
                <h4>
                    <i class="fas fa-${getStatusIcon(issue.status)}"></i>
                    Status: ${capitalizeFirstLetter(issue.status)}
                </h4>
                <p>Priority: ${capitalizeFirstLetter(issue.priority)}</p>
            </div>
            
            <div class="issue-detail-actions">
                <button class="upvote-btn" data-id="${issue.id}">
                    <i class="fas fa-thumbs-up"></i> Upvote (${issue.upvotes})
                </button>
                <button class="comment-btn">
                    <i class="fas fa-comment"></i> Comment
                </button>
            </div>
            
            <div class="comments-section">
                <div class="comments-header">
                    <h3>Comments (${issue.comments.length})</h3>
                </div>
                
                ${currentUser ? `
                    <form class="comment-form">
                        <textarea placeholder="Add your comment..."></textarea>
                        <button type="submit" data-id="${issue.id}" class="submit-comment">Post Comment</button>
                    </form>
                ` : `
                    <p><i>Please <a href="#" class="login-to-comment">login</a> to comment</i></p>
                `}
                
                <div class="comments-list">
                    ${issue.comments.length > 0 ? issue.comments.map(comment => `
                        <div class="comment">
                            <div class="comment-header">
                                <span class="comment-author">${comment.author}</span>
                                <span class="comment-date">${formatDate(comment.date)}</span>
                            </div>
                            <p class="comment-text">${comment.text}</p>
                        </div>
                    `).join('') : '<p><i>No comments yet</i></p>'}
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for comment submission
    const commentForm = issueDetailContainer.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentText = commentForm.querySelector('textarea').value.trim();
            if (commentText) {
                addComment(issue.id, commentText);
            }
        });
    }
    
    // Add event listener for login to comment link
    const loginToComment = issueDetailContainer.querySelector('.login-to-comment');
    if (loginToComment) {
        loginToComment.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(issueDetailModal);
            showModal(loginModal);
        });
    }
    
    // Add event listener for upvote button
    const upvoteBtn = issueDetailContainer.querySelector('.upvote-btn');
    if (upvoteBtn) {
        upvoteBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please login to upvote', 'error');
                hideModal(issueDetailModal);
                showModal(loginModal);
                return;
            }
            
            issue.upvotes++;
            upvoteBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> Upvote (${issue.upvotes})`;
            showNotification('Upvoted successfully!', 'success');
        });
    }
    
    showModal(issueDetailModal);
}

function addComment(issueId, commentText) {
    if (!currentUser) return;
    
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;
    
    const newComment = {
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        text: commentText
    };
    
    issue.comments.push(newComment);
    showIssueDetails(issueId); // Refresh the issue details view
    showNotification('Comment added successfully!', 'success');
}

// Filter Functions
function filterIssues() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const statusValue = statusFilter.value;
    
    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm) || 
                             issue.description.toLowerCase().includes(searchTerm) ||
                             issue.location.toLowerCase().includes(searchTerm);
        
        const matchesCategory = categoryValue === 'all' || issue.category === categoryValue;
        const matchesStatus = statusValue === 'all' || issue.status === statusValue;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    renderIssues(filteredIssues);
}

// Update Stats
function updateStats() {
    const total = issues.length;
    const resolved = issues.filter(issue => issue.status === 'resolved').length;
    const inProgress = issues.filter(issue => issue.status === 'in-progress').length;
    const pending = issues.filter(issue => issue.status === 'pending').length;
    
    totalReportsElement.textContent = total;
    resolvedReportsElement.textContent = resolved;
    inProgressReportsElement.textContent = inProgress;
    pendingReportsElement.textContent = pending;
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryName(category) {
    const categories = {
        'roads': 'Roads & Traffic',
        'utilities': 'Utilities',
        'sanitation': 'Sanitation',
        'safety': 'Public Safety',
        'others': 'Others'
    };
    return categories[category] || category;
}

function getStatusIcon(status) {
    const icons = {
        'pending': 'exclamation-circle',
        'in-progress': 'clock',
        'resolved': 'check-circle'
    };
    return icons[status] || 'info-circle';
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        document.body.removeChild(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slide-in 0.3s ease-out;
    }
    
    .notification.success {
        background-color: #e8f5e9;
        color: #4caf50;
        border-left: 4px solid #4caf50;
    }
    
    .notification.error {
        background-color: #ffebee;
        color: #f44336;
        border-left: 4px solid #f44336;
    }
    
    .notification.info {
        background-color: #e3f2fd;
        color: #2196f3;
        border-left: 4px solid #2196f3;
    }
    
    .close-notification {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        padding: 0 0 0 10px;
    }
    
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .no-issues {
        text-align: center;
        padding: 20px;
        color: #666;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the app
document.addEventListener('DOMContentLoaded', init);