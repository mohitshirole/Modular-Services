/**
 * Generic Group Summary Template
 * Variables: company, fromDate, toDate, groupName
 */
export const genericGroupSummaryTemplate = ({ company, fromDate, toDate, groupName }) => {
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
                ${fromDate ? `<SVFROMDATE>${fromDate}</SVFROMDATE>` : ''}
                ${toDate ? `<SVTODATE>${toDate}</SVTODATE>` : ''}
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <GROUPNAME>${groupName}</GROUPNAME>
            </STATICVARIABLES>
        </DESC>
    </BODY>
</ENVELOPE>`;
};
