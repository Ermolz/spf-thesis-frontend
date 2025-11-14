import { SpinnerIcon } from '@shared/ui/icons';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <SpinnerIcon className="animate-spin h-12 w-12 text-primary" />
        <p className="text-text-muted">Loading...</p>
      </div>
    </div>
  );
};

