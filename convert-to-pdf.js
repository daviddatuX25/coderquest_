#!/usr/bin/env node

/**
 * CoderQuest System - Markdown to PDF/HTML Converter
 * Converts COMPLETE_SYSTEM_SUBMISSION.md to professional PDF/HTML
 * with brand colors (#3b82f6 - primary blue) and premium styling
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  inputFile: 'COMPLETE_SYSTEM_SUBMISSION.md',
  outputHTML: 'COMPLETE_SYSTEM_SUBMISSION.html',
  outputPDF: 'COMPLETE_SYSTEM_SUBMISSION.pdf',
  brandColor: '#3b82f6',        // Primary Blue
  brandColorDark: '#1e40af',    // Dark Blue
  accentColor: '#10b981',       // Green (Secondary)
  warningColor: '#ef4444',      // Red
  successColor: '#10b981',      // Green
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

// ============================================
// CSS STYLES
// ============================================

const CSS_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @page {
    size: A4;
    margin: 2cm;
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 10px;
      color: #999;
    }
  }

  body {
    font-family: ${CONFIG.fontFamily};
    line-height: 1.6;
    color: #1f2937;
    background: #ffffff;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-size: 14px;
  }

  /* ============================================
     COVER PAGE
     ============================================ */
  .cover-page {
    page-break-after: always;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, ${CONFIG.brandColor} 0%, ${CONFIG.brandColorDark} 100%);
    color: white;
    padding: 2rem;
  }

  .cover-page h1 {
    font-size: 3.5em;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: -1px;
  }

  .cover-page .subtitle {
    font-size: 1.3em;
    opacity: 0.95;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .cover-page .metadata {
    margin-top: 3rem;
    font-size: 1em;
    opacity: 0.85;
    line-height: 1.8;
  }

  .cover-page .metadata p {
    margin: 0.5rem 0;
  }

  /* ============================================
     HEADINGS
     ============================================ */
  h1 {
    color: ${CONFIG.brandColorDark};
    font-size: 2.5em;
    font-weight: 700;
    margin: 2rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 3px solid ${CONFIG.brandColor};
    page-break-after: avoid;
  }

  h2 {
    color: ${CONFIG.brandColorDark};
    font-size: 1.8em;
    font-weight: 600;
    margin: 1.5rem 0 0.8rem 0;
    padding-left: 1rem;
    border-left: 4px solid ${CONFIG.brandColor};
    page-break-after: avoid;
  }

  h3 {
    color: #374151;
    font-size: 1.3em;
    font-weight: 600;
    margin: 1.2rem 0 0.6rem 0;
    page-break-after: avoid;
  }

  h4 {
    color: #4b5563;
    font-size: 1.1em;
    font-weight: 600;
    margin: 1rem 0 0.5rem 0;
  }

  /* ============================================
     HORIZONTAL RULE
     ============================================ */
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, ${CONFIG.brandColor} 0%, transparent 50%, ${CONFIG.brandColor} 100%);
    margin: 2rem 0;
    page-break-after: avoid;
  }

  /* ============================================
     PARAGRAPHS & TEXT
     ============================================ */
  p {
    margin: 1rem 0;
    text-align: justify;
  }

  strong {
    color: ${CONFIG.brandColorDark};
    font-weight: 600;
  }

  em {
    color: #666;
    font-style: italic;
  }

  /* ============================================
     LINKS
     ============================================ */
  a {
    color: ${CONFIG.brandColor};
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }

  /* ============================================
     CODE & PREFORMATTED TEXT
     ============================================ */
  code {
    background: #f3f4f6;
    color: #1e40af;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;
    border-left: 4px solid ${CONFIG.brandColor};
    page-break-inside: avoid;
    font-size: 0.85em;
    line-height: 1.4;
  }

  pre code {
    background: none;
    color: inherit;
    padding: 0;
    border-radius: 0;
  }

  /* ============================================
     LISTS
     ============================================ */
  ul, ol {
    margin: 1rem 0 1rem 2rem;
  }

  ul li, ol li {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  ul li::marker {
    color: ${CONFIG.brandColor};
    font-weight: 600;
  }

  ol li::marker {
    color: ${CONFIG.brandColorDark};
    font-weight: 600;
  }

  /* ============================================
     TABLES
     ============================================ */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    page-break-inside: avoid;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  thead {
    background: linear-gradient(135deg, ${CONFIG.brandColor} 0%, ${CONFIG.brandColorDark} 100%);
    color: white;
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid ${CONFIG.brandColor};
  }

  td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  tbody tr:nth-child(odd) {
    background: #f9fafb;
  }

  tbody tr:hover {
    background: #f3f4f6;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  /* ============================================
     BLOCKQUOTES
     ============================================ */
  blockquote {
    border-left: 4px solid ${CONFIG.brandColor};
    padding-left: 1.5rem;
    margin: 1.5rem 0;
    color: #4b5563;
    font-style: italic;
    background: #f0f4ff;
    padding: 1rem 1.5rem;
    border-radius: 4px;
  }

  /* ============================================
     TABLE OF CONTENTS
     ============================================ */
  .toc {
    background: #f9fafb;
    border: 2px solid ${CONFIG.brandColor};
    border-radius: 8px;
    padding: 2rem;
    margin: 2rem 0;
    page-break-inside: avoid;
  }

  .toc h2 {
    border: none;
    padding: 0;
    margin-top: 0;
    color: ${CONFIG.brandColor};
  }

  .toc ul {
    list-style: none;
    margin: 1rem 0;
  }

  .toc li {
    margin: 0.8rem 0;
    padding-left: 1.5rem;
  }

  .toc a {
    color: ${CONFIG.brandColor};
    text-decoration: none;
    font-weight: 500;
  }

  /* ============================================
     SECTION BOXES
     ============================================ */
  .section-box {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%);
    border-left: 4px solid ${CONFIG.brandColor};
    padding: 1.5rem;
    margin: 1.5rem 0;
    border-radius: 4px;
    page-break-inside: avoid;
  }

  .section-box h3 {
    color: ${CONFIG.brandColorDark};
    margin-top: 0;
  }

  /* ============================================
     HIGHLIGHT BOXES
     ============================================ */
  .info-box {
    background: #dbeafe;
    border-left: 4px solid ${CONFIG.brandColor};
    padding: 1rem 1.5rem;
    margin: 1rem 0;
    border-radius: 4px;
  }

  .success-box {
    background: #dcfce7;
    border-left: 4px solid ${CONFIG.accentColor};
    padding: 1rem 1.5rem;
    margin: 1rem 0;
    border-radius: 4px;
    color: #166534;
  }

  .warning-box {
    background: #fee2e2;
    border-left: 4px solid ${CONFIG.warningColor};
    padding: 1rem 1.5rem;
    margin: 1rem 0;
    border-radius: 4px;
    color: #7f1d1d;
  }

  /* ============================================
     PAGE BREAK
     ============================================ */
  .page-break {
    page-break-after: always;
  }

  /* ============================================
     FOOTER
     ============================================ */
  .footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #e5e7eb;
    text-align: center;
    color: #999;
    font-size: 12px;
  }

  .footer p {
    margin: 0.5rem 0;
  }

  /* ============================================
     PRINT STYLES
     ============================================ */
  @media print {
    body {
      background: white;
      box-shadow: none;
    }

    a {
      color: inherit;
    }

    h1, h2, h3 {
      page-break-after: avoid;
    }

    pre, table {
      page-break-inside: avoid;
    }

    .no-print {
      display: none;
    }
  }
