// Monthly business data generator for dashboard charts

// Seeded random function for consistent data generation
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generateMonthlyData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();

  // Generate realistic sales data with seasonal trends
  const generateSalesData = (month, index) => {
    const baseValue = 45000;
    const seasonalMultiplier = [
      0.8, 0.85, 0.95, 1.0, 1.1, 1.15, 1.2, 1.18, 1.05, 1.0, 1.25, 1.4,
    ][index];
    const randomVariation = (seededRandom(index * 123) - 0.5) * 0.3;
    return Math.round(baseValue * seasonalMultiplier * (1 + randomVariation));
  };

  // Generate profit data (typically 15-25% of sales)
  const generateProfitData = (salesValue, index) => {
    const profitMargin = 0.15 + seededRandom(index * 456) * 0.1; // 15-25%
    return Math.round(salesValue * profitMargin);
  };

  // Generate customer data
  const generateCustomerData = (month, index) => {
    const baseNewCustomers = 800;
    const seasonalMultiplier = [
      0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.25, 1.1, 1.0, 1.4, 1.6,
    ][index];
    const newCustomers = Math.round(
      baseNewCustomers *
        seasonalMultiplier *
        (0.8 + seededRandom(index * 789) * 0.4)
    );
    const repeatedCustomers = Math.round(
      newCustomers * (1.2 + seededRandom(index * 987) * 0.8)
    );
    return { new: newCustomers, repeated: repeatedCustomers };
  };

  // Generate daily data points for line charts (30 days)
  const generateDailyData = (monthlyValue, seed) => {
    const dailyData = [];
    const avgDaily = monthlyValue / 30;

    for (let day = 1; day <= 30; day++) {
      const weekendMultiplier = [6, 0].includes(
        new Date(currentYear, 0, day).getDay()
      )
        ? 0.7
        : 1.0;
      const trendMultiplier = 0.8 + (day / 30) * 0.4; // Gradual increase through month
      const randomVariation = 0.7 + seededRandom(seed + day) * 0.6;

      dailyData.push(
        Math.round(
          avgDaily * weekendMultiplier * trendMultiplier * randomVariation
        )
      );
    }

    return dailyData;
  };

  const monthlyData = {};

  months.forEach((month, index) => {
    const salesValue = generateSalesData(month, index);
    const profitValue = generateProfitData(salesValue, index);
    const customerData = generateCustomerData(month, index);

    monthlyData[month] = {
      sales: {
        total: salesValue,
        daily: generateDailyData(salesValue, index * 1000),
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      },
      revenue: {
        sales: salesValue,
        profit: profitValue,
        daily: {
          sales: generateDailyData(salesValue, index * 1000),
          profit: generateDailyData(profitValue, index * 2000),
        },
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      },
      customers: {
        new: customerData.new,
        repeated: customerData.repeated,
        total: customerData.new + customerData.repeated,
      },
      stats: {
        totalRevenue: salesValue,
        totalCustomers: customerData.new + customerData.repeated,
        totalTransactions: Math.round(salesValue / 85), // Avg transaction ~$85
        totalProducts: 2000 + Math.round(seededRandom(index * 3000) * 500),
      },
    };
  });

  return monthlyData;
};

// Get data for specific month
export const getMonthData = (month) => {
  const data = generateMonthlyData();
  return data[month] || data["October"]; // Default to October
};

// Get available months
export const getAvailableMonths = () => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
};

// Calculate month-over-month changes
export const getMonthlyChanges = (currentMonth) => {
  const data = generateMonthlyData();
  const months = getAvailableMonths();
  const currentIndex = months.indexOf(currentMonth);
  const previousIndex = currentIndex > 0 ? currentIndex - 1 : 11;
  const previousMonth = months[previousIndex];

  const current = data[currentMonth];
  const previous = data[previousMonth];

  return {
    revenue: {
      value: current.stats.totalRevenue,
      change: (
        ((current.stats.totalRevenue - previous.stats.totalRevenue) /
          previous.stats.totalRevenue) *
        100
      ).toFixed(1),
    },
    customers: {
      value: current.stats.totalCustomers,
      change: (
        ((current.stats.totalCustomers - previous.stats.totalCustomers) /
          previous.stats.totalCustomers) *
        100
      ).toFixed(1),
    },
    transactions: {
      value: current.stats.totalTransactions,
      change: (
        ((current.stats.totalTransactions - previous.stats.totalTransactions) /
          previous.stats.totalTransactions) *
        100
      ).toFixed(1),
    },
    products: {
      value: current.stats.totalProducts,
      change: (
        ((current.stats.totalProducts - previous.stats.totalProducts) /
          previous.stats.totalProducts) *
        100
      ).toFixed(1),
    },
  };
};