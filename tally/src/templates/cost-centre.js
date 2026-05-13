/**
 * Cost Centre Breakup Template
 * Variables: company, fromDate, toDate, costCentreName, groupName
 */
export const costCentreTemplate = ({ company, fromDate, toDate, costCentreName, groupName = "Direct Expenses" }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>Cost Centre Breakup</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
        <SVFROMDATE>${fromDate}</SVFROMDATE>
        <SVTODATE>${toDate}</SVTODATE>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        <COSTCENTRENAME>${costCentreName}</COSTCENTRENAME>
        <GROUPNAME>${groupName}</GROUPNAME>
        <ISDETAILED>Yes</ISDETAILED>
        <EXPLODEALLLEVELS>Yes</EXPLODEALLLEVELS>
      </STATICVARIABLES>
    </DESC>
  </BODY>
</ENVELOPE>`;
};
