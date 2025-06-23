'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

type GeneratedTask = string;

type SavedTask = {
  id: string;
  title: string;
  topic: string;
  status: 'completed' | 'incomplete';
};

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [savedTasks, setSavedTasks] = useState<SavedTask[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    fetchSavedTasks();
  }, []);

  const fetchSavedTasks = async () => {
    const res = await axios.get('http://localhost:3001/api/task/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSavedTasks(res.data.tasks);
  };

  const handleGenerate = async () => {
    const res = await axios.post(
      'http://localhost:3001/api/task/generate-tasks',
      { topic },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setGeneratedTasks(res.data.tasks);
  };

  const saveTask = async (task: string) => {
    try {
      const res = await axios.post(
        'http://localhost:3001/api/task/save',
        { topic, title: task },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedTasks((prev) => [...prev, res.data.task]);
    } catch (err: any) {
      alert('Task already saved');
    }
  };

  const toggleComplete = async (id: string, currentStatus: string) => {
    await axios.patch(
      `http://localhost:3001/api/task/${id}`,
      {
        status: currentStatus === 'completed' ? 'incomplete' : 'completed',
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSavedTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'incomplete' : 'completed' } : t
      )
    );
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:3001/api/task/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSavedTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-semibold">AI Task Generator</h1>
      <div className="flex gap-2">
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a topic..." />
        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Generated Tasks</h2>
        {generatedTasks.map((task, index) => (
          <div key={index} className="flex justify-between bg-gray-100 p-2 rounded">
            <span>{task}</span>
            <Button variant="secondary" onClick={() => saveTask(task)}>
              Save
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Saved Tasks</h2>
        {savedTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={() => toggleComplete(task.id, task.status)}
              />
              <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
            </div>
            <Button variant="ghost" onClick={() => deleteTask(task.id)}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
