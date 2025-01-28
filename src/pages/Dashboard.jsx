import React, { useState, useEffect } from 'react';
import {
  Plus,
  Key,
  Copy,
  Edit,
  Trash2,
  Search,
  Lock,
  User,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { dashboardApi, addEntry } from '../services/authService';

const PasswordManagerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // First useEffect for initial data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const identifier = sessionStorage.getItem('identifier');
        const username = sessionStorage.getItem('username');

        if (!token || !identifier || !username) {
          console.error("Missing data in session storage. Redirecting to login.");
          navigate('/');
          return;
        }

        const res = await dashboardApi(username, identifier, token);
        if (res && res.oBody && res.oBody.payLoad) {
          setDashboardData(res.oBody.payLoad);
        } else if (res && res.aError && res.aError.length > 0) {
          const error = res.aError[0];
          setErrorMessage(error?.sMessage || "An unexpected error occurred. Please try again.");
          setTimeout(() => setErrorMessage(''), 5000);
        } else {
          setErrorMessage("An unexpected error occurred. Please contact system administrator.");
          setTimeout(() => setErrorMessage(''), 5000);
        }
      } catch (err) {
        setError(err.message);
        console.error('Dashboard API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Filter entries based on search
  const filteredEntries = dashboardData?.aCredsList?.filter(entry =>
    entry.sService.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.sUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.sEmail.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCopyPassword = (entry) => {
    navigator.clipboard.writeText(entry.sPassword);
    setCopiedPassword(entry.sUserName);
    setTimeout(() => setCopiedPassword(null), 2000);
  };

  const handleDeleteEntry = (username) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (confirmDelete) {
      // Implement delete API call here
      console.log('Delete entry:', username);
    }
  };

  const handleAddEntry = async (data) => {
    try {
      setLoading(true);
      const res = await addEntry(data);
      
      if (res && res.oBody && res.oBody.payLoad) {
        setDashboardData(res.oBody.payLoad);
        setIsAddModalOpen(false);
        setSuccessMessage('Entry added successfully');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else if (res && res.aError && res.aError.length > 0) {
        const error = res.aError[0];
        setErrorMessage(error?.sMessage || "An unexpected error occurred. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please contact system administrator.");
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      setErrorMessage('Failed to add entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAddEditModal = (mode) => {
    const entry = mode === 'edit' ? selectedEntry : {};
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {mode === 'add' ? 'Add New Entry' : 'Edit Entry'}
          </h2>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Transform form data to match API structure
            const apiData = {
              sService: data.name,
              sUserName: data.username,
              sEmail: data.email,
              sPassword: data.password,
              sUrl: data.url
            };
            
            mode === 'add' ? handleAddEntry(apiData) : handleUpdateEntry(apiData);
          }}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                defaultValue={entry.sService || ''}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                defaultValue={entry.sUserName || ''}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={entry.sEmail || ''}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                defaultValue={entry.sPassword || ''}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="url"
                name="url"
                placeholder="Website URL"
                defaultValue={entry.sUrl || ''}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => mode === 'add' ? setIsAddModalOpen(false) : setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-white rounded-lg ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading
                  ? mode === 'add'
                    ? 'Adding...'
                    : 'Updating...'
                  : mode === 'add'
                    ? 'Add'
                    : 'Update'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Key className="text-blue-600 h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-800">Password Manager</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Entry
          </button>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6 space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Password</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => (
                  <tr key={entry.sUserName} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center space-x-2">
                      <Globe className="text-gray-400" />
                      <span>{entry.sService}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <User className="text-gray-400" />
                        {entry.sUserName}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <User className="text-gray-400" />
                        {entry.sEmail}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Lock className="text-gray-400" />
                        {copiedPassword === entry.sUserName ? 'Copied!' : '•••••••••'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCopyPassword(entry)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEntry(entry);
                            setIsEditModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.sUserName)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      {isAddModalOpen && renderAddEditModal('add')}
      {isEditModalOpen && renderAddEditModal('edit')}
    </div>
  );
};

export default PasswordManagerDashboard;