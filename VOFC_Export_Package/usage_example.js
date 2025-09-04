// VOFC Library Usage Example
// This demonstrates how to use the VOFC library in a JavaScript application

// Load the VOFC library
const vofcLibrary = require('./VOFC_Library.json');

// Example function to get vulnerabilities for a specific field
function getVulnerabilitiesForField(fieldName) {
    const library = vofcLibrary.VOFC_Library;
    
    // Search through all categories
    for (const [categoryKey, category] of Object.entries(library.categories)) {
        for (const [standardKey, standard] of Object.entries(category.standards)) {
            if (standard.field === fieldName) {
                return {
                    category: category.name,
                    standard: standard.name,
                    vulnerabilities: standard.vulnerabilities || [],
                    enhancements: standard.enhancements || [],
                    sustainments: standard.sustainments || []
                };
            }
        }
    }
    return null;
}

// Example function to get all standards for a category
function getStandardsForCategory(categoryName) {
    const library = vofcLibrary.VOFC_Library;
    
    for (const [categoryKey, category] of Object.entries(library.categories)) {
        if (category.name === categoryName) {
            return Object.values(category.standards);
        }
    }
    return [];
}

// Example usage
console.log('VOFC Library Version:', vofcLibrary.VOFC_Library.version);
console.log('Available Categories:', Object.keys(vofcLibrary.VOFC_Library.categories));

// Get vulnerabilities for standoff measures
const standoffVulnerabilities = getVulnerabilitiesForField('has_standoff_measures');
if (standoffVulnerabilities) {
    console.log('Standoff Measures Vulnerabilities:', standoffVulnerabilities.vulnerabilities.length);
}

// Get all physical security standards
const physicalSecurityStandards = getStandardsForCategory('Physical Security');
console.log('Physical Security Standards:', physicalSecurityStandards.length);

// Example: Check for empty field vulnerability
function checkForEmptyFieldVulnerability(fieldName, fieldValue) {
    const fieldData = getVulnerabilitiesForField(fieldName);
    if (!fieldData) return null;
    
    const emptyVulnerability = fieldData.vulnerabilities.find(v => v.condition === 'empty');
    if (emptyVulnerability && (!fieldValue || fieldValue === '')) {
        return {
            type: 'vulnerability',
            issue: emptyVulnerability.issue,
            description: emptyVulnerability.description,
            action: emptyVulnerability.action,
            severity: emptyVulnerability.severity
        };
    }
    return null;
}

// Example: Check for enhancement opportunity
function checkForEnhancementOpportunity(fieldName, fieldValue) {
    const fieldData = getVulnerabilitiesForField(fieldName);
    if (!fieldData) return null;
    
    const enhancement = fieldData.enhancements.find(e => e.condition === 'no');
    if (enhancement && fieldValue === 'No') {
        return {
            type: 'enhancement',
            issue: enhancement.issue,
            description: enhancement.description,
            action: enhancement.action,
            severity: enhancement.severity
        };
    }
    return null;
}

module.exports = {
    getVulnerabilitiesForField,
    getStandardsForCategory,
    checkForEmptyFieldVulnerability,
    checkForEnhancementOpportunity
};
