import { colorPalettes } from './colors';

const applyTheme = (theme = 'dark') => {
  const colors = colorPalettes[theme] || colorPalettes.dark;
  const root = document.documentElement;

  root.style.setProperty('--bg-body', colors.bg.body);
  root.style.setProperty('--bg-elevated', colors.bg.elevated);
  root.style.setProperty('--bg-card', colors.bg.card);
  root.style.setProperty('--bg-card-hover', colors.bg.cardHover);

  root.style.setProperty('--primary', colors.primary.DEFAULT);
  root.style.setProperty('--primary-soft', colors.primary.soft);
  root.style.setProperty('--primary-subtle', colors.primary.subtle);

  root.style.setProperty('--accent', colors.accent.DEFAULT);
  root.style.setProperty('--accent-soft', colors.accent.soft);

  root.style.setProperty('--success', colors.success.DEFAULT);
  root.style.setProperty('--success-soft', colors.success.soft);

  root.style.setProperty('--warning', colors.warning.DEFAULT);
  root.style.setProperty('--warning-soft', colors.warning.soft);

  root.style.setProperty('--text-main', colors.text.main);
  root.style.setProperty('--text-muted', colors.text.muted);
  root.style.setProperty('--text-soft', colors.text.soft);
  root.style.setProperty('--text-on-primary', colors.text.onPrimary);

  root.style.setProperty('--border-subtle', colors.border.subtle);
  root.style.setProperty('--border-strong', colors.border.strong);

  root.style.setProperty('--shadow-soft', colors.shadow.soft);

  root.style.setProperty('--gradient-header', colors.gradient.header);
  root.style.setProperty('--gradient-primary', colors.gradient.primary);

  root.style.setProperty('--radius-lg', '18px');
  root.style.setProperty('--radius-pill', '999px');
};

export const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  return savedTheme;
};

export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

export default { initTheme, setTheme, applyTheme };

