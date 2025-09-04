# VOFC - Vulnerability Catalog

A comprehensive tool for cataloging and managing vulnerabilities, options for consideration, and sources for security assessments.

## 🎯 **Two Deployment Options:**

### **1. Standalone Air-Gapped Version (Recommended for Field Use)**
- **`VOFC_Standalone.html`** - Complete offline tool with embedded data
- **No internet required** - Works completely offline
- **Perfect for field users** - Copy to any device and use immediately
- **Air-gapped security** - No network dependencies

### **2. Web Server Version (For Development/Testing)**
- **Backend + Frontend** - Full web application with API
- **Requires Node.js** - For development and testing
- **Network accessible** - Can be deployed to servers

## Features

- **View Catalog**: Browse existing vulnerabilities, enhancements, sustainments, and options for consideration
- **Add Vulnerabilities**: Add new vulnerabilities, enhancements, or sustainments to the catalog
- **Add Options**: Add new options for consideration with different cost levels
- **Category Management**: Organize data by security categories and standards
- **Business Impact Tracking**: Include business impact assessments for vulnerabilities
- **Export/Import**: Backup and share catalog data as JSON files

## Project Structure

```
VOFC/
├── backend/                 # Node.js Express server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # Backend dependencies
├── frontend/               # Web interface
│   ├── index.html          # Main HTML file
│   ├── app.js             # JavaScript application
│   └── package.json        # Frontend dependencies (if using React)
├── VOFC_Export_Package/    # Data files
│   ├── VOFC_Library.json   # Main vulnerability data
│   └── INDUSTRY_STANDARDS_REFERENCE.json # Standards reference
└── README.md              # This file
```

## 🚀 **Quick Start (Recommended)**

### **For Field Users - Standalone Version:**

1. **Download `VOFC_Standalone.html`**
2. **Open in any web browser** (Chrome, Firefox, Safari, Edge)
3. **Start cataloging immediately** - no setup required!

**That's it!** The standalone version works completely offline with all your data embedded.

### **For Developers - Web Server Version:**

#### Prerequisites
- Node.js (v14 or higher)
- A modern web browser

#### Installation
1. **Clone or download the project**
2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001

4. **Open the frontend:**
   - Navigate to the `frontend` folder
   - Open `index.html` in your web browser

### Alternative: Using a Local Web Server

If you prefer to serve the frontend through a web server:

```bash
# Using Python (if installed)
cd frontend
python -m http.server 8000

# Using Node.js http-server (if installed globally)
cd frontend
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.

## Usage

### Viewing the Catalog

1. Click on the "View Catalog" tab
2. Select a category from the dropdown (e.g., Physical Security, Video Surveillance)
3. Select a standard within that category
4. View vulnerabilities, enhancements, sustainments, and options for consideration

### Adding New Vulnerabilities

1. Click on the "Add Vulnerability" tab
2. Fill in the required fields:
   - **Category**: Select the security category
   - **Standard**: Select the specific standard
   - **Type**: Choose between Vulnerability, Enhancement, or Sustainment
   - **Condition**: The condition that triggers this item
   - **Issue**: Brief description of the issue
   - **Description**: Detailed description
   - **Action**: Recommended action
   - **Severity**: High, Medium, Low, or Positive
   - **Standards**: Comma-separated list of applicable standards
3. Optionally fill in business impact fields
4. Click "Add Vulnerability"

### Adding Options for Consideration

1. Click on the "Add Option for Consideration" tab
2. Fill in the required fields:
   - **Category**: Select the security category
   - **Standard**: Select the specific standard
   - **Level**: Low-Cost, Mid-Range, or High-End
   - **Description**: Description of the option
   - **Business Value**: Business value and benefits
3. Click "Add Option for Consideration"

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/vulnerabilities` - Get all vulnerability data
- `GET /api/standards` - Get industry standards reference
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id/standards` - Get standards for a category
- `POST /api/vulnerabilities` - Add new vulnerability/enhancement/sustainment
- `POST /api/options` - Add new option for consideration

## Data Structure

The application works with your existing JSON data structure:

- **Categories**: Top-level security categories (Physical Security, Video Surveillance, etc.)
- **Standards**: Specific standards within each category
- **Vulnerabilities**: Security issues that need attention
- **Enhancements**: Improvements that can be made
- **Sustainments**: Positive practices to maintain
- **Options for Consideration**: Different cost-level solutions

## Troubleshooting

### Backend Issues

- Ensure Node.js is installed and accessible
- Check that port 3001 is not in use by another application
- Verify that the JSON data files exist in the correct location

### Frontend Issues

- Ensure the backend server is running
- Check browser console for JavaScript errors
- Verify that the frontend can reach the backend API

### Data Issues

- Ensure JSON files are valid and properly formatted
- Check file permissions for read/write access
- Verify that the data structure matches the expected format

## Contributing

To add new features or fix issues:

1. Make changes to the appropriate files
2. Test thoroughly with your data
3. Update this README if needed

## License

This project is part of the VOFC (Vulnerability, Options for Consideration, and Sources) system for security assessments.
