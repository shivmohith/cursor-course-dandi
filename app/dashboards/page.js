'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabaseClient';

const Notification = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    {message}
    <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

export default function Dashboards() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyLimit, setNewKeyLimit] = useState(1000);
  const [viewingKeyId, setViewingKeyId] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const openModal = () => {
    setNewKeyName('');
    setNewKeyLimit(1000);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    try {
      const newKey = {
        name: newKeyName,
        key: `${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 30)}`,
        usage: 0,
        limit: newKeyLimit,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select();

      if (error) throw error;

      setApiKeys([...apiKeys, data[0]]);
      closeModal();
      showNotification('API Key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      showNotification('Error creating API key: ' + error.message);
    }
  };

  const toggleViewKey = (id) => {
    setViewingKeyId(viewingKeyId === id ? null : id);
  };

  const copyToClipboard = async (key, id) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(id);
      showNotification('Copied API Key to clipboard');
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const startEditing = (key) => {
    setEditingKey({ ...key });
  };

  const cancelEditing = () => {
    setEditingKey(null);
  };

  const saveEdit = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({ name: editingKey.name })
        .eq('id', editingKey.id)
        .select();

      if (error) throw error;

      setApiKeys(apiKeys.map(key => key.id === data[0].id ? data[0] : key));
      setEditingKey(null);
      showNotification('API Key updated successfully');
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const deleteApiKey = async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(apiKeys.filter(key => key.id !== id));
      showNotification('API Key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">CURRENT PLAN</span>
            <button className="bg-white bg-opacity-20 text-white text-sm py-1 px-3 rounded">
              Manage Plan
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-4">Researcher</h1>
          <div>
            <p className="text-sm mb-1">API Limit</p>
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-1">
              <div className="bg-white rounded-full h-2 w-1/3"></div>
            </div>
            <p className="text-sm">333 / 1,000 Requests</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <button
              onClick={openModal}
              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
          </p>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2">NAME</th>
                <th className="pb-2">USAGE</th>
                <th className="pb-2">KEY</th>
                <th className="pb-2">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-t">
                  <td className="py-3">
                    {editingKey && editingKey.id === key.id ? (
                      <input
                        type="text"
                        value={editingKey.name}
                        onChange={(e) => setEditingKey({ ...editingKey, name: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      key.name
                    )}
                  </td>
                  <td className="py-3">
                    <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
                      {key.usage}%
                    </span>
                  </td>
                  <td className="py-3">
                    {viewingKeyId === key.id ? key.key : key.key.replace(/(?<=^.{4}).*/, '********************************')}
                  </td>
                  <td className="py-3">
                    <button onClick={() => toggleViewKey(key.id)} className="text-gray-500 hover:text-gray-700 mr-2">
                      {viewingKeyId === key.id ? (
                        <EyeSlashIcon className="h-5 w-5 inline" />
                      ) : (
                        <EyeIcon className="h-5 w-5 inline" />
                      )}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(key.key, key.id)} 
                      className="text-gray-500 hover:text-gray-700 mr-2 relative"
                    >
                      <ClipboardDocumentIcon className="h-5 w-5 inline" />
                      {copiedKeyId === key.id && (
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2">
                          Copied!
                        </span>
                      )}
                    </button>
                    {editingKey && editingKey.id === key.id ? (
                      <>
                        <button onClick={saveEdit} className="text-green-500 hover:text-green-700 mr-2">
                          Save
                        </button>
                        <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700 mr-2">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => startEditing(key)} className="text-gray-500 hover:text-gray-700 mr-2">
                        <PencilSquareIcon className="h-5 w-5 inline" />
                      </button>
                    )}
                    <button onClick={() => deleteApiKey(key.id)} className="text-gray-500 hover:text-red-600">
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create a new API key</h2>
            <form onSubmit={createApiKey}>
              <div className="mb-4">
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name — A unique name to identify this key
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="keyLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Usage Limit
                </label>
                <input
                  type="number"
                  id="keyLimit"
                  value={newKeyLimit}
                  onChange={(e) => setNewKeyLimit(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
