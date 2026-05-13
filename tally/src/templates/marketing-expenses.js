/**
 * Marketing Expenses Template (Sales & Promotional Expenses)
 * Variables: company, fromDate, toDate
 */
export const marketingExpensesTemplate = ({ company, fromDate, toDate }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>Group Summary</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <GROUPNAME>Sales &amp; Promotional Expenses</GROUPNAME>
                <SVSHOWOPENING>No</SVSHOWOPENING>
                <SVEXCLUDEOPTIONAL>Yes</SVEXCLUDEOPTIONAL>
                <ISDETAILED>Yes</ISDETAILED>
            </STATICVARIABLES>
        </DESC>
    </BODY>
</ENVELOPE>`;
};
