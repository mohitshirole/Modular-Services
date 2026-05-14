import axios from 'axios';
import { parseStringPromise } from 'xml2js';

/**
 * Tally Gateway Service
 * Handles the low-level communication with Tally ERP 9 / Prime
 */
export const executeTallyRequest = async ({ xmlBody, tallyUrl, config = {} }) => {
  const {
    timeout = 30000,
    cfAccessClientId,
    cfAccessClientSecret,
  } = config;

  try {
    const response = await axios.post(tallyUrl, xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        ...(cfAccessClientId && { 'CF-Access-Client-Id': cfAccessClientId }),
        ...(cfAccessClientSecret && { 'CF-Access-Client-Secret': cfAccessClientSecret }),
      },
      timeout,
    });

    const xmlData = response.data;
    if (!xmlData || typeof xmlData !== 'string') {
      throw new Error('Invalid response from Tally: Expected XML string.');
    }

    // Parse XML to JSON
    const result = await parseStringPromise(xmlData, {
      explicitArray: false,
      ignoreAttrs: true,
      trim: true,
    });

    return result;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(`Tally request timed out after ${timeout}ms`);
    }
    const status = error.response?.status;
    const details = error.response?.data || error.message || String(error);
    throw new Error(status ? `[Tally ${status}] ${details}` : details);
  }
};
