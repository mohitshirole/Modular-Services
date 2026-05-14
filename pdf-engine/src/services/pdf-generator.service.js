import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import logger from '../utils/logger.js';

/**
 * Functional Service for PDF Generation
 */
export const createPdfGenerator = () => {
  return {
    /**
     * Generate PDF from HTML and Data
     * @param {Object} options - { html, data, pdfOptions }
     */
    generate: async ({ html, data = {}, pdfOptions = {} }) => {
      let browser;
      try {
        logger.info('Starting PDF generation...');

        // 1. Compile HTML with Handlebars
        const template = handlebars.compile(html);
        const finalHtml = template(data);

        // 2. Launch Puppeteer with robust Linux/Docker args
        browser = await puppeteer.launch({
          headless: 'new',
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Fix for Docker memory issues
            '--disable-gpu',           // No GPU in headless
            '--no-zygote',             // Lower memory usage
            '--single-process'         // Helps in low-resource environments
          ]
        });

        const page = await browser.newPage();
        
        // Set a global timeout for the page (30 seconds)
        await page.setDefaultNavigationTimeout(30000);

        // 3. Set content and wait for it to be ready
        await page.setContent(finalHtml, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });

        // 4. Generate PDF Buffer
        const buffer = await page.pdf({
          format: pdfOptions.format || 'A4',
          printBackground: true,
          margin: pdfOptions.margin || { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
          displayHeaderFooter: !!(pdfOptions.headerHtml || pdfOptions.footerHtml),
          headerTemplate: pdfOptions.headerHtml || '<span></span>',
          footerTemplate: pdfOptions.footerHtml || '<div style="font-size:10px; width:100%; text-align:center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
          ...pdfOptions
        });

        logger.info('✔ PDF generated successfully');
        return buffer;
      } catch (error) {
        logger.error(`PDF Generation Error: ${error.message}`);
        throw error;
      } finally {
        if (browser) await browser.close();
      }
    }
  };
};

export default createPdfGenerator();
