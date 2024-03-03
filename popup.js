const TARGET_BASE_URL = 'https://twitter.com/';
const TARGET_PAGE_URL = 'https://twitter.com/notifications';

let willReport = true;
let willBlock = true;

const checkboxReport = document.getElementById('checkboxReport');
const checkboxBlock = document.getElementById('checkboxBlock');
const btnScan = document.getElementById('btnScan');
const btnForced = document.getElementById('btnForced');
const btnForcedAuto = document.getElementById('btnForcedAuto');

const ignorePaths = [
  'home',
  'notifications',
];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // chrome.tabs.update(tabs[0].id, { url });
  const url = tabs[0].url;
  const pathname = url.replace(TARGET_BASE_URL, '');
  if (!url.includes('twitter.com')
    || ignorePaths.indexOf(pathname) >= 0) {
    btnForced.setAttribute('disabled', true);
    btnForcedAuto.setAttribute('disabled', true);
    return;
  }

  btnForced.removeAttribute('disabled');
  btnForcedAuto.removeAttribute('disabled');
});

checkboxReport.addEventListener('change', function () {
  willReport = !willReport; console.log({ willReport });
  checkboxReport.value = willReport;
});

checkboxBlock.addEventListener('change', function () {
  willBlock = !willBlock; console.log({ willBlock });
  checkboxBlock.value = willBlock;
});

btnScan.addEventListener('click', function () {
  const url = `${TARGET_PAGE_URL}?willReport=${willReport}&willBlock=${willBlock}`;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, { url });
  });
});

btnForced.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(
      tabs[0].id, {
      url: createRNBUrl(tabs[0].url, false),
    },
    );
  });
});

btnForcedAuto.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(
      tabs[0].id, {
      url: createRNBUrl(tabs[0].url, true),
    },
    );
  });
});

function createRNBUrl(url, autoRNB) {
  const splits = url.split('?autoRNB');
  return `${splits[0]}?autoRNB=${autoRNB}&willReport=${willReport}&willBlock=${willBlock}`;
}