'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type SavedTask = {
  id: string;
  title: string;
  topic: string;
  status: 'completed' | 'incomplete';
};

type TaskListProps = {
  generated?: string[];
  saved?: SavedTask[];
  onSave?: (task: string) => void;
  onToggle?: (id: string, currentStatus: string) => void;
};

export default function TaskList({ generated, saved, onSave, onToggle }: TaskListProps) {
  return (
    <div className="space-y-4">
      {generated && generated.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-2">Generated Tasks</h3>
          {generated.map((task, i) => (
            <div key={i} className="flex justify-between bg-muted px-3 py-2 rounded">
              <span>{task}</span>
              <Button variant="secondary" onClick={() => onSave?.(task)}>
                Save
              </Button>
            </div>
          ))}
        </div>
      )}

      {saved && saved.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-2">Saved Tasks</h3>
          {saved.map((task) => (
            <div key={task.id} className="flex items-center gap-3 bg-muted px-3 py-2 rounded">
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={() => onToggle?.(task.id, task.status)}
              />
              <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
