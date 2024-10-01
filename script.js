// Store expenses in local storage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to update the expense table and totals
function updateExpenses(filteredExpenses = expenses) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    let totalAmount = 0;

    // Check if there are expenses to display
    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = '<tr><td colspan="5" class="text-center">No expenses found</td></tr>';
    }

    // Render each expense
    filteredExpenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${expense.date}</td>
            <td><button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button></td>
        `;
        expenseList.appendChild(row);
        totalAmount += expense.amount;
    });

    // Update total amount
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            expenses.splice(index, 1);
            updateExpenses();
        });
    });

    // Update local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Add Expense Form Submit Handler
document.getElementById('budget-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Add the new expense
    expenses.push({ description, category, amount, date });
    updateExpenses();

    // Clear form inputs
    e.target.reset();
});

// Filter Functionality
function filterExpenses() {
    const category = document.getElementById('filter-category').value;
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const keyword = document.getElementById('filter-keyword').value.toLowerCase();

    let filteredExpenses = expenses.filter(expense => {
        const matchesCategory = category === '' || expense.category === category;
        const matchesDate = (!startDate || new Date(expense.date) >= new Date(startDate)) &&
                            (!endDate || new Date(expense.date) <= new Date(endDate));
        const matchesKeyword = expense.description.toLowerCase().includes(keyword);

        return matchesCategory && matchesDate && matchesKeyword;
    });

    updateExpenses(filteredExpenses);
}

// Reset Filter
function resetFilter() {
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    document.getElementById('filter-keyword').value = '';
    updateExpenses();
}

// Apply filter when button is clicked
document.getElementById('apply-filter').addEventListener('click', filterExpenses);

// Reset filter when button is clicked
document.getElementById('reset-filter').addEventListener('click', resetFilter);

// Load existing expenses on page load
document.addEventListener('DOMContentLoaded', updateExpenses);
