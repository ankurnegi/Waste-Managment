let currentMaps = {};
let mockPosts = [
    {type: 'waste', desc: '5kg plastic bottles', img: 'https://via.placeholder.com/80?text=Plastic', date: '2025-10-07', points: 20},
    {type: 'need', desc: 'Need E-Waste for recycling', img: 'https://via.placeholder.com/80?text=E-Waste', date: '2025-10-07', points: 0}
];

// Load from localStorage on init
function loadFromStorage() {
    mockData.userHistory = JSON.parse(localStorage.getItem('userHistory')) || mockData.userHistory;
    mockData.customerHistory = JSON.parse(localStorage.getItem('customerHistory')) || mockData.customerHistory;
    mockData.supplierRequests = JSON.parse(localStorage.getItem('supplierRequests')) || mockData.supplierRequests;
    mockData.deliveryOrders = JSON.parse(localStorage.getItem('deliveryOrders')) || mockDeliveryOrders;
    mockPosts = JSON.parse(localStorage.getItem('mockPosts')) || mockPosts;
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem('userHistory', JSON.stringify(mockData.userHistory));
    localStorage.setItem('customerHistory', JSON.stringify(mockData.customerHistory));
    localStorage.setItem('supplierRequests', JSON.stringify(mockData.supplierRequests));
    localStorage.setItem('deliveryOrders', JSON.stringify(mockData.deliveryOrders));
    localStorage.setItem('mockPosts', JSON.stringify(mockPosts));
}

let mockData = {
    userHistory: [
        {date: '2025-10-07', type: 'Plastic', points: 50, status: 'Completed'},
        {date: '2025-10-06', type: 'Food', points: 100, status: 'Completed'}
    ],
    customerHistory: [
        {date: '2025-10-07', type: 'Food Waste', points: 150, status: 'Completed'},
        {date: '2025-10-05', type: 'Plastic', points: 150, status: 'Completed'}
    ],
    supplierRequests: [],
    deliveryOrders: [
        {id: 1, user: 'John Doe', type: 'Plastic - 5kg', address: '123 Main St', status: 'pending', eta: '10 min'},
        {id: 2, user: 'ABC Restaurant', type: 'Food - 20kg', address: '456 Food Ave', status: 'collected', eta: 'Done'}
    ]
};

const mockDeliveryOrders = [...mockData.deliveryOrders];

loadFromStorage();
document.addEventListener('DOMContentLoaded', () => {
    showView('dashboard-view');
    loadDashboard();
});

function showView(viewId) {
    const views = ['user-view', 'customer-view', 'delivery-view', 'admin-view', 'supplier-view', 'about-view', 'dashboard-view', 'post-view'];
    views.forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    const card = document.querySelector(`#${viewId} .card`);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 100);
    }
    if (viewId === 'post-view') {
        loadPosts();
    } else if (viewId === 'delivery-view') {
        loadDeliveryOrders();
    } else if (viewId === 'user-view') {
        initMap('user');
        loadHistory('user');
    } else if (viewId === 'customer-view') {
        initMap('customer');
        loadHistory('customer');
    } else if (viewId === 'supplier-view') {
        updateSupplierRequests();
    }
}

function showAbout() {
    showView('about-view');
}

function logout() {
    Object.values(currentMaps).forEach(map => map && map.remove());
    currentMaps = {};
    // Reload dashboard without role reset
    showView('dashboard-view');
    loadDashboard();
}

function loadDashboard() {
    // Unified history (combine user/customer)
    const allHistory = [...mockData.userHistory, ...mockData.customerHistory].slice(0, 5);
    const tbody = document.getElementById('dashboard-history');
    tbody.innerHTML = '';
    allHistory.forEach(item => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = item.date;
        row.insertCell(1).textContent = item.type;
        row.insertCell(2).textContent = item.points;
        row.insertCell(3).textContent = item.status;
    });

    // Delivery orders
    const deliveryContainer = document.getElementById('dashboard-delivery-orders');
    if (deliveryContainer) {
        deliveryContainer.innerHTML = '';
        mockData.deliveryOrders.slice(0, 3).forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.className = `order-card ${order.status}`;
            orderEl.innerHTML = `
                <div>
                    <strong>${order.user}</strong><br>
                    ${order.type}<br>
                    ${order.address} | ETA: ${order.eta}
                </div>
                <button onclick="markCollected(${order.id})" class="btn-small ${order.status === 'collected' ? 'disabled' : ''}">
                    ${order.status === 'collected' ? '<i class="fas fa-check-double"></i> Done' : '<i class="fas fa-check"></i> Collect'}
                </button>
            `;
            deliveryContainer.appendChild(orderEl);
        });
    }

    // Supplier requests
    updateSupplierRequests(true);

    // Default points
    const pointsEl = document.getElementById('dashboard-points');
    pointsEl.textContent = 225;
}

function initMap(role) {
    const mapId = role === 'customer' ? 'customer-map' : 'user-map';
    const mapEl = document.getElementById(mapId);
    if (currentMaps[mapId]) return;

    const map = L.map(mapId).setView([28.6139, 77.2090], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const marker = L.marker([28.6139, 77.2090]).addTo(map).bindPopup('Pickup Location - Drag to Update').openPopup();
    marker.dragging.enable();

    map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        marker.bindPopup('Selected Pickup Spot').openPopup();
    });

    currentMaps[mapId] = map;
    mapEl.style.display = 'block';
}