`;

// ============================================
// HTML TEMPLATE
// ============================================

function generateHTML(content) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CoderQuest - Complete System Submission</title>
  <style>
    ${CSS_STYLES}
  </style>
</head>
<body>
  <!-- COVER PAGE -->
  <div class="cover-page">
    <h1>CoderQuest</h1>
    <p class="subtitle">Complete System Submission</p>
    <div class="metadata">
      <p><strong>Full Stack Architecture</strong></p>
      <p>Database • Phaser Game Engine • React Components • SCSS Styling</p>
      <p style="margin-top: 2rem; font-size: 0.9em;">
        <strong>Date:</strong> ${date}<br>
        <strong>Status:</strong> Production Ready<br>
        <strong>Version:</strong> 1.0
      </p>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <div class="main-content">
    ${content}
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p>© 2025 CoderQuest - Complete System Submission</p>
    <p>Database • Phaser • React • SCSS • Events</p>
  </div>

  <script>
    // Print to PDF using browser print dialog
    console.log('Document ready. To save as PDF:');
    console.log('1. Press Ctrl+P (or Cmd+P on Mac)');
    console.log('2. Select "Save as PDF" as printer');
    console.log('3. Click Save');
  </script>
</body>
</html>`;
}

// ============================================
// MARKDOWN TO HTML CONVERTER
// ============================================

