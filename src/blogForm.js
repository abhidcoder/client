import React, { useState, useEffect } from 'react';
import config from './config.json';
import './UserForm.css';

function BlogForm() {
  const serverUrl = config.serverUrl;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    about: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = JSON.stringify(formData);

    try {
      const requestBody = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formDatas,
      };

      const response = await fetch(serverUrl + '/', requestBody);

      if (response.ok) {
        console.log('Post added successfully');
        window.alert('Post added successfully');
        // Clear the form fields after successful submission
        setFormData({ name: '', title: '', about: '' });
        window.location.reload()
      } else {
        console.error('Post failed');
        window.alert('Post could not be added');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      window.alert('Internal Server error please Contact Admin');
    }
  };

  const [apiDatass, setApiDatas] = useState([]);

  useEffect(() => {
    const makeAPICall = async () => {
      try {
        const response = await fetch(serverUrl + '/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const responseData = await response.json();
          setApiDatas(responseData); // Update the state with the parsed data
          console.log('Fetch was success');
        } else {
          console.error('Fetch was failed');
          window.alert('Fetch was Failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        window.alert('Internal Server error please Contact Admin');
      }
    };

    makeAPICall();
  }, []); // Empty dependency array, so it runs once when the component mounts

  const handleDelete = async (index) => {
    try {
      const itemToDelete = apiDatass[index];
      const response = await fetch(itemToDelete.url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log('Item deleted successfully');
        // Remove the deleted item from the state
        setApiDatas((prevData) => prevData.filter((item, i) => i !== index));
      } else {
        console.error('Delete failed');
        window.alert('Delete could not be completed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      window.alert('Internal Server error please Contact Admin');
    }
  };

  const [editIndex, setEditIndex] = useState(-1);
  const [editedData, setEditedData] = useState({ name: '', title: '', about: '' });


  const handleEdit = (index) => {
    setEditIndex(index);
    // Set the initial data for editing
    setEditedData(apiDatass[index]);
  };

  const handleUpdate = async (index) => {
    try {
      const updatedItem = editedData;
      const response = await fetch(apiDatass[index].url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
  
      if (response.ok) {
        console.log('Item updated successfully');
        // Update the item in the state
        const updatedData = [...apiDatass];
        updatedData[index] = updatedItem;
        setApiDatas(updatedData);
        // Reset the edit mode
        setEditIndex(-1);
      } else {
        console.error('Update failed');
        window.alert('Update could not be completed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      window.alert('Internal Server error please Contact Admin');
    }
  };
  
  

  return (
    <>
      <h1 className="heading">ADD Blog</h1>
      <p className="notice">* Name and title Required fields</p>
      <div className="user-form">
        <form onSubmit={handleSubmit}>
          <label style={{ color: 'red' }}>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              required={true}
              onChange={handleInputChange}
            />
          </label>
          <label style={{ color: 'red' }}>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              required={true}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Content:
            <input
              type="text"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
            />
          </label>
          <br></br>
          <button className="dbutton" type="submit">
            Submit
          </button>
        </form>

        <br></br>
      </div>

      {apiDatass.length > 0 ? (
  <div>
    <h2>Data:</h2>
    <ul className="data-list">
      {apiDatass.map((item, index) => (
        <li className="data-item" key={index}>
          {editIndex === index ? (
            <div>
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={(e) =>
                  setEditedData({ ...editedData, name: e.target.value })
                }
              />
              <input
                type="text"
                name="title"
                value={editedData.title}
                onChange={(e) =>
                  setEditedData({ ...editedData, title: e.target.value })
                }
              />
              <input
                type="text"
                name="about"
                value={editedData.about}
                onChange={(e) =>
                  setEditedData({ ...editedData, about: e.target.value })
                }
              />
              <button onClick={() => handleUpdate(index)}>Update</button>
            </div>
          ) : (
            <div>
              <strong>Name:</strong> {item.name}
              <br />
              <strong>Title:</strong> {item.title}
              <br />
              <strong>About:</strong> {item.about}
              <br />
              <strong>Added Date:</strong> {item.added_date}
              <br />
              <button className="edit-button" onClick={() => handleEdit(index)}>
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
) : (
  <p>No data available or loading...</p>
)}

    </>
  );
}

export default BlogForm;
