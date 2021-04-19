export function getDayName(date) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayName = days[date.getDay()];
  return dayName;
}

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function formatMessageDateForNotification(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const day = 1000 * 60 * 60 * 24;
  const DiffDays = now - date;
  if (DiffDays < day) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${ minutes}` : minutes;
    const strTime = `${hours }:${ minutes } ${ ampm}`;
    return strTime;
  }
  if (DiffDays >= day && DiffDays < 2 * day) {
    return 'Yesterday';
  }
  if (DiffDays >= 2 * day && DiffDays < 7 * day) {
    return getDayName(date);
  }
  if (DiffDays === 7 * day) {
    return 'One Week';
  }
  return formatDate(dateStr);
}
