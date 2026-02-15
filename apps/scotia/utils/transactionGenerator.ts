
import { ScotiaTransaction } from '../types';
import { EDMONTON_EMPLOYERS, EDMONTON_BILLERS, EDMONTON_MERCHANTS } from '../constants';

export const generateEdmontonHistory = (count: number = 40): ScotiaTransaction[] => {
  const history: ScotiaTransaction[] = [];
  const now = new Date();
  
  let currentDate = new Date();
  currentDate.setDate(now.getDate() - 60);

  let paydayCounter = 0;

  while (currentDate <= now) {
    const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Payday every 15 days - approx $2800+
    if (paydayCounter % 15 === 0) {
      history.push({
        id: `pay-${currentDate.getTime()}`,
        date: dateStr,
        description: EDMONTON_EMPLOYERS[Math.floor(Math.random() * EDMONTON_EMPLOYERS.length)] + " / PAYROLL",
        amount: 2850.42 + (Math.random() * 300),
        status: 'Completed',
        category: 'Income'
      });
    }

    // Bills on 1st and 15th
    if (currentDate.getDate() === 1 || currentDate.getDate() === 15) {
      history.push({
        id: `bill-${currentDate.getTime()}`,
        date: dateStr,
        description: EDMONTON_BILLERS[Math.floor(Math.random() * EDMONTON_BILLERS.length)],
        amount: -(120 + Math.random() * 200),
        status: 'Completed',
        category: 'Bills'
      });
    }

    // Daily spending
    if (Math.random() < 0.65) {
      const merchant = EDMONTON_MERCHANTS[Math.floor(Math.random() * EDMONTON_MERCHANTS.length)];
      history.push({
        id: `shop-${currentDate.getTime()}`,
        date: dateStr,
        description: merchant,
        amount: -(15 + Math.random() * 110),
        status: 'Completed',
        category: 'Shopping'
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
    paydayCounter++;
  }

  return history.reverse();
};
