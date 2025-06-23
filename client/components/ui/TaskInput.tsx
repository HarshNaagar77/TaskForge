'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
  onGenerate: (topic: string) => void;
  loading: boolean;
}

export default function TaskInput({ onGenerate, loading }: Props) {
  const [topic, setTopic] = useState('');

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Enter a topic (e.g. Learn TypeScript)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <Button disabled={!topic || loading} onClick={() => onGenerate(topic)}>
        {loading ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
}
