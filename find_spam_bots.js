const BASE_URL = 'https://twitter.com/';
const MAX_INTERVAL = 15;
const INTERVAL_DELAY = 2;
const WAIT_TIME_INIT = 3000;
const WAIT_TIME_RB_OPERATION = 1000;

let susUsers = [];
let willReport = true;
let willBlock = true;
let willAutoScrollAndScan = false;
let willAutoReportAndBlock = false;

if (window.location.search.includes('willReport=false')) {
  willReport = false;
}
if (window.location.search.includes('willBlock=false')) {
  willBlock = false;
}

setTimeout(async () => {
  if (confirmStart()) {
    willAutoScrollAndScan = confirmWithhAutoScrollAndScan();
    if (willAutoScrollAndScan) {
      if (willReport || willBlock) {
        willAutoReportAndBlock = confirmWillAutoBlock();
      }
      collectAndFindBotsOnInterval();
    } else {
      if (willReport || willBlock) {
        willAutoReportAndBlock = confirmWillAutoBlock();
      }
      collectAndFindBots();
      setTimeout(() => openSusUsers(), WAIT_TIME_RB_OPERATION);
    }
  }
}, WAIT_TIME_INIT);

function confirmStart() {
  return confirm(`[X/Twitter Spam Bots Scanner]\nLooks like you're in X/Twitter's notification page. Would you like to begin scanning, report${willReport ? '' : ' (disabled)'} and block${willBlock ? '' : ' (disabled)'} spam bots?`);
}

function confirmWithhAutoScrollAndScan() {
  return confirm(`Auto-scroll the page for ${MAX_INTERVAL * INTERVAL_DELAY}s to check for spam bots?
    \nIf "cancel" is selected, scanning will only be carried out on the current visible list.`);
}

function confirmWillAutoBlock() {
  return confirm(`Auto report and block the spam bots account?
    \nWarning: This feature is still in early stage, and spam bots account validation may not be 100% accurate.`);
}

function collectAndFindBotsOnInterval() {
  collectAndFindBots();

  let intervalCount = MAX_INTERVAL;
  let lastScrollHeight = 0;
  const interval = setInterval(() => {
    if (intervalCount <= 0) {
      console.log('Scan complete');
      clearInterval(interval);
      setTimeout(() => openSusUsers(), WAIT_TIME_RB_OPERATION);
      return;
    }

    window.scrollTo(0, document.body.scrollHeight);
    lastScrollHeight = document.body.scrollHeight;

    collectAndFindBots();
    --intervalCount;
  }, 1000 * INTERVAL_DELAY); // Adjust the time as needed
}

function collectAndFindBots() {
  const links = document.querySelectorAll('a');
  for (let a = 0; a < links.length; ++a) {
    const link = links[a];
    // If it's not a twitter link, ignore it
    if (!link.href.includes(BASE_URL)
      // If it's already added, skip it
      || susUsers.indexOf(link.href) >= 0) {
      continue;
    }

    // Format href to remove BASE_URL
    const url = link.href.replace(BASE_URL, '');
    const splits = url.split('/');
    // Only take in link with one path segment (likely a username?)
    if (!splits?.length || splits?.length > 1) {
      continue;
    }

    const username = splits[0];
    if (isUserABot(username)) {
      susUsers.push(link.href);
    }
  }
}

function openSusUsers() {
  let message = `Found ${susUsers.length} potential spam bots:`;
  susUsers.forEach(s => {
    message += `\n- ${s}`;
  });

  if (willReport || willBlock) {
    console.log(message);
    susUsers.forEach(s => {
      window.open(`${s}?autoRNB=${willAutoReportAndBlock ? 'true' : 'false'}&willReport=${willReport}&willBlock=${willBlock}`);
    });
  } else {
    alert(message);
  }
}