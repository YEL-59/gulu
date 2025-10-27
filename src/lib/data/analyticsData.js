// Deterministic analytics data generator for dashboard analytics
// MVC: this is the Model. It exposes pure functions to get data by range.

function createSeededRandom(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function rand() {
    // xorshift*
    h ^= h << 13; h >>>= 0;
    h ^= h >>> 7; h >>>= 0;
    h ^= h << 17; h >>>= 0;
    return (h >>> 0) / 4294967295;
  };
}

export function getAnalyticsData(range = 'Dec 24 – Dec 31') {
  const rand = createSeededRandom(`analytics-${range}`);

  const baseImpressions = 40000 + Math.round(rand() * 6000);
  const baseInvolvements = 240000 + Math.round(rand() * 20000);
  const baseAudience = 1200000 + Math.round(rand() * 50000);
  const baseInteractions = 600000 + Math.round(rand() * 40000);

  const kpi = {
    impressions: { value: baseImpressions, change: +(rand() * 4 - 1).toFixed(2) },
    involvements: { value: baseInvolvements, change: +(rand() * 4 - 1).toFixed(2) },
    totalAudience: { value: baseAudience, change: +(rand() * 4 - 1).toFixed(2) },
    audienceInteractions: { value: baseInteractions, change: +(rand() * 4 - 1).toFixed(2) },
  };

  const labels = ['Dec 24', 'Dec 25', 'Dec 26', 'Dec 27', 'Dec 28', 'Dec 29', 'Dec 30', 'Dec 31'];
  const performance = labels.map((_, i) => {
    const season = Math.sin((i / labels.length) * Math.PI * 1.5);
    return Math.round(25000 + season * 15000 + rand() * 8000);
  });

  const usersVisits = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    values: Array.from({ length: 7 }, () => Math.round(2000 + rand() * 10000)),
  };

  const audienceInsight = {
    labels,
    men: labels.map(() => Math.round(400000 + rand() * 200000)),
    women: labels.map(() => Math.round(350000 + rand() * 200000)),
    other: labels.map(() => Math.round(100000 + rand() * 80000)),
  };

  const salesLocation = {
    highlight: { country: 'United States', percent: 55 },
    countries: [
      { name: 'United States', value: 55 },
      { name: 'Canada', value: 12 },
      { name: 'United Kingdom', value: 10 },
      { name: 'Germany', value: 8 },
      { name: 'India', value: 6 },
      { name: 'Other', value: 9 },
    ],
  };

  return { range, labels, kpi, performance, usersVisits, audienceInsight, salesLocation };
}