import { costCentreTemplate } from './cost-centre.js';
import { allLedgersTemplate } from './all-ledgers.js';
import { marketingExpensesTemplate } from './marketing-expenses.js';
import { ledgerMonthlySummaryTemplate } from './ledger-monthly-summary.js';
import { tdsReceivableTemplate } from './tds-receivable.js';

/**
 * Report Registry
 * Maps a "Report ID" to a specific XML template function.
 */
const registry = {
  MARKETING_EXPENSES: marketingExpensesTemplate,
  COST_CENTRE_BREAKUP: costCentreTemplate,
  ALL_LEDGERS: allLedgersTemplate,
  LEDGER_MONTHLY_SUMMARY: ledgerMonthlySummaryTemplate,
  TDS_RECEIVABLE: tdsReceivableTemplate,
};

/**
 * Get a template by ID
 */
export const getTemplate = (reportId) => {
  const template = registry[reportId];
  if (!template) {
    throw new Error(`Report template not found: ${reportId}`);
  }
  return template;
};

/**
 * List all available reports
 */
export const getAvailableReports = () => Object.keys(registry);
