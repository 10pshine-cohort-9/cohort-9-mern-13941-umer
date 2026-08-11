export const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
}