function initDeliveryMap() {
    const mapEl = document.getElementById('delivery-map');
    if (currentMaps['delivery-map']) return;

    const map = L.map('delivery-map').setView([28.6139, 77.2090], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add markers for orders
    mockData.deliveryOrders.forEach(order => {
        L.marker([28.6139 + Math.random() * 0.01, 77.2090 + Math.random() * 0.01])
            .addTo(map)
            .bindPopup(`${order.user}<br>${order.type}<br>Status: ${order.status}`);
    });

    currentMaps['delivery-map'] = map;
    mapEl.style.display = 'block';
}

function schedulePickup(event, role) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const type = document.getElementById(`waste-type-${role}`).value;
    const qty = document.getElementById(`quantity-${role}`).value;
    const addr = document.getElementById(`address-${role}`).value;
    const points = Math.floor(Math.random() * 100) + 50;
    alert(`Pickup booked! Type: ${type}, Qty: ${qty}kg, Address: ${addr}. Earned: ${points} points.\n\nDriver en route - Track on map.`);

    const pointsEl = document.getElementById(`${role}-points`);
    if (pointsEl) pointsEl.textContent = parseInt(pointsEl.textContent) + points;

    const history = mockData[`${role}History`] || mockData.userHistory;
    history.unshift({date: new Date().toISOString().split('T')[0], type, points, status: 'Booked'});
    loadHistory(role);
    saveToStorage();

    form.reset();
}

function loadHistory(role) {
    const tableId = role === 'customer' ? 'customer-history' : 'user-history';
    const history = mockData[`${role}History`] || mockData.userHistory;
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (tbody) {
        tbody.innerHTML = '';
        history.slice(0, 5).forEach(item => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = item.date;
            row.insertCell(1).textContent = item.type;
            row.insertCell(2).textContent = item.points;
            row.insertCell(3).textContent = item.status;
        });
    }
}

function loadDeliveryOrders() {
    const container = document.getElementById('delivery-orders');
    if (container) {
        container.innerHTML = '';
        mockData.deliveryOrders.forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.className = `order-card ${order.status}`;
            orderEl.innerHTML = `
                <div>
                    <strong>${order.user}</strong><br>
                    ${order.type}<br>
                    ${order.address} | ETA: ${order.eta}
                </div>
                <button onclick="markCollected(${order.id})" class="btn-small ${order.status === 'collected' ? 'disabled' : ''}">
                    ${order.status === 'collected' ? '<i class="fas fa-check-double"></i> Done' : '<i class="fas fa-check"></i> Collect'}
                </button>
            `;
            container.appendChild(orderEl);
        });
        initDeliveryMap();
    }
}

function markCollected(id) {
    const order = mockData.deliveryOrders.find(o => o.id === id);
    if (order) {
        order.status = 'collected';
        order.eta = 'Done';
        loadDeliveryOrders();
        loadDashboard();
        saveToStorage();
        alert(`Order ${id} collected! Waste en route to redistribution. Earnings +₹50.`);
    }
}

function generateReport() {
    const reportId = document.getElementById('report-admin') ? 'report-admin' : 'report';
    const reportEl = document.getElementById(reportId);
    if (reportEl) {
        reportEl.innerHTML = '<p><strong>Report:</strong> 80% waste recycled/repurposed. Efficiency: 95%.</p>';
        reportEl.classList.remove('hidden');
    }
    const btn = event.target;
    btn.innerHTML = '<i class="loading"></i> Generating...';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-file-pdf"></i> Generate Report';
    }, 2000);
}

function requestWaste(item) {
    mockData.supplierRequests.push(item);
    alert(`Request placed for ${item}! Awaiting approval for repurposing.`);
    updateSupplierRequests();
    saveToStorage();
}

function updateSupplierRequests(isDashboard = false) {
    const ulId = isDashboard ? 'dashboard-supplier-requests' : 'supplier-requests';
    const ul = document.getElementById(ulId);
    if (!ul) return;
    ul.innerHTML = '';
    mockData.supplierRequests.slice(-5).forEach(req => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-clipboard-list"></i> Requested: ${req}`;
        li.style.padding = '0.5rem';
        li.style.background = '#f9f9f9';
        li.style.marginBottom = '0.25rem';
        li.style.borderRadius = '4px';
        ul.appendChild(li);
    });
}

function postWaste(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const type = document.getElementById('post-type').value;
    const file = document.getElementById('waste-pic').files[0];
    const desc = document.getElementById('post-desc').value;
    const points = type === 'waste' ? Math.floor(Math.random() * 50) + 10 : 0;
    const imgUrl = file ? URL.createObjectURL(file) : 'https://via.placeholder.com/80?text=Waste';
    
    mockPosts.unshift({type, desc, img: imgUrl, date: new Date().toISOString().split('T')[0], points});
    if (type === 'waste') {
        document.getElementById('dashboard-points').textContent = parseInt(document.getElementById('dashboard-points').textContent) + points;
    }
    alert(`${type === 'waste' ? 'Posted waste photo! Earned ' + points + ' points.' : 'Posted need request!'}`);
    loadPosts();
    saveToStorage();
    form.reset();
    document.getElementById('image-preview').innerHTML = '';
}

function loadPosts() {
    const container = document.getElementById('posts-list');
    if (container) {
        container.innerHTML = '';
        mockPosts.slice(0, 5).forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post-item';
            postEl.innerHTML = `
                <img src="${post.img}" alt="Post Image">
                <div>
                    <strong>${post.type.toUpperCase()}</strong> | ${post.date}
                    <p class="post-desc">${post.desc}</p>
                    ${post.points > 0 ? `<span class="points">+${post.points} pts</span>` : ''}
                </div>
            `;
            container.appendChild(postEl);
        });
    }
}

// Image preview
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('waste-pic');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const preview = document.getElementById('image-preview');
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                preview.innerHTML = '';
                preview.appendChild(img);
            }
        });
    }
});