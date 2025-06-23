'use client';

type ProgressBarProps = {
  tasks: { status: string }[];
};

export default function ProgressBar({ tasks }: ProgressBarProps) {
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;

  return (
    <div className="mt-4">
      <p className="text-sm text-muted-foreground">Progress: {completed}/{tasks.length}</p>
      <div className="w-full h-2 bg-gray-200 rounded mt-1">
        <div
          className="h-full bg-green-500 rounded"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
