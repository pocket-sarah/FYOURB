import { ScotiaAccount } from '../../scotia/types';
import { getSystemConfig } from '../../../data/systemConfig';
import { EDMONTON_BILLERS, EDMONTON_MERCHANTS } from '../../scotia/constants';

interface Transaction {
    dateStr: string;
    descMain: string;
    descSub: string;
    withdrawal: string;
    deposit: string;
    balance: number;
    dateObj: Date;
}

export const generateTDStatementHTML = (accountName: string, account: ScotiaAccount, month: number, year: number) => {
  const config = getSystemConfig();
  const holderName = config.td_config.account_holder.toUpperCase();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fmtShortDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fmtMoney = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // --- Transaction Generation ---
  const transactions: Transaction[] = [];
  let runningBalance = Math.floor(Math.random() * 5000) + 3000; 
  const openingBalance = runningBalance;

  const payDates = [15, endDate.getDate() === 31 ? 30 : 28];
  const billDates = [1, 5, 12, 20, 25];

  for (let d = 1; d <= endDate.getDate(); d++) {
      const curr = new Date(year, month, d);
      
      if (payDates.includes(d)) {
          const payAmt = 2450.00 + (Math.random() * 500);
          runningBalance += payAmt;
          transactions.push({
              dateStr: fmtShortDate(curr),
              descMain: "DEPOSIT",
              descSub: "DIRECT DEP / PAYROLL",
              withdrawal: "",
              deposit: fmtMoney(payAmt),
              balance: runningBalance,
              dateObj: curr
          });
      }

      if (billDates.includes(d)) {
          const amt = Math.random() * 150 + 40;
          runningBalance -= amt;
          const biller = EDMONTON_BILLERS[Math.floor(Math.random() * EDMONTON_BILLERS.length)];
          transactions.push({
              dateStr: fmtShortDate(curr),
              descMain: "BILL PAYMENT",
              descSub: biller,
              withdrawal: fmtMoney(amt),
              deposit: "",
              balance: runningBalance,
              dateObj: curr
          });
      }

      const dailyTxCount = Math.floor(Math.random() * 2); 
      for(let i=0; i<dailyTxCount; i++) {
          const amt = Math.random() * 80 + 10;
          runningBalance -= amt;
          const merchant = EDMONTON_MERCHANTS[Math.floor(Math.random() * EDMONTON_MERCHANTS.length)];
          transactions.push({
              dateStr: fmtShortDate(curr),
              descMain: "DEBIT PURCHASE",
              descSub: merchant,
              withdrawal: fmtMoney(amt),
              deposit: "",
              balance: runningBalance,
              dateObj: curr
          });
      }
  }

  transactions.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  let bal = openingBalance;
  transactions.forEach(t => {
      const dep = t.deposit ? parseFloat(t.deposit.replace(/,/g,'')) : 0;
      const wid = t.withdrawal ? parseFloat(t.withdrawal.replace(/,/g,'')) : 0;
      bal = bal + dep - wid;
      t.balance = bal;
  });

  const closingBalance = bal;

  const PAGE_1_MAX_ROWS = 18; 
  const PAGE_N_MAX_ROWS = 35; 
  
  const pages = [];
  let remaining = [...transactions];
  pages.push(remaining.splice(0, PAGE_1_MAX_ROWS));
  while (remaining.length > 0) {
      pages.push(remaining.splice(0, PAGE_N_MAX_ROWS));
  }

  const totalPages = pages.length;
  const tdLogoSVG = `<svg viewBox="0 0 320 286" style="width: 45px; height: 45px; display:block;"><path fill="#008A00" d="M 0,0 320,0 320,286 0,286 0,0 z" /><g transform="scale(1, -1) translate(0, -286)"><g transform="translate(210.1, 61.9)"><path fill="#ffffff" d="m 0,0 -74.5,0 0,134.3 37.4,0 0,-110.5 36,0 c 24.8,0 35.3,17.2 35.3,61.6 0,44.6 -11.9,57.6 -37.1,57.6 l -82.1,0 0,-142.9 -37.1,0 0,142.9 -54.4,0 0,23.8 185.1,0 c 44.7,0 65.9,-23.1 65.9,-81.1 C 74.5,9.4 42.8,0 0,0" /></g></g></svg>`;

  const renderPage = (rows: Transaction[], pageNum: number) => {
      const isFirst = pageNum === 1;
      const isLast = pageNum === totalPages;
      let tableRows = '';
      
      if (isFirst) {
          tableRows += `
            <tr class="tx-row opening-row">
                <td class="col-date bold">${fmtShortDate(startDate)}</td>
                <td class="col-desc bold">OPENING BALANCE</td>
                <td class="col-w"></td>
                <td class="col-d"></td>
                <td class="col-b bold">${fmtMoney(openingBalance)}</td>
            </tr>
          `;
      }

      rows.forEach(t => {
          tableRows += `
            <tr class="tx-row">
                <td class="col-date">${t.dateStr}</td>
                <td class="col-desc">
                    <div class="desc-main">${t.descMain}</div>
                    <div class="desc-sub">${t.descSub}</div>
                </td>
                <td class="col-w">${t.withdrawal}</td>
                <td class="col-d">${t.deposit}</td>
                <td class="col-b">${fmtMoney(t.balance)}</td>
            </tr>
          `;
      });

      return `
        <div class="page ${pageNum > 1 ? 'page-break' : ''}">
            <div class="content-wrapper">
                <div class="header">
                    <div class="header-left">
                        <div class="logo-row">
                            ${tdLogoSVG}
                            <div class="logo-text-block">
                                <span class="logo-text">TD Canada Trust</span>
                            </div>
                        </div>
                        ${isFirst ? `
                        <div class="bank-address">
                            P.O. BOX 1, TD CENTRE<br>
                            TORONTO, ONTARIO M5K 1A2
                        </div>
                        ` : ''}
                    </div>
                    <div class="header-right">
                        <div class="green-bar">Account Statement</div>
                        <div class="page-meta">
                            <span class="bold">${holderName}</span><br>
                            ${accountName}<br>
                            ${fmtDate(startDate)} to ${fmtDate(endDate)}
                        </div>
                    </div>
                </div>

                ${isFirst ? `
                    <div class="info-grid">
                        <div class="info-left">
                            <div class="client-address">
                                ${holderName}<br>
                                123 JASPER AVE<br>
                                EDMONTON AB T5J 2Z1
                            </div>
                        </div>
                        <div class="info-right">
                            <div class="account-meta">
                                Your Account Number:<br>
                                <span class="acc-num-large">1035-5283941</span>
                                <br><br>
                                Contact TD:<br>
                                <span class="bold">1-866-222-3456</span><br>
                                www.td.com
                            </div>
                        </div>
                    </div>

                    <div class="section-header">Account Summary</div>
                    <table class="summary-table">
                        <tr>
                            <td>Opening Balance on ${fmtShortDate(startDate)}</td>
                            <td class="text-right bold">$${fmtMoney(openingBalance)}</td>
                        </tr>
                        <tr>
                            <td>Total Withdrawals</td>
                            <td class="text-right">-$${fmtMoney(transactions.reduce((s,t)=>s+(t.withdrawal?parseFloat(t.withdrawal.replace(/,/g,'')):0), 0))}</td>
                        </tr>
                        <tr>
                            <td>Total Deposits</td>
                            <td class="text-right">+$${fmtMoney(transactions.reduce((s,t)=>s+(t.deposit?parseFloat(t.deposit.replace(/,/g,'')):0), 0))}</td>
                        </tr>
                        <tr class="total-row">
                            <td>Closing Balance on ${fmtShortDate(endDate)}</td>
                            <td class="text-right bold">$${fmtMoney(closingBalance)}</td>
                        </tr>
                    </table>
                ` : ''}

                <div class="section-header ${isFirst ? 'top-gap' : ''}">Transaction Details</div>
                <table class="tx-table">
                    <thead>
                        <tr>
                            <th class="col-date">Date</th>
                            <th class="col-desc">Description</th>
                            <th class="col-w">Withdrawals ($)</th>
                            <th class="col-d">Deposits ($)</th>
                            <th class="col-b">Balance ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>

            <div class="footer-container">
                <div class="footer-line"></div>
                <div class="footer">
                    <div class="footer-text">Member of TD Bank Group</div>
                    <div class="page-num">Page ${pageNum} of ${totalPages}</div>
                </div>
            </div>
        </div>
      `;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
            @page { size: letter; margin: 0; }
            body { margin: 0; padding: 0; background: #fff; font-family: 'Roboto', sans-serif; color: #000; }
            .page { position: relative; width: 8.5in; height: 11in; overflow: hidden; }
            .page-break { page-break-before: always; }
            .content-wrapper { padding: 50px 50px 0 50px; height: 10in; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .logo-row { display: flex; align-items: center; gap: 12px; }
            .logo-text { font-size: 24px; font-weight: 900; color: #008A00; letter-spacing: -1px; }
            .bank-address { margin-top: 15px; font-size: 8px; color: #666; line-height: 1.4; }
            .green-bar { background: #008A00; color: #fff; font-weight: 700; font-size: 14px; padding: 8px 15px; text-align: right; margin-bottom: 10px; }
            .page-meta { font-size: 10px; text-align: right; line-height: 1.5; }
            .info-grid { display: flex; justify-content: space-between; margin-bottom: 35px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .client-address { font-size: 12px; font-weight: 700; line-height: 1.4; }
            .account-meta { font-size: 10px; text-align: left; }
            .acc-num-large { font-size: 14px; font-weight: 900; color: #008A00; }
            .bold { font-weight: 700; }
            .section-header { font-size: 14px; font-weight: 900; border-bottom: 2px solid #008A00; padding-bottom: 4px; margin-bottom: 15px; text-transform: uppercase; color: #008A00; }
            .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .summary-table td { font-size: 11px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
            .total-row td { border-top: 1px solid #000; font-size: 12px; padding-top: 10px; border-bottom: none; }
            .tx-table { width: 100%; border-collapse: collapse; }
            .tx-table th { font-size: 9px; font-weight: 900; text-align: right; border-bottom: 1px solid #000; padding: 8px 4px; background: #f9f9f9; }
            .tx-table th.col-date, .tx-table th.col-desc { text-align: left; }
            .tx-row td { font-size: 10px; padding: 8px 4px; border-bottom: 1px solid #eee; vertical-align: top; }
            .opening-row td { font-weight: 900; background: #fdfdfd; }
            .col-date { width: 12%; font-weight: 700; }
            .col-desc { width: 40%; }
            .desc-main { font-weight: 700; font-size: 9px; margin-bottom: 2px; }
            .desc-sub { font-size: 8px; color: #555; }
            .col-w, .col-d, .col-b { width: 16%; text-align: right; }
            .text-right { text-align: right; }
            .footer-container { position: absolute; bottom: 40px; left: 50px; right: 50px; }
            .footer-line { width: 100%; border-top: 1px solid #ddd; margin-bottom: 10px; }
            .footer { display: flex; justify-content: space-between; font-size: 10px; color: #888; font-weight: 500; }
            .top-gap { margin-top: 40px; }
        </style>
    </head>
    <body>
        ${pages.map((rows, i) => renderPage(rows, i + 1)).join('')}
        <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `;
};