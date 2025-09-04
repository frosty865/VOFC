// Global variables
let vulnerabilityData = null;
let categories = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadCatalogData();
    setupEventListeners();
});

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// API base URL - change this to your server's IP address
const API_BASE_URL = 'http://10.0.0.99:3001';

// Load categories for dropdowns
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (response.ok) {
            categories = await response.json();
            populateCategoryDropdowns();
        } else {
            console.error('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Populate category dropdowns
function populateCategoryDropdowns() {
    const vulnCategorySelect = document.getElementById('vuln-category');
    const optCategorySelect = document.getElementById('opt-category');
    
    categories.forEach(category => {
        const option1 = new Option(category.name, category.id);
        const option2 = new Option(category.name, category.id);
        vulnCategorySelect.add(option1);
        optCategorySelect.add(option2);
    });
}

// Load standards for a category
async function loadStandards(categorySelectId, standardSelectId) {
    const categorySelect = document.getElementById(categorySelectId);
    const standardSelect = document.getElementById(standardSelectId);
    
    if (!categorySelect.value) {
        standardSelect.disabled = true;
        standardSelect.innerHTML = '<option value="">Select a standard...</option>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categorySelect.value}/standards`);
        if (response.ok) {
            const standards = await response.json();
            standardSelect.innerHTML = '<option value="">Select a standard...</option>';
            standards.forEach(standard => {
                const option = new Option(standard.name, standard.id);
                standardSelect.add(option);
            });
            standardSelect.disabled = false;
        } else {
            console.error('Failed to load standards');
        }
    } catch (error) {
        console.error('Error loading standards:', error);
    }
}

// Load catalog data
async function loadCatalogData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/vulnerabilities`);
        if (response.ok) {
            vulnerabilityData = await response.json();
            renderCatalog();
        } else {
            document.getElementById('catalog-content').innerHTML = 
                '<div class="message error">Failed to load catalog data</div>';
        }
    } catch (error) {
        document.getElementById('catalog-content').innerHTML = 
            '<div class="message error">Error loading catalog data</div>';
    }
}

// Render the catalog
function renderCatalog() {
    if (!vulnerabilityData || !vulnerabilityData.VOFC_Library) {
        document.getElementById('catalog-content').innerHTML = 
            '<div class="message error">No data available</div>';
        return;
    }

    const categories = vulnerabilityData.VOFC_Library.categories;
    const categoryKeys = Object.keys(categories);

    let html = `
        <div class="form-group">
            <label for="catalog-category">Select Category:</label>
            <select id="catalog-category" onchange="renderCategoryData()">
                <option value="">Choose a category...</option>
                ${categoryKeys.map(key => 
                    `<option value="${key}">${categories[key].name}</option>`
                ).join('')}
            </select>
        </div>
        
        <div id="catalog-data"></div>
    `;

    document.getElementById('catalog-content').innerHTML = html;
}

// Render category data
function renderCategoryData() {
    const categorySelect = document.getElementById('catalog-category');
    const catalogData = document.getElementById('catalog-data');
    
    if (!categorySelect.value) {
        catalogData.innerHTML = '';
        return;
    }

    const category = vulnerabilityData.VOFC_Library.categories[categorySelect.value];
    const standards = category.standards;
    const standardKeys = Object.keys(standards);

    let html = `
        <div class="form-group">
            <label for="catalog-standard">Select Standard:</label>
            <select id="catalog-standard" onchange="renderStandardData()">
                <option value="">Choose a standard...</option>
                ${standardKeys.map(key => 
                    `<option value="${key}">${standards[key].name}</option>`
                ).join('')}
            </select>
        </div>
        
        <div id="standard-data"></div>
    `;

    catalogData.innerHTML = html;
}

// Render standard data
function renderStandardData() {
    const categorySelect = document.getElementById('catalog-category');
    const standardSelect = document.getElementById('catalog-standard');
    const standardData = document.getElementById('standard-data');
    
    if (!categorySelect.value || !standardSelect.value) {
        standardData.innerHTML = '';
        return;
    }

    const category = vulnerabilityData.VOFC_Library.categories[categorySelect.value];
    const standard = category.standards[standardSelect.value];

    let html = `<h2>${category.name} - ${standard.name}</h2>`;

    // Render vulnerabilities
    if (standard.vulnerabilities && standard.vulnerabilities.length > 0) {
        html += '<h3>Vulnerabilities</h3>';
        standard.vulnerabilities.forEach((item, index) => {
            html += renderVulnerabilityItem(item, index);
        });
    }

    // Render enhancements
    if (standard.enhancements && standard.enhancements.length > 0) {
        html += '<h3>Enhancements</h3>';
        standard.enhancements.forEach((item, index) => {
            html += renderEnhancementItem(item, index);
        });
    }

    // Render sustainments
    if (standard.sustainments && standard.sustainments.length > 0) {
        html += '<h3>Sustainments</h3>';
        standard.sustainments.forEach((item, index) => {
            html += renderSustainmentItem(item, index);
        });
    }

    // Render options for consideration
    if (standard.options_for_consideration && standard.options_for_consideration.length > 0) {
        html += '<h3>Options for Consideration</h3>';
        standard.options_for_consideration.forEach((item, index) => {
            html += renderOptionItem(item, index);
        });
    }

    standardData.innerHTML = html;
}

// Render vulnerability item
function renderVulnerabilityItem(item, index) {
    let html = `
        <div class="vulnerability-item">
            <h3>Vulnerability: ${item.issue}</h3>
            <p><strong>Condition:</strong> ${item.condition}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Action:</strong> ${item.action}</p>
            <p><strong>Severity:</strong> <span class="severity-${item.severity}">${item.severity}</span></p>
    `;

    if (item.standards && item.standards.length > 0) {
        html += `<p><strong>Standards:</strong> ${item.standards.join(', ')}</p>`;
    }

    if (item.business_impact) {
        html += renderBusinessImpact(item.business_impact);
    }

    html += '</div>';
    return html;
}

// Render enhancement item
function renderEnhancementItem(item, index) {
    let html = `
        <div class="enhancement-item">
            <h3>Enhancement: ${item.issue}</h3>
            <p><strong>Condition:</strong> ${item.condition}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Action:</strong> ${item.action}</p>
            <p><strong>Severity:</strong> <span class="severity-${item.severity}">${item.severity}</span></p>
    `;

    if (item.standards && item.standards.length > 0) {
        html += `<p><strong>Standards:</strong> ${item.standards.join(', ')}</p>`;
    }

    if (item.business_impact) {
        html += renderBusinessImpact(item.business_impact);
    }

    html += '</div>';
    return html;
}

// Render sustainment item
function renderSustainmentItem(item, index) {
    let html = `
        <div class="sustainment-item">
            <h3>Sustainment: ${item.issue}</h3>
            <p><strong>Condition:</strong> ${item.condition}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Action:</strong> ${item.action}</p>
            <p><strong>Severity:</strong> <span class="severity-${item.severity}">${item.severity}</span></p>
    `;

    if (item.standards && item.standards.length > 0) {
        html += `<p><strong>Standards:</strong> ${item.standards.join(', ')}</p>`;
    }

    if (item.business_impact) {
        html += renderBusinessImpact(item.business_impact);
    }

    html += '</div>';
    return html;
}

// Render option item
function renderOptionItem(item, index) {
    return `
        <div class="option-item">
            <h3>Option: ${item.level}</h3>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Business Value:</strong> ${item.business_value}</p>
        </div>
    `;
}

// Render business impact
function renderBusinessImpact(businessImpact) {
    let html = '<div class="business-impact"><h4>Business Impact:</h4><ul>';
    
    if (businessImpact.property) {
        html += `<li><strong>Property:</strong> ${businessImpact.property}</li>`;
    }
    if (businessImpact.people) {
        html += `<li><strong>People:</strong> ${businessImpact.people}</li>`;
    }
    if (businessImpact.business) {
        html += `<li><strong>Business:</strong> ${businessImpact.business}</li>`;
    }
    
    html += '</ul></div>';
    return html;
}

// Setup event listeners
function setupEventListeners() {
    // Vulnerability form submission
    document.getElementById('vulnerability-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            category: formData.get('category'),
            standard: formData.get('standard'),
            type: formData.get('type'),
            data: {
                condition: formData.get('condition'),
                issue: formData.get('issue'),
                description: formData.get('description'),
                action: formData.get('action'),
                severity: formData.get('severity'),
                standards: formData.get('standards') ? formData.get('standards').split(',').map(s => s.trim()) : [],
                business_impact: {
                    property: formData.get('property') || undefined,
                    people: formData.get('people') || undefined,
                    business: formData.get('business') || undefined
                }
            }
        };

        // Remove undefined business impact fields
        Object.keys(data.data.business_impact).forEach(key => {
            if (data.data.business_impact[key] === undefined) {
                delete data.data.business_impact[key];
            }
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/vulnerabilities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (response.ok) {
                showMessage('vuln-message', 'Vulnerability added successfully!', 'success');
                this.reset();
                document.getElementById('vuln-standard').disabled = true;
                loadCatalogData(); // Refresh catalog
            } else {
                showMessage('vuln-message', `Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showMessage('vuln-message', `Error: ${error.message}`, 'error');
        }
    });

    // Option form submission
    document.getElementById('option-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            category: formData.get('category'),
            standard: formData.get('standard'),
            data: {
                level: formData.get('level'),
                description: formData.get('description'),
                business_value: formData.get('business_value')
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/options`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (response.ok) {
                showMessage('opt-message', 'Option for consideration added successfully!', 'success');
                this.reset();
                document.getElementById('opt-standard').disabled = true;
                loadCatalogData(); // Refresh catalog
            } else {
                showMessage('opt-message', `Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showMessage('opt-message', `Error: ${error.message}`, 'error');
        }
    });
}

// Show message
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
}
