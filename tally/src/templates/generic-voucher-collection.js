/**
 * Generic Voucher Collection Template (supporting specific ledger filters or standard type filtering)
 * Variables: company, fromDate, toDate, voucherType, ledgerName
 */
export const genericVoucherCollectionTemplate = ({ company, fromDate, toDate, voucherType, ledgerName }) => {
  const fDate = fromDate || '20230401';
  const tDate = toDate || new Date().toISOString().split('T')[0].replaceAll('-', '');

  if (ledgerName) {
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
                <SVFROMDATE>${fDate}</SVFROMDATE>
                <SVTODATE>${tDate}</SVTODATE>
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
                        $LedgerName = "${ledgerName}"
                    </SYSTEM>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
  }

  // Standard Voucher Collection (TDL based)
  return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>MyVoucherCollection</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                ${fromDate ? `<SVFROMDATE>${fromDate}</SVFROMDATE>` : ''}
                ${toDate ? `<SVTODATE>${toDate}</SVTODATE>` : ''}
                <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <COLLECTION NAME="MyVoucherCollection">
                        <TYPE>Voucher</TYPE>
                        ${voucherType ? `<FILTER>VoucherTypeFilter</FILTER>` : ''}
                        <FETCH>ALLLEDGERENTRIES.*</FETCH>
                        <FETCH>ALLINVENTORYENTRIES.*</FETCH>
                    </COLLECTION>
                    ${voucherType ? `
                    <SYSTEM TYPE="Formulae" NAME="VoucherTypeFilter">
                        $VoucherTypeName = "${voucherType}"
                    </SYSTEM>` : ''}
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
};
