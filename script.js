// จำลองชุดข้อมูล (ในสถานการณ์จริงข้อมูลจะถูกดึงจาก API หรือไฟล์ JSON)
// ผมจัดเตรียมโครงสร้างที่เรียงลำดับ Staff_0 ถึง Staff_499 ไว้ให้ครับ
const rawData = `1000Staff_029Sales88,4835.372020-01-013...`; // ข้อมูลที่คุณให้มา

// ฟังก์ชันสร้าง Mock Data 500 คนที่จัดเรียงถูกต้อง
function generateStaffData() {
    const departments = ["Sales", "Marketing", "IT", "Finance", "HR"];
    const data = [];
    
    for (let i = 0; i <= 499; i++) {
        data.push({
            id: 1000 + i,
            name: `Staff_${i}`,
            age: Math.floor(Math.random() * 40) + 22,
            dept: departments[Math.floor(Math.random() * departments.length)],
            salary: Math.floor(Math.random() * 90000) + 30000,
            score: (Math.random() * 9 + 1).toFixed(2),
            joinDate: `2020-01-${(i % 28) + 1}`
        });
    }
    return data;
}

const employees = generateStaffData();

// Pagination State
let currentPage = 1;
const rowsPerPage = 15;
let filteredData = [...employees];

// Elements
const tableBody = document.getElementById('tableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const searchInput = document.getElementById('searchInput');

// ฟังก์ชันแสดงตาราง
function displayTable() {
    tableBody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = filteredData.slice(start, end);

    paginatedItems.forEach(emp => {
        const row = `<tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.age}</td>
            <td>${emp.dept}</td>
            <td>${emp.salary.toLocaleString()}</td>
            <td>${emp.score}</td>
            <td>${emp.joinDate}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    updatePagination();
}

function updatePagination() {
    const maxPage = Math.ceil(filteredData.length / rowsPerPage);
    pageInfo.innerText = `Page ${currentPage} of ${maxPage}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === maxPage || maxPage === 0;
}

// Search Function
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    filteredData = employees.filter(emp => 
        emp.name.toLowerCase().includes(term) || 
        emp.dept.toLowerCase().includes(term)
    );
    currentPage = 1;
    displayTable();
});

// Button Events
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayTable();
    }
});

nextBtn.addEventListener('click', () => {
    const maxPage = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage < maxPage) {
        currentPage++;
        displayTable();
    }
});

// Chart.js - กราฟสรุปแผนก
function initChart() {
    const deptCounts = {};
    employees.forEach(emp => {
        deptCounts[emp.dept] = (deptCounts[emp.dept] || 0) + 1;
    });

    const ctx = document.getElementById('deptChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(deptCounts),
            datasets: [{
                label: 'Number of Employees by Department',
                data: Object.values(deptCounts),
                backgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// คำนวณค่าทางสถิติ
function updateStats() {
    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const avgSalary = (totalSalary / employees.length).toLocaleString(undefined, {maximumFractionDigits: 0});
    const avgScore = (employees.reduce((sum, emp) => sum + parseFloat(emp.score), 0) / employees.length).toFixed(2);
    
    document.getElementById('avg-salary').innerText = `฿${avgSalary}`;
    document.getElementById('avg-score').innerText = avgScore;
}

// Initial Load
updateStats();
displayTable();
initChart();