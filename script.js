// Counter for unique IDs
let fieldCounter = 1;

// Function to add new input field
function addField(containerId, labelPrefix) {
    const container = document.getElementById(containerId);
    const fieldId = `field_${containerId}_${fieldCounter}`;
    
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field-container';
    
    if (containerId === 'estadiaFields') {
        // For Estadia: Add category input
        const categoryInput = document.createElement('input');
        categoryInput.type = 'text';
        categoryInput.placeholder = 'Category name';
        categoryInput.className = 'category-input';
        fieldDiv.appendChild(categoryInput);
    } else {
        // For Pasajes and Airbnb: Add name input
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter name';
        nameInput.className = 'name-input';
        fieldDiv.appendChild(nameInput);
    }
    
    // Create amount input
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.id = fieldId;
    amountInput.placeholder = 'Enter amount';
    amountInput.className = 'amount-input';
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.onclick = () => {
        fieldDiv.remove();
        updateSummary();
    };
    deleteButton.className = 'delete-btn';
    
    fieldDiv.appendChild(amountInput);
    fieldDiv.appendChild(deleteButton);
    container.appendChild(fieldDiv);
    
    fieldCounter++;
}

// Function to get all entries from a container
function getContainerEntries(containerId) {
    const container = document.getElementById(containerId);
    const fields = container.getElementsByClassName('field-container');
    const entries = [];
    let total = 0;

    for (let field of fields) {
        const amountInput = field.querySelector('.amount-input');
        const amount = parseFloat(amountInput.value) || 0;
        
        if (containerId === 'estadiaFields') {
            const categoryInput = field.querySelector('.category-input');
            const category = categoryInput ? categoryInput.value.trim() : '';
            
            if (amount) {
                entries.push({
                    category: category || 'Uncategorized',
                    amount: amount
                });
                total += amount;
            }
        } else {
            const nameInput = field.querySelector('.name-input');
            const name = nameInput ? nameInput.value.trim() : '';
            
            if (amount) {
                entries.push({
                    name: name || 'Unnamed',
                    amount: amount
                });
                total += amount;
            }
        }
    }
    
    return { entries, total };
}

// Function to create summary HTML for a section
function createSummaryHTML(entries, isEstadia = false) {
    if (entries.length === 0) return 'No entries yet';
    
    let html = '';
    
    if (isEstadia) {
        // For Estadia: Show by category
        html = entries.map(entry => 
            `<div class="summary-entry">
                <span class="summary-category">${entry.category}</span>
                <span class="summary-amount">${entry.amount} $</span>
            </div>`
        ).join('');
    } else {
        // For Pasajes and Airbnb: Group by name
        const byName = {};
        entries.forEach(entry => {
            if (!byName[entry.name]) {
                byName[entry.name] = 0;
            }
            byName[entry.name] += entry.amount;
        });
        
        html = Object.entries(byName).map(([name, total]) => 
            `<div class="summary-entry">
                <span class="summary-name">${name}</span>
                <span class="summary-amount">${total} $</span>
            </div>`
        ).join('');
    }
    
    return html;
}

// Function to update contributions
function updateContributions() {
    const percentage1Input = document.getElementById('percentage1');
    const percentage2Span = document.getElementById('percentage2');
    const contributor1Input = document.getElementById('contributor1');
    const contributor2Input = document.getElementById('contributor2');
    
    let percentage1 = Math.min(100, Math.max(0, parseFloat(percentage1Input.value) || 0));
    let percentage2 = 100 - percentage1;
    
    percentage1Input.value = percentage1;
    percentage2Span.textContent = percentage2;
    
    // Calculate contributions based on Estadia total only
    const estadiaTotal = getContainerEntries('estadiaFields').total;
    const contribution1 = (estadiaTotal * percentage1 / 100).toFixed(2);
    const contribution2 = (estadiaTotal * percentage2 / 100).toFixed(2);
    
    const name1 = contributor1Input.value.trim() || 'Person 1';
    const name2 = contributor2Input.value.trim() || 'Person 2';
    
    
}

