/**
 * TDS Receivable Template
 * Variables: company, fromDate, toDate
 */
export const tdsReceivableTemplate = ({ company, fromDate = "20230401", toDate }) => {
  const finalToDate = toDate || new Date().toISOString().split('T')[0].replaceAll('-', '');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Collection</TYPE>
        <ID>LedgerVouchersCollection</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${finalToDate}</SVTODATE>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <COLLECTION NAME="LedgerVouchersCollection">
                        <TYPE>Voucher</TYPE>
                        <FETCH>Date, VoucherNumber, VoucherTypeName, Amount, LedgerEntries, AllLedgerEntries</FETCH>
                        <FILTER>IsSpecificLedger</FILTER>
                    </COLLECTION>
                    <SYSTEM TYPE="Formulae" NAME="IsSpecificLedger">
                        $LedgerName = "TDS Receivable (Flatholders)"
                    </SYSTEM>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
};
