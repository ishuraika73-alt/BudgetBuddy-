// script.js
class BudgetBuddy {
    constructor() {
        this.currentScreen = 'login';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
        this.showScreen('login');
    }

    bindEvents() {
        // Navigation
        document.getElementById('signup-link').addEventListener('click', () => this.showScreen('signup'));
        document.getElementById('back-to-login').addEventListener('click', () => this.showScreen('login'));
        document.getElementById('login-btn').addEventListener('click', () => this.handleLogin());
        document.getElementById('signup-btn').addEventListener('click', () => this.handleSignup());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Home cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.showScreen(screen);
            });
        });

        // Back buttons
        document.getElementById('back-home-transactions').addEventListener('click', () => this.showScreen('home'));
        document.getElementById('back-home-balance').addEventListener('click', () => this.showScreen('home'));
        document.getElementById('back-home-expense').addEventListener('click', () => this.showScreen('home'));

        // Transactions
        document.getElementById('add-transaction').addEventListener('click', () => this.addTransaction());

        // Balance
        document.getElementById('save-balance').addEventListener('click', () => this.addBalance());

        // Goals
        document.getElementById('save-goals').addEventListener('click', () => this.saveGoals());
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;

        // Refresh data for active screens
        if (screenName === 'transactions') this.renderTransactions();
        if (screenName === 'add-balance') this.renderNotes();
        if (screenName === 'expense-tracker') this.renderProgress();
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        if (email) {
            localStorage.setItem('userEmail', email);
            this.showScreen('home');
        } else {
            alert('Please enter email');
        }
    }

    handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        if (name && email) {
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            alert('Account created! Please login.');
            this.showScreen('login');
        } else {
            alert('Please fill all fields');
        }
    }

    logout() {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        this.showScreen('login');
    }

    addTransaction() {
        const title = document.getElementById('trans-title').value;
        const amount = parseFloat(document.getElementById('trans-amount').value);

        if (title && amount) {
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            transactions.push({
                id: Date.now(),
                title,
                amount,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            });
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            document.getElementById('trans-title').value = '';
            document.getElementById('trans-amount').value = '';
            this.renderTransactions();
        }
    }

    renderTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const container = document.getElementById('transactions-list');
        container.innerHTML = transactions.length ? 
            transactions.map(t => `
                <div class="list-item">
                    <div>
                        <div class="title">${t.title}</div>
                        <div class="date">${t.date} ${t.time}</div>
                    </div>
                    <div class="amount ${t.amount >= 0 ? 'positive' : 'negative'}">
                        ${t.amount >= 0 ? '+' : ''}$${Math.abs(t.amount).toFixed(2)}
                    </div>
                </div>
            `).join('') : '<p style="text-align:center;color:#666;">No transactions yet</p>';
    }

    addBalance() {
        const amount = parseFloat(document.getElementById('balance-amount').value);
        const note = document.getElementById('balance-note').value;

        if (amount) {
            const notes = JSON.parse(localStorage.getItem('balanceNotes') || '[]');
            notes.push({
                id: Date.now(),
                amount,
                note: note || 'Balance addition',
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem('balanceNotes', JSON.stringify(notes));
            
            document.getElementById('balance-amount').value = '';
            document.getElementById('balance-note').value = '';
            this.renderNotes();
        }
    }

    renderNotes() {
        const notes = JSON.parse(localStorage.getItem('balanceNotes') || '[]');
        const container = document.getElementById('notes-list');
        container.innerHTML = notes.length ? 
            notes.map(n => `
                <div class="list-item">
                    <div class="title">${n.note}</div>
                    <div class="amount positive">+$${n.amount.toFixed(2)}</div>
                    <div class="date">${n.date}</div>
                </div>
            `).join('') : '<p style="text-align:center;color:#666;">No notes yet</p>';
    }

    saveGoals() {
        const goals = {
            daily: parseFloat(document.getElementById('daily-goal').value) || 0,
            weekly: parseFloat(document.getElementById('weekly-goal').value) || 0,
            monthly: parseFloat(document.getElementById('monthly-goal').value) || 0,
            yearly: parseFloat(document.getElementById('yearly-goal').value) || 0
        };
        localStorage.setItem('goals', JSON.stringify(goals));
        this.renderProgress();
        alert('Goals saved!');
    }

    renderProgress() {
        const goals = JSON.parse(localStorage.getItem('goals') || '{}');
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        
        const today = new Date().toDateString();
        const dailySpent = transactions
            .filter(t => new Date(t.date).toDateString() === today)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const container = document.getElementById('progress-container');
        container.innerHTML = `
            <div class="progress-item">
                <div>Daily Goal: $${goals.daily.toFixed(2)}</div>
                <div>Spent: $${dailySpent.toFixed(2)}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min((dailySpent/goals.daily)*100, 100)}%"></div>
                </div>
            </div>
        `;
    }

    loadData() {
        this.renderTransactions();
        this.renderNotes();
        this.renderProgress();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new BudgetBuddy();
});