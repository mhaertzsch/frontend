export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const userLevelConfig = {
  standard: {
    title: 'Standard Mitglied',
    color: 'text-common',
    effect: 'Steigere dein Level um ein Upgrade zu erhalten!',
    percentage: 0,
  },
  user_silver: {
    title: 'Silber Mitglied',
    color: 'text-slate-400',
    effect: '1% auf alle Produkte im Shop!',
    percentage: 1,
  },
  user_gold: {
    title: 'Gold Mitglied',
    color: 'text-yellow-400',
    effect: '5% auf alle Produkte im Shop!',
    percentage: 5,
  },
  user_platinum: {
    title: 'Platin Mitglied',
    color: 'text-indigo-300',
    effect: '10% auf alle Produkte im Shop!',
    percentage: 10,
  },
};
export function getUserLevelConfig(user_level) {
  return userLevelConfig[user_level];
}

export function parseDate(utcString) {
  const date = new Date(utcString);
  return date.toLocaleString().replaceAll('/', '.');
}
