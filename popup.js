const TARGET_PAGE_URL = 'https://twitter.com/notifications';

let willReport = true;
let willBlock = true;

const checkboxReport = document.getElementById('checkboxReport');
const checkboxBlock = document.getElementById('checkboxBlock');
const btnScan = document.getElementById('btnScan');

checkboxReport.addEventListener('change', function () {
  willReport = !willReport; console.log({ willReport });
  checkboxReport.value = willReport;
});

checkboxBlock.addEventListener('change', function () {
  willBlock = !willBlock; console.log({ willBlock });
  checkboxBlock.value = willBlock;
});

btnScan.addEventListener('click', function () {
  chrome.tabs.create({
    url: `${TARGET_PAGE_URL}?willReport=${willReport}&willBlock=${willBlock}`,
  });
});