/**
 * Ledger Monthly Summary Template
 * Variables: company, fromDate, toDate, ledgerName
 */
export const ledgerMonthlySummaryTemplate = ({ company, fromDate = "20230401", toDate, ledgerName }) => {
  const finalToDate = toDate || new Date().toISOString().split('T')[0].replaceAll('-', '');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>Ledger Monthly Summary</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${finalToDate}</SVTODATE>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <LEDGERNAME>${ledgerName}</LEDGERNAME>
            </STATICVARIABLES>
        </DESC>
    </BODY>
</ENVELOPE>`;
};
