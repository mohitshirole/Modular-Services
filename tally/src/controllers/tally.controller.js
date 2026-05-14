import { getTemplate } from '../templates/index.js';
import { executeTallyRequest } from '../services/tally-gateway.service.js';
import logger from '../utils/logger.js';
import { reportEvent } from '../utils/telemetry.js';

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

    await reportEvent('TALLY_REPORT_EXECUTED', 'info', { reportId, company: params?.company });

    // 4. Return the parsed JSON
    return res.json({
      success: true,
      reportId,
      data: result,
    });
  } catch (error) {
    logger.error(`[Tally Controller] Error executing ${reportId}: ${error.message}`);
    await reportEvent('TALLY_REPORT_FAILED', 'error', { reportId, error: error.message });
    return res.status(500).json({
      success: false,
      message: error.message,
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