function markdownToHTML(markdown) {
  let html = markdown;

  // Escape HTML special characters (but preserve code blocks)
  const codeBlocks = [];
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Tables
  html = html.replace(/\n(\|.*\n)+/g, (match) => {
    let rows = match.trim().split('\n').map(row => row.split('|').slice(1, -1));
    
    if (rows.length < 2) return match;

    const headerSeparator = rows[1];
    const isTable = headerSeparator.every(cell => /^[\s:-]+$/.test(cell.trim()));
    
    if (!isTable) return match;

    const header = rows[0];
    const body = rows.slice(2);

    let table = '<table><thead><tr>';
    header.forEach(cell => {
      table += `<th>${cell.trim()}</th>`;
    });
    table += '</tr></thead><tbody>';
    
    body.forEach(row => {
      table += '<tr>';
      row.forEach(cell => {
        table += `<td>${cell.trim()}</td>`;
      });
      table += '</tr>';
    });
    
    table += '</tbody></table>';
    return `\n${table}\n`;
  });

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');

  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Code (inline)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

  // Code blocks
  html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
    const block = codeBlocks[parseInt(index)];
    const code = block.replace(/^```(.*?)\n?/s, '').replace(/\n?```$/s, '');
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  });

  // Lists (unordered)
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p>');
  html = `<p>${html}</p>`;

  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// MAIN CONVERSION FUNCTION
// ============================================

async function convertMarkdownToPDF() {
  try {
    console.log('🚀 CoderQuest Markdown to PDF Converter\n');

    // Read markdown file
    if (!fs.existsSync(CONFIG.inputFile)) {
      throw new Error(`❌ Input file not found: ${CONFIG.inputFile}`);
    }

    console.log(`📖 Reading: ${CONFIG.inputFile}...`);
    const markdown = fs.readFileSync(CONFIG.inputFile, 'utf8');
    console.log(`✅ Read ${markdown.length} characters\n`);

    // Convert to HTML
    console.log('🎨 Converting to HTML...');
    const htmlContent = markdownToHTML(markdown);
    const fullHTML = generateHTML(htmlContent);
    console.log('✅ HTML conversion complete\n');

    // Save HTML
    console.log(`💾 Saving HTML: ${CONFIG.outputHTML}...`);
    fs.writeFileSync(CONFIG.outputHTML, fullHTML, 'utf8');
    const htmlSize = fs.statSync(CONFIG.outputHTML).size / 1024;
    console.log(`✅ Saved (${htmlSize.toFixed(2)} KB)\n`);

    // PDF conversion instructions
    console.log('📄 PDF Conversion Instructions:\n');
    console.log(`1. Open in browser: ${CONFIG.outputHTML}`);
    console.log('2. Press Ctrl+P (Windows) or Cmd+P (Mac)');
    console.log('3. Select printer: "Save as PDF"');
    console.log('4. Click "Save"');
    console.log('\n💡 Tip: The HTML file is already print-optimized with proper pagination!\n');

    console.log('✨ Conversion complete!\n');
    console.log('📦 Output files:');
    console.log(`   ✅ ${CONFIG.outputHTML}`);
    console.log('\n🎉 HTML file generated successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// ============================================
// RUN CONVERSION
// ============================================

convertMarkdownToPDF();
