'use client';

import React, { useState } from 'react';
import axios from 'axios';

// Define the shape of a task object returned from your backend
type Task = {
  id: string;
  userId: string;
  title: string;
  topic: string;
  status: string;
  createdAt: string;
};

const Page = () => {
  const [topic, setTopic] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTasks = async () => {
    setLoading(true);
    setError('');
    setTasks([]);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No auth token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/task/generate-tasks',
        { topic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setTasks(response.data.tasks); // Must be an array of Task objects
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
      <h1 className="text-2xl font-bold">Home - Task Generator</h1>

      <input
        type="text"
        placeholder="Enter a topic (e.g. Learn TypeScript)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />

      <button
        onClick={generateTasks}
        disabled={!topic || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Generating...' : 'Generate Tasks'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {tasks.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
