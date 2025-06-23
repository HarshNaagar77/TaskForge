'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/ProgressBar';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const freshToken = await getIdToken(user, true);
          localStorage.setItem('token', freshToken);
          setToken(freshToken);
          fetchSavedTasks(freshToken);
        } catch {
          await auth.signOut();
          localStorage.removeItem('token');
          router.push('/components/login');
        }
      } else {
        localStorage.removeItem('token');
        router.push('/components/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSavedTasks = async (freshToken: string) => {
    const res = await axios.get('http://localhost:3001/api/task/my', {
      headers: { Authorization: `Bearer ${freshToken}` },
    });
    setSavedTasks(res.data.tasks);
  };

  const handleGenerate = async () => {
    if (!token) return;
    const res = await axios.post(
      'http://localhost:3001/api/task/generate-tasks',
      { topic },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setGeneratedTasks(res.data.tasks);
  };

  const saveTask = async (task: string) => {
    if (!token) return;
    try {
      const res = await axios.post(
        'http://localhost:3001/api/task/save',
        { topic, title: task },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedTasks((prev) => [...prev, res.data.task]);
    } catch {
      alert('Task already saved');
    }
  };

  const toggleComplete = async (id: string, currentStatus: string) => {
    if (!token) return;
    await axios.patch(
      `http://localhost:3001/api/task/${id}`,
      { status: currentStatus === 'completed' ? 'incomplete' : 'completed' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSavedTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'incomplete' : 'completed' } : t
      )
    );
  };

  const deleteTask = async (id: string) => {
    if (!token) return;
    await axios.delete(`http://localhost:3001/api/task/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSavedTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const totalTasks = savedTasks.length;
  const completedTasks = savedTasks.filter((task) => task.status === 'completed').length;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen md:flex text-white">
      {/* Left Side - Gradient background */}
      <div className="w-full md:w-1/2 p-6 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 space-y-4 h-[95vh] md:h-full">
          <h1 className="text-5xl font-bold archivo">TASK<br /><span>FORGE.</span></h1>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Learn TypeScript"
            rows={3}
            className="w-full resize-none bg-white/10 text-white placeholder:text-white/60 border border-white/30 rounded-md px-3 py-3 focus:outline-none"
          />

          <Button
            onClick={handleGenerate}
            className="bg-white/20 text-white hover:bg-white/30 backdrop-blur w-full"
          >
            Generate
          </Button>

          <div className="space-y-3">
            {generatedTasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm"
              >
                <span className="pr-3">{task}</span>
                <Button className=" bg-white/20 text-white hover:bg-white/30 backdrop-blur" size="sm" onClick={() => saveTask(task)}>
                  Save
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Saved Tasks */}
      <div className="w-full md:w-1/2 p-6 bg-black relative">
        <Button
          onClick={async () => {
            await auth.signOut();
            localStorage.removeItem('token');
            router.push('/components/login');
          }}
          className="absolute top-12 right-12 z-50 bg-white/20 text-white hover:bg-white/30 backdrop-blur"
        >
          Logout
        </Button>

        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 space-y-4 h-[95vh] md:h-full">
          <h2 className="text-3xl font-bold archivo">Saved Tasks.</h2>

          {/* Progress Visualization */}
          <div className="mb-4 space-y-2">
            <p className="text-sm text-white/80">Progress: {completionPercentage}%</p>
            <Progress value={completionPercentage} className="h-3 bg-white/10" />
          </div>

          {savedTasks.length === 0 ? (
            <p className="text-white/50">No tasks saved yet.</p>
          ) : (
            savedTasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleComplete(task.id, task.status)}
                  />
                  <span className={task.status === 'completed' ? 'line-through text-white/50' : ''}>
                    {task.title}
                  </span>
                </div>
                <Button variant="ghost" onClick={() => deleteTask(task.id)} className="hover:bg-white/10">
                  <Trash2 className="text-red-400" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
