import pdfGenerator from '../services/pdf-generator.service.js';
import logger from '../utils/logger.js';
import { reportEvent } from '../utils/telemetry.js';

/**
 * Generate and Download PDF
 */
export const renderPdf = async (req, res) => {
  const { html, data, pdfOptions } = req.body;

  try {
    const pdfBuffer = await pdfGenerator.generate({ html, data, pdfOptions });

    // Set headers for PDF streaming
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'inline; filename="document.pdf"' // 'inline' for preview, 'attachment' for download
    });

    await reportEvent('PDF_RENDERED', 'info', { size: pdfBuffer.length });
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Controller Error: ${error.message}`);
    await reportEvent('PDF_RENDER_FAILED', 'error', { error: error.message });
    res.status(500).json({ success: false, message: "PDF Rendering Failed" });
  }
};

/**
 * Generate PDF as Base64 (Optional)
 */
export const renderPdfBase64 = async (req, res) => {
  const { html, data, pdfOptions } = req.body;

  try {
    const pdfBuffer = await pdfGenerator.generate({ html, data, pdfOptions });
    const base64 = pdfBuffer.toString('base64');

    res.json({
      success: true,
      data: base64,
      filename: "document.pdf"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "PDF Rendering Failed" });
  }
};
