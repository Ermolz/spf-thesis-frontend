export const createApiResponse = (data, success = true, errors = null, metadata = null) => ({
  success,
  data,
  metadata,
  errors,
});

export const createErrorDetail = (code, message, field = null, rejectedValue = null, status, path, timestamp) => ({
  code,
  message,
  field,
  rejectedValue,
  status,
  path,
  timestamp,
});

export const createPageResponse = (content, totalElements, totalPages, size, number, first, last) => ({
  content,
  totalElements,
  totalPages,
  size,
  number,
  first,
  last,
});

