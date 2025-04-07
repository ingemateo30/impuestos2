export function formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Bogota'
    };
    return new Date(date).toLocaleDateString('es-CO', options);
  }
  
  export function isDueWithinDays(date, days) {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays >= 0;
  }