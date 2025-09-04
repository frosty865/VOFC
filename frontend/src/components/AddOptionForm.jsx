import React, { useState, useEffect } from 'react';

const AddOptionForm = ({ categories, onOptionAdded }) => {
  const [formData, setFormData] = useState({
    category: '',
    standard: '',
    level: 'Low-Cost',
    description: '',
    business_value: ''
  });
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (formData.category) {
      fetchStandards(formData.category);
    } else {
      setStandards([]);
    }
  }, [formData.category]);

  const fetchStandards = async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/standards`);
      if (response.ok) {
        const data = await response.json();
        setStandards(data);
      }
    } catch (error) {
      console.error('Error fetching standards:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submissionData = {
        category: formData.category,
        standard: formData.standard,
        data: {
          level: formData.level,
          description: formData.description,
          business_value: formData.business_value
        }
      };

      const response = await fetch('/api/options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setMessage('Option for consideration added successfully!');
        setFormData({
          category: '',
          standard: '',
          level: 'Low-Cost',
          description: '',
          business_value: ''
        });
        setStandards([]);
        onOptionAdded();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New Option for Consideration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="standard">Standard:</label>
          <select
            id="standard"
            name="standard"
            value={formData.standard}
            onChange={handleInputChange}
            required
            disabled={!formData.category}
          >
            <option value="">Select a standard...</option>
            {standards.map(std => (
              <option key={std.id} value={std.id}>{std.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            required
          >
            <option value="Low-Cost">Low-Cost</option>
            <option value="Mid-Range">Mid-Range</option>
            <option value="High-End">High-End</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Description of the option for consideration"
          />
        </div>

        <div className="form-group">
          <label htmlFor="business_value">Business Value:</label>
          <textarea
            id="business_value"
            name="business_value"
            value={formData.business_value}
            onChange={handleInputChange}
            required
            placeholder="Business value and benefits of this option"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Option for Consideration'}
        </button>

        {message && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8', border: '1px solid #ccc', borderRadius: '4px' }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddOptionForm;
