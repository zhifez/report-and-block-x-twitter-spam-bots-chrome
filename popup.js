const TARGET_PAGE_URL = 'https://twitter.com/notifications';

const btnScan = document.getElementById('btnScan');

btnScan.addEventListener('click', function () {
  chrome.tabs.create({ url: TARGET_PAGE_URL });
});