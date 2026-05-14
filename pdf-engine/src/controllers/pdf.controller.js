import pdfGenerator from '../services/pdf-generator.service.js';
import logger from '../utils/logger.js';

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

    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Controller Error: ${error.message}`);
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
