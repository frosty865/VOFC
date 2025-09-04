const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the JSON files
const VOFC_LIBRARY_PATH = path.join(__dirname, '../VOFC_Export_Package/VOFC_Library.json');
const INDUSTRY_STANDARDS_PATH = path.join(__dirname, '../VOFC_Export_Package/INDUSTRY_STANDARDS_REFERENCE.json');

// Helper function to read JSON files
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

// API Routes

// Get all vulnerability data
app.get('/api/vulnerabilities', (req, res) => {
  const data = readJsonFile(VOFC_LIBRARY_PATH);
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to read vulnerability data' });
  }
});

// Get industry standards reference
app.get('/api/standards', (req, res) => {
  const data = readJsonFile(INDUSTRY_STANDARDS_PATH);
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to read standards data' });
  }
});

// Add new vulnerability
app.post('/api/vulnerabilities', (req, res) => {
  const { category, standard, type, data: newEntry } = req.body;
  
  if (!category || !standard || !type || !newEntry) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const libraryData = readJsonFile(VOFC_LIBRARY_PATH);
  if (!libraryData) {
    return res.status(500).json({ error: 'Failed to read library data' });
  }

  // Navigate to the correct location in the data structure
  if (libraryData.VOFC_Library.categories[category] && 
      libraryData.VOFC_Library.categories[category].standards[standard]) {
    
    const targetArray = libraryData.VOFC_Library.categories[category].standards[standard][type];
    if (targetArray) {
      targetArray.push(newEntry);
      
      if (writeJsonFile(VOFC_LIBRARY_PATH, libraryData)) {
        res.json({ message: 'Vulnerability added successfully', data: newEntry });
      } else {
        res.status(500).json({ error: 'Failed to save vulnerability' });
      }
    } else {
      res.status(400).json({ error: 'Invalid type specified' });
    }
  } else {
    res.status(400).json({ error: 'Invalid category or standard specified' });
  }
});

// Add new option for consideration
app.post('/api/options', (req, res) => {
  const { category, standard, data: newOption } = req.body;
  
  if (!category || !standard || !newOption) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const libraryData = readJsonFile(VOFC_LIBRARY_PATH);
  if (!libraryData) {
    return res.status(500).json({ error: 'Failed to read library data' });
  }

  // Navigate to the correct location in the data structure
  if (libraryData.VOFC_Library.categories[category] && 
      libraryData.VOFC_Library.categories[category].standards[standard]) {
    
    if (!libraryData.VOFC_Library.categories[category].standards[standard].options_for_consideration) {
      libraryData.VOFC_Library.categories[category].standards[standard].options_for_consideration = [];
    }
    
    libraryData.VOFC_Library.categories[category].standards[standard].options_for_consideration.push(newOption);
    
    if (writeJsonFile(VOFC_LIBRARY_PATH, libraryData)) {
      res.json({ message: 'Option added successfully', data: newOption });
    } else {
      res.status(500).json({ error: 'Failed to save option' });
    }
  } else {
    res.status(400).json({ error: 'Invalid category or standard specified' });
  }
});

// Get categories and standards for dropdowns
app.get('/api/categories', (req, res) => {
  const data = readJsonFile(VOFC_LIBRARY_PATH);
  if (data && data.VOFC_Library.categories) {
    const categories = Object.keys(data.VOFC_Library.categories).map(key => ({
      id: key,
      name: data.VOFC_Library.categories[key].name
    }));
    res.json(categories);
  } else {
    res.status(500).json({ error: 'Failed to read categories' });
  }
});

// Get standards for a specific category
app.get('/api/categories/:categoryId/standards', (req, res) => {
  const { categoryId } = req.params;
  const data = readJsonFile(VOFC_LIBRARY_PATH);
  
  if (data && data.VOFC_Library.categories[categoryId]) {
    const standards = Object.keys(data.VOFC_Library.categories[categoryId].standards).map(key => ({
      id: key,
      name: data.VOFC_Library.categories[categoryId].standards[key].name
    }));
    res.json(standards);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is accessible on your network at:`);
  console.log(`  http://10.0.0.99:${PORT}`);
  console.log(`  http://10.0.0.52:${PORT}`);
});
