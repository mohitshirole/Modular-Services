import { getTemplate } from '../templates/index.js';
import { executeTallyRequest } from '../services/tally-gateway.service.js';
import logger from '../utils/logger.js';

/**
 * Standardize and process the parsed JSON from Tally
 */
const parseTallyResponse = (result, params = {}) => {
  if (!result) return [];

  // Company Mismatch Check
  if (result?.ENVELOPE?.BODY?.IMPORTDATA?.REQUESTDATA?.TALLYMESSAGE?.COMPANY) {
    const companyInfo = result.ENVELOPE.BODY.IMPORTDATA.REQUESTDATA.TALLYMESSAGE.COMPANY['REMOTECMPINFO.LIST'];
    const remoteName = companyInfo?.REMOTECMPNAME || companyInfo?.NAME;
    const got = (remoteName || '').trim();
    throw new Error(`Tally Connection Error. Received Company Info: "${got}". Check if the Company is Open in Tally.`);
  }

  const body = result?.ENVELOPE?.BODY;
  const data = body?.DATA || body?.IMPORTDATA || result?.ENVELOPE;

  if (!data) return [];

  // 1. Check for standard Voucher Collections
  let vouchers = [];
  const collection = data.CUSTOMVOUCHERCOLLECTION || data.COLLECTION || data.LEDGERVOUCHERSCOLLECTION || data.LEDGER_VOUCHERS_COLLECTION;

  if (collection) {
    if (Array.isArray(collection)) {
      if (collection[0]?.VOUCHERTYPENAME || collection[0]?.DATE) {
        vouchers = collection;
      } else {
        vouchers = collection.flatMap(c => c.VOUCHER || []);
      }
    } else if (collection.VOUCHER) {
      vouchers = Array.isArray(collection.VOUCHER) ? collection.VOUCHER : [collection.VOUCHER];
    } else if (collection.GUID || collection.DATE || collection.VOUCHERTYPENAME) {
      vouchers = [collection];
    } else {
      if (Object.keys(collection).length > 0) {
        vouchers = [collection];
      }
    }
  } else if (data.VOUCHER) {
    vouchers = Array.isArray(data.VOUCHER) ? data.VOUCHER : [data.VOUCHER];
  } else if (data.TALLYMESSAGE) {
    let msgs = data.TALLYMESSAGE;
    if (!Array.isArray(msgs)) msgs = [msgs];
    vouchers = msgs.map(m => m.VOUCHER).filter(Boolean);
  }

  // 2. Fallback for Group Summary / Static Reports (parallel arrays)
  if (vouchers.length === 0) {
    const monthEntries = Array.isArray(data.DSPMNTHNAME) ? data.DSPMNTHNAME : (data.DSPMNTHNAME ? [data.DSPMNTHNAME] : []);
    const periodEntries = Array.isArray(data.DSPPERIOD) ? data.DSPPERIOD : (data.DSPPERIOD ? [data.DSPPERIOD] : []);
    const nameEntries = Array.isArray(data.DSPACCNAME) ? data.DSPACCNAME : (data.DSPACCNAME ? [data.DSPACCNAME] : []);
    const dispNames = Array.isArray(data.DSPDISPNAME) ? data.DSPDISPNAME : (data.DSPDISPNAME ? [data.DSPDISPNAME] : []);

    const names = periodEntries.length > 0 ? periodEntries : (monthEntries.length > 0 ? monthEntries : (nameEntries.length > 0 ? nameEntries : dispNames));
    const accInfo = Array.isArray(data.DSPACCINFO) ? data.DSPACCINFO : (data.DSPACCINFO ? [data.DSPACCINFO] : []);

    if (names.length > 0) {
      return names.map((nameObj, idx) => {
        const info = accInfo[idx] || {};
        const name = (typeof nameObj === 'object' ? (nameObj.DSPDISPNAME || nameObj._ || nameObj.NAME || nameObj.DSPMNTHNAME || nameObj.DSPPERIOD) : nameObj) || '';
        const month = (typeof nameObj === 'object' ? (nameObj.DSPMNTHNAME || nameObj.DSPPERIOD) : null) || ((monthEntries.length > 0 || periodEntries.length > 0) ? name : null);

        const getAmt = (val) => (typeof val === 'object' ? (val.DSPCLDRAMTA || val.DSPCLCRAMTA || val.DSPDRAMTA || val.DSPCRAMTA || val.DSPCLAMTA || val._) : val) || '';
        const debit = getAmt(info.DSPDRAMT || info.DSPCLDRAMT);
        const credit = getAmt(info.DSPCRAMT || info.DSPCLCRAMT);
        const closingBalance = getAmt(info.DSPCLAMT);

        return {
          name,
          month,
          debit,
          credit,
          closingBalance,
          isSummary: true,
          raw: { nameObj, info }
        };
      });
    }
  }

  if (vouchers.length > 0) {
    return vouchers.map(v => ({
      date: v.DATE,
      voucherNumber: v.VOUCHERNUMBER,
      partyName: v.PARTYLEDGERNAME,
      amount: v.AMOUNT,
      narration: v.NARRATION,
      voucherType: v.VOUCHERTYPENAME,
      guid: v.GUID,
      ...v
    }));
  }

  return [];
};

/**
 * Main Controller for Tally Operations
 */
export const executeReport = async (req, res) => {
  const { reportId, tallyUrl, config, params } = req.body;

  try {
    logger.info(`Executing Tally Report: ${reportId} for company: ${params?.company}`);

    // 1. Get the correct XML template function
    const templateFn = getTemplate(reportId);

    // 2. Generate the XML string using provided params
    const xmlBody = templateFn(params || {});

    // 3. Execute the request via the Gateway
    const result = await executeTallyRequest({
      xmlBody,
      tallyUrl,
      config,
    });

    // 4. Post-process the response JSON directly in the gateway
    const processedData = parseTallyResponse(result, params || {});

    // 5. Return the clean parsed JSON
    return res.json({
      success: true,
      reportId,
      data: processedData,
    });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    logger.error(`[Tally Controller] Error executing ${reportId}: ${errorMessage}`);
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

/**
 * Health Check / Connection Test
 */
export const testConnection = async (req, res) => {
  const { tallyUrl, config } = req.body;

  try {
    logger.info(`Testing connection to Tally: ${tallyUrl}`);
    
    // Send a simple request without a payload for health check
    const result = await executeTallyRequest({ 
      xmlBody: '', 
      tallyUrl, 
      config 
    });

    const responseText = JSON.stringify(result);
    
    if (responseText.toLowerCase().includes('running') || responseText.toLowerCase().includes('tally')) {
      return res.json({ success: true, message: 'Tally Connection Verified Successfully!' });
    } else {
      return res.json({ success: true, message: 'Connected to Tally.', details: result });
    }
  } catch (error) {
    logger.error(`[Tally Connection Test Error]: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};
