let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let categoryTotals = JSON.parse(localStorage.getItem('categoryTotals')) || {
    Food: 0,
    Transport: 0,
    Entertainment: 0,
    Shopping: 0,
    Other: 0
};

document.getElementById("add-expense").addEventListener("click", addExpense);
document.getElementById("clear-expenses").addEventListener("click", clearExpenses);

function addExpense() {
    const name = document.getElementById("expense-name").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;

    if (name && amount && category) {
        const expense = { id: Date.now(), name, amount, category };
        expenses.push(expense);
        categoryTotals[category] += amount;

        saveData();
        updateExpenseList();
        updateChart();

        document.getElementById("expense-name").value = '';
        document.getElementById("expense-amount").value = '';
    }
}

function removeExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        categoryTotals[expense.category] -= expense.amount;
        expenses = expenses.filter(exp => exp.id !== id);

        saveData();
        updateExpenseList();
        updateChart();
    }
}

function clearExpenses() {
    expenses = [];
    categoryTotals = { Food: 0, Transport: 0, Entertainment: 0, Shopping: 0, Other: 0 };

    saveData();
    updateExpenseList();
    updateChart();
}

function updateExpenseList() {
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    expenses.forEach(expense => {
        const percentage = ((expense.amount / totalAmount) * 100).toFixed(2);
        const li = document.createElement("li");
        li.innerHTML = `${expense.name} - $${expense.amount.toFixed(2)} (${expense.category}, ${percentage}%) 
            <button onclick="removeExpense(${expense.id})">Remove</button>`;
        expenseList.appendChild(li);
    });
}

function updateChart() {
    const ctx = document.getElementById("expense-chart").getContext("2d");
    if (window.expenseChart) window.expenseChart.destroy();
    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    if (total === 0) return;

    const percentages = Object.keys(categoryTotals).map(category => 
        ((categoryTotals[category] / total) * 100).toFixed(2)
    );

    window.expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals).map((category, i) => 
                `${category} (${percentages[i]}%)`
            ),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


function saveData() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('categoryTotals', JSON.stringify(categoryTotals));
}

updateExpenseList();
updateChart();
