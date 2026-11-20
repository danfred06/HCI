// Central place for turning axios failures into messages the UI can show.
// A network error has no `response` — most often the API server is not running.

export function isConnectionError(error) {
  return !error?.response;
}

export function getFieldErrors(error) {
  return error?.response?.data?.errors || {};
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (isConnectionError(error)) {
    return "Cannot connect to the server. Make sure the API is running on port 8100.";
  }

  const data = error.response.data || {};
  const firstFieldError = Object.values(data.errors || {})[0]?.[0];

  return firstFieldError || data.message || fallback;
}
