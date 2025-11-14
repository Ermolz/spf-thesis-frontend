import { ToastProvider } from '@shared/ui/Toast';

export const AppProviders = ({ children }) => {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
};

