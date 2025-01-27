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
import { dashboardApi } from '../services/authService';


// Mock data - replace with actual API calls
const mockPasswordEntries = [
  {
    id: 1,
    name: 'Gmail',
    username: 'johndoe',
    email: 'johndoe@gmail.com',
    password: 'complexPassword123!',
    url: 'https://gmail.com'
  },
  {
    id: 2,
    name: 'GitHub',
    username: 'johndoe',
    email: 'johndoe@gmail.com',
    password: 'secureDevPass456@',
    url: 'https://github.com'
  }
];


const PasswordManagerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [passwordEntries, setPasswordEntries] = useState(mockPasswordEntries);
  const [filteredEntries, setFilteredEntries] = useState(mockPasswordEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // For showing error messages
  const [successMessage, setSuccessMessage] = useState(''); // For showing success messages


  // First useEffect for initial data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const identifier = sessionStorage.getItem('identifier');
        const username = sessionStorage.getItem('username');

        if (!token || !identifier || !username) {
          // Handle missing data, maybe redirect to login
          console.error("Missing data in session storage. Redirecting to login.");
          navigate('/'); // Or wherever your login route is
          return; // Important: Stop execution here
        }


        const res = await dashboardApi(username, identifier, token);
        console.log(res)
        if (res && res.oBody && res.oBody.payLoad) {
          setDashboardData(res.oBody.payLoad)
        } else if (res && res.aError && res.aError.length > 0) {
          const error = res.aError[0];
          if (error) {
            setErrorMessage(error.sMessage);
            setLoading(false);
          } else {
            setErrorMessage("An unexpected error occurred. Please try again.");
            setLoading(false);
          }
        } else {
          setErrorMessage("An unexpected error occurred. Please contact system administrator.");
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        console.error('Dashboard API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); // Runs once on mount

  // Effect to filter entries based on search
  useEffect(() => {
    const filtered = passwordEntries.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [searchTerm, passwordEntries]);

  const handleCopyPassword = (entry) => {
    navigator.clipboard.writeText(entry.password);
    setCopiedPassword(entry.id);
    setTimeout(() => setCopiedPassword(null), 2000);
  };

  const handleDeleteEntry = (entryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (confirmDelete) {
      setPasswordEntries(entries => entries.filter(entry => entry.id !== entryId));
    }
  };

  const handleAddEntry = (newEntry) => {
    const entry = {
      ...newEntry,
      id: passwordEntries.length + 1
    };
    setPasswordEntries(prev => [...prev, entry]);
    setIsAddModalOpen(false);
  };

  const handleUpdateEntry = (updatedEntry) => {
    setPasswordEntries(prev =>
      prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
    );
    setIsEditModalOpen(false);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  const renderAddEditModal = (mode) => {
    const entry = mode === 'edit' ? selectedEntry : {};
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {mode === 'add' ? 'Add New Entry' : 'Edit Entry'}
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            mode === 'add' ? handleAddEntry(data) : handleUpdateEntry({ ...data, id: entry.id });
          }}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                defaultValue={entry.name || ''}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                defaultValue={entry.username || ''}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={entry.email || ''}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                defaultValue={entry.password || ''}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="url"
                name="url"
                placeholder="Website URL"
                defaultValue={entry.url || ''}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {mode === 'add' ? 'Add' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center space-x-2">
                      <Globe className="text-gray-400" />
                      <span>{entry.name}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <User className="text-gray-400" />
                        {entry.username}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <User className="text-gray-400" />
                        {entry.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Lock className="text-gray-400" />
                        {copiedPassword === entry.id ? 'Copied!' : '•••••••••'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEntry(entry);
                            handleCopyPassword(entry);
                          }}
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
                          onClick={() => handleDeleteEntry(entry.id)}
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