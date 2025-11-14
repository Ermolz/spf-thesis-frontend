export const colorPalettes = {
  dark: {
    bg: {
      body: '#050814',
      elevated: '#0B1020',
      card: '#0F172A',
      cardHover: '#111827',
    },
    primary: {
      DEFAULT: '#3B82F6',
      soft: '#1D4ED8',
      subtle: '#1E293B',
    },
    accent: {
      DEFAULT: '#8B5CF6',
      soft: '#4C1D95',
    },
    success: {
      DEFAULT: '#22C55E',
      soft: 'rgba(34, 197, 94, 0.12)',
    },
    warning: {
      DEFAULT: '#FACC15',
      soft: 'rgba(250, 204, 21, 0.12)',
    },
    text: {
      main: '#E5E7EB',
      muted: '#9CA3AF',
      soft: '#6B7280',
      onPrimary: '#FFFFFF',
    },
    border: {
      subtle: '#1F2937',
      strong: '#374151',
    },
    shadow: {
      soft: '0 18px 40px rgba(15, 23, 42, 0.9)',
    },
    gradient: {
      header: 'linear-gradient(90deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)',
      primary: 'linear-gradient(135deg, #2563EB 0%, #6366F1 40%, #8B5CF6 100%)',
    },
  },
  light: {
    bg: {
      body: '#F9FAFB',
      elevated: '#FFFFFF',
      card: '#FFFFFF',
      cardHover: '#F3F4F6',
    },
    primary: {
      DEFAULT: '#3B82F6',
      soft: '#2563EB',
      subtle: '#DBEAFE',
    },
    accent: {
      DEFAULT: '#8B5CF6',
      soft: '#7C3AED',
    },
    success: {
      DEFAULT: '#22C55E',
      soft: 'rgba(34, 197, 94, 0.12)',
    },
    warning: {
      DEFAULT: '#FACC15',
      soft: 'rgba(250, 204, 21, 0.12)',
    },
    text: {
      main: '#111827',
      muted: '#4B5563',
      soft: '#6B7280',
      onPrimary: '#FFFFFF',
    },
    border: {
      subtle: '#E5E7EB',
      strong: '#D1D5DB',
    },
    shadow: {
      soft: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    gradient: {
      header: 'linear-gradient(90deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)',
      primary: 'linear-gradient(135deg, #2563EB 0%, #6366F1 40%, #8B5CF6 100%)',
    },
  },
};

export const getThemeColors = (theme = 'dark') => {
  return colorPalettes[theme] || colorPalettes.dark;
};

