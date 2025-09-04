import React, { useState, useEffect } from 'react';
import VulnerabilityCatalog from './components/VulnerabilityCatalog';
import AddVulnerabilityForm from './components/AddVulnerabilityForm';
import AddOptionForm from './components/AddOptionForm';

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [vulnerabilityData, setVulnerabilityData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vulnResponse, categoriesResponse] = await Promise.all([
        fetch('/api/vulnerabilities'),
        fetch('/api/categories')
      ]);

      if (vulnResponse.ok && categoriesResponse.ok) {
        const vulnData = await vulnResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setVulnerabilityData(vulnData);
        setCategories(categoriesData);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVulnerabilityAdded = () => {
    fetchData(); // Refresh data after adding
  };

  const handleOptionAdded = () => {
    fetchData(); // Refresh data after adding
  };

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>VOFC - Vulnerability Catalog</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>VOFC - Vulnerability Catalog</h1>
        <p>Comprehensive Vulnerability, Options for Consideration, and Sustainment Library</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          View Catalog
        </button>
        <button 
          className={`tab ${activeTab === 'add-vulnerability' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-vulnerability')}
        >
          Add Vulnerability
        </button>
        <button 
          className={`tab ${activeTab === 'add-option' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-option')}
        >
          Add Option for Consideration
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'catalog' && (
          <div className={`tab-content ${activeTab === 'catalog' ? 'active' : ''}`}>
            <VulnerabilityCatalog data={vulnerabilityData} />
          </div>
        )}

        {activeTab === 'add-vulnerability' && (
          <div className={`tab-content ${activeTab === 'add-vulnerability' ? 'active' : ''}`}>
            <AddVulnerabilityForm 
              categories={categories} 
              onVulnerabilityAdded={handleVulnerabilityAdded}
            />
          </div>
        )}

        {activeTab === 'add-option' && (
          <div className={`tab-content ${activeTab === 'add-option' ? 'active' : ''}`}>
            <AddOptionForm 
              categories={categories} 
              onOptionAdded={handleOptionAdded}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
