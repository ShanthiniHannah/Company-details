const API_BASE = ''; // Relative path since we are serving from same origin

document.addEventListener('DOMContentLoaded', () => {
    // checkAuth(); // Optional: User wants all public, so we don't strictly need this, but good to keep UI clean
    // Actually, let's keep checkAuth but it won't be enforcing anything anymore. 
    // Or better, if they want "all public", we should just show the UI as if logged in or remove login entirely.
    // Let's just remove the explicit checks for now.
    checkAuth();
    fetchHRs();
    fetchEmployees();

    // Event Listeners for Forms
    document.getElementById('add-hr-form').addEventListener('submit', handleAddHR);
    document.getElementById('add-employee-form').addEventListener('submit', handleAddEmployee);

    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
});

async function checkAuth() {
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        const authSection = document.getElementById('auth-section');

        if (data.authenticated) {
            authSection.innerHTML = `
                <span style="color: var(--text-muted); font-size: 0.9rem; margin-right: 0.5rem;">Hi, ${data.user.name}</span>
                <button onclick="logout()" class="btn btn-sm btn-danger">Logout</button>
            `;
            // Enable add buttons? They are always visible but server rejects if not logged in. 
            // We could hide them here if we wanted to be stricter visually.
        } else {
            authSection.innerHTML = `<a href="/login" class="btn btn-primary btn-sm">Login</a>`;
        }
    } catch (error) {
        console.error('Auth check failed', error);
    }
}

async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.reload();
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        // If opening employee modal, refresh HR select options
        if (modalId === 'employee-modal') {
            refreshHROptions();
        }
    }
}

// --- HR FUNCTIONS ---

async function fetchHRs() {
    try {
        const response = await fetch(`${API_BASE}/hr`);
        const hrs = await response.json();
        const tbody = document.querySelector('#hr-table tbody');
        tbody.innerHTML = '';

        if (hrs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No HR records found</td></tr>';
            return;
        }

        hrs.forEach(hr => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${hr.id}</td>
                <td>${hr.name}</td>
                <td>${hr.email}</td>
                <td>${hr.department || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching HRs:', error);
    }
}

async function handleAddHR(e) {
    e.preventDefault();
    const name = document.getElementById('hr-name').value;
    const email = document.getElementById('hr-email').value;
    const department = document.getElementById('hr-dept').value;

    try {
        const response = await fetch(`${API_BASE}/hr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, department })
        });

        if (response.ok) {
            toggleModal('hr-modal');
            e.target.reset();
            fetchHRs();
            // Also refresh employees in case HR relation display updates (though here it's simple)
        } else {
            const data = await response.json();
            if (response.status === 401) {
                alert('Authentication required. Please login.');
                window.location.href = '/login';
            } else {
                alert('Error: ' + (data.error || 'Failed to add HR'));
            }
        }
    } catch (error) {
        console.error('Error adding HR:', error);
        alert('Failed to connect to server');
    }
}

async function deleteHR(id) {
    if (!confirm('Are you sure? This will delete the HR record.')) return;

    try {
        const response = await fetch(`${API_BASE}/hr/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchHRs();
        } else {
            alert('Failed to delete HR');
        }
    } catch (error) {
        console.error(error);
    }
}

// --- EMPLOYEE FUNCTIONS ---

async function fetchEmployees() {
    try {
        const response = await fetch(`${API_BASE}/employee`);

        const employees = await response.json();
        const tbody = document.querySelector('#employee-table tbody');
        tbody.innerHTML = '';

        if (employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No Employee records found</td></tr>';
            return;
        }

        employees.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.age || '-'}</td>
                <td>${emp.gender || '-'}</td>
                <td>${emp.address || '-'}</td>
                <td>${emp.hr_id || 'Unassigned'}</td>
                <td>${emp.sponsor || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching Employees:', error);
    }
}

async function handleAddEmployee(e) {
    e.preventDefault();
    const name = document.getElementById('emp-name').value;
    const age = document.getElementById('emp-age').value;
    const gender = document.getElementById('emp-gender').value;
    const address = document.getElementById('emp-address').value;
    const sponsor = document.getElementById('emp-sponsor').value;
    const hr_id = document.getElementById('emp-hr-id').value;

    const payload = {
        name,
        age: age ? parseInt(age) : null,
        gender,
        address,
        sponsor,
        hr_id: hr_id ? parseInt(hr_id) : null
    };

    try {
        const response = await fetch(`${API_BASE}/employee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            toggleModal('employee-modal');
            e.target.reset();
            fetchEmployees();
        } else {
            const data = await response.json();
            if (response.status === 401) {
                alert('Authentication required. Please login.');
                window.location.href = '/login';
            } else {
                alert('Error: ' + (data.error || 'Failed to add Employee'));
            }
        }
    } catch (error) {
        console.error('Error adding Employee:', error);
        alert('Failed to connect to server');
    }
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch(`${API_BASE}/employee/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchEmployees();
        } else {
            alert('Failed to delete Employee');
        }
    } catch (error) {
        console.error(error);
    }
}

async function refreshHROptions() {
    const select = document.getElementById('emp-hr-id');
    select.innerHTML = '<option value="">Select HR...</option>';

    try {
        const response = await fetch(`${API_BASE}/hr`);
        const hrs = await response.json();
        hrs.forEach(hr => {
            const option = document.createElement('option');
            option.value = hr.id;
            option.textContent = `${hr.name} (${hr.department || 'General'})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load HRs for select dropdown');
    }
}
