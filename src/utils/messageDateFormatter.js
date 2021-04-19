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

export default function formatMessageDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const day = 1000 * 60 * 60 * 24;
  if (now - date < day) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${ minutes}` : minutes;
    const strTime = `${hours }:${ minutes } ${ ampm}`;
    return strTime;
  }
  return getDayName(date);
}

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
