function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function dateWithMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);

  return date.toISOString().slice(0, 10);
}

function dateWithDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
}

// MIN = Minimum expected value
// MAX = Maximium expected value
// Function to normalise the values (MIN / MAX could be integrated)
function normalise (value, min=0,max=100) {
  return ((value - min) * 100) / (max - min);
}

export { getRandomInt, dateWithMonths, dateWithDays, normalise };