// Modificación de la función updateSummary
function updateSummary() {
    const pasajesInfo = getContainerEntries('pasajesFields');
    const airbnbInfo = getContainerEntries('airbnbFields');
    const estadiaInfo = getContainerEntries('estadiaFields');

    // Update Pasajes summary
    const pasajesSummary = document.getElementById('summaryPasajes');
    pasajesSummary.innerHTML = createSummaryHTML(pasajesInfo.entries, false);
    if (pasajesInfo.entries.length > 0) {
        pasajesSummary.innerHTML += `<div class="section-total">Total: ${pasajesInfo.total} $</div>`;
    }

    // Update Airbnb summary
    const airbnbSummary = document.getElementById('summaryAirbnb');
    airbnbSummary.innerHTML = createSummaryHTML(airbnbInfo.entries, false);
    if (airbnbInfo.entries.length > 0) {
        airbnbSummary.innerHTML += `<div class="section-total">Total: ${airbnbInfo.total} $</div>`;
    }

    // Update Estadia summary
    const estadiaSummary = document.getElementById('summaryEstadia');
    estadiaSummary.innerHTML = createSummaryHTML(estadiaInfo.entries, true);
    if (estadiaInfo.entries.length > 0) {
        estadiaSummary.innerHTML += `<div class="section-total">Total: ${estadiaInfo.total} $</div>`;

        // Contribution logic
        const percentage1 = parseFloat(document.getElementById('percentage1').value) || 0;
        const percentage2 = 100 - percentage1;
        const contribution1 = (estadiaInfo.total * percentage1 / 100).toFixed(2);
        const contribution2 = (estadiaInfo.total * percentage2 / 100).toFixed(2);

        const contributionDetails = `
            <div class="section-total">
                <strong>${document.getElementById('contributor1').value || 'Person 1'}:</strong> ${contribution1} $
            </div>
            <div class="section-total">
                <strong>${document.getElementById('contributor2').value || 'Person 2'}:</strong> ${contribution2} $
            </div>
        `;
        estadiaSummary.innerHTML += contributionDetails;
    }

    // Update grand total
    const grandTotal = pasajesInfo.total + airbnbInfo.total + estadiaInfo.total;
    document.getElementById('grandTotal').textContent = grandTotal;

    // Totals by name for Pasajes and Airbnb
    const totalsByName = {};

    // Sumar los montos de Pasajes y Airbnb por nombre
    [...pasajesInfo.entries, ...airbnbInfo.entries].forEach(entry => {
        if (!totalsByName[entry.name]) {
            totalsByName[entry.name] = 0;
        }
        totalsByName[entry.name] += entry.amount;
    });
    
    // Agregar contribuciones de Estadia por nombre
    const percentage1 = parseFloat(document.getElementById('percentage1').value) || 0;
    const percentage2 = 100 - percentage1;
    
    const estadiaTotal = estadiaInfo.total || 0;
    const contribution1 = (estadiaTotal * percentage1 / 100);
    const contribution2 = (estadiaTotal * percentage2 / 100);
    
    const contributor1 = document.getElementById('contributor1').value.trim() || 'Person 1';
    const contributor2 = document.getElementById('contributor2').value.trim() || 'Person 2';
    
    if (!totalsByName[contributor1]) {
        totalsByName[contributor1] = 0;
    }
    if (!totalsByName[contributor2]) {
        totalsByName[contributor2] = 0;
    }
    
    totalsByName[contributor1] += contribution1;
    totalsByName[contributor2] += contribution2;
    
    // Generar el HTML para mostrar los totales por persona
   

    // Add totals by name after Grand Total
    const totalsByNameHTML = Object.entries(totalsByName).map(([name, total]) => 
        `<div class="summary-entry">
            <span class="summary-name">${name}</span>
            <span class="summary-amount">${total} $</span>
        </div>`
    ).join('');

    const totalsByNameContainer = document.getElementById('totalsByName');
    totalsByNameContainer.innerHTML = `<div><strong>Totals by Name:</strong></div>${totalsByNameHTML}`;

    // Update contributions whenever summary is updated
    updateContributions();
}



// Add event listeners for calculate buttons
document.getElementById('calculatePasajes').addEventListener('click', () => {
    const info = getContainerEntries('pasajesFields');
    document.getElementById('resultPasajes').textContent = info.total;
    updateSummary();
});

document.getElementById('calculateAirbnb').addEventListener('click', () => {
    const info = getContainerEntries('airbnbFields');
    document.getElementById('resultAirbnb').textContent = info.total;
    updateSummary();
});

document.getElementById('calculateEstadia').addEventListener('click', () => {
    const info = getContainerEntries('estadiaFields');
    document.getElementById('resultEstadia').textContent = info.total;
    updateSummary();
});

// Add event listeners for contribution inputs
document.getElementById('contributor1').addEventListener('input', updateContributions);
document.getElementById('contributor2').addEventListener('input', updateContributions);