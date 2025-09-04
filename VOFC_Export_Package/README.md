# VOFC Library Export Package

## Overview
This package contains the Vulnerability, Options for Consideration, and Sustainment (VOFC) library from the HOST V1 (Hotel Operations Security Tool) system.

## Files Included

### VOFC_Library.json
- **Purpose**: Comprehensive VOFC library with vulnerabilities, enhancements, and sustainments
- **Structure**: Organized by security categories and standards
- **Usage**: Import into other security assessment tools or systems

### INDUSTRY_STANDARDS_REFERENCE.json
- **Purpose**: Industry standards reference data
- **Structure**: Standards mapping and reference information
- **Usage**: Cross-reference with VOFC library for standards compliance

## VOFC Library Structure

```json
{
  "VOFC_Library": {
    "version": "1.0",
    "description": "Comprehensive Vulnerability, Options for Consideration, and Sustainment library",
    "categories": {
      "physical_security": {
        "name": "Physical Security",
        "standards": {
          "standoff_measures": {
            "name": "Standoff Measures Status",
            "field": "has_standoff_measures",
            "vulnerabilities": [...],
            "enhancements": [...],
            "sustainments": [...]
          }
        }
      }
    }
  }
}
```

## Categories Included
- Physical Security
- Security Force
- Video Surveillance Systems
- Access Control
- Emergency Planning
- Elevator Security
- Stairwell Security
- Exterior Door Security
- Parking Security
- Infrastructure Resilience

## Usage Examples

### JavaScript/Node.js
```javascript
const vofcLibrary = require('./VOFC_Library.json');
const physicalSecurity = vofcLibrary.VOFC_Library.categories.physical_security;
```

### Python
```python
import json
with open('VOFC_Library.json', 'r') as f:
    vofc_library = json.load(f)
    physical_security = vofc_library['VOFC_Library']['categories']['physical_security']
```

### Web Application
```javascript
fetch('./VOFC_Library.json')
  .then(response => response.json())
  .then(data => {
    const vofcLibrary = data.VOFC_Library;
    // Use the library data
  });
```

## Standards Compliance
- Based on SAFE V2.2 standards
- DHS CISA Region IV guidelines
- Industry best practices for hotel security

## Version Information
- **Library Version**: 1.0
- **Export Date**: $(Get-Date -Format 'yyyy-MM-dd')
- **Source**: HOST V1 - Hotel Operations Security Tool

## Support
This VOFC library is designed for integration with security assessment tools and systems. For questions about implementation or usage, refer to the HOST V1 documentation.

---
*HOST V1 - Hotel Operations Security Tool*
*DHS CISA Region IV Assessment Tool*
