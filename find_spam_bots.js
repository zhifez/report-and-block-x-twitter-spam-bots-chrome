const BASE_URL = 'https://twitter.com/';
const MAX_INTERVAL = 15;
const INTERVAL_DELAY = 2;

let susUsers = [];
let willAutoScrollAndScan = false;
let willAutoBlock = false;

setTimeout(async () => {
  if (confirmStart()) {
    willAutoScrollAndScan = confirmWithhAutoScrollAndScan();
    if (willAutoScrollAndScan) {
      willAutoBlock = confirmWillAutoBlock();
      collectAndFindBotsOnInterval();
    } else {
      willAutoBlock = confirmWillAutoBlock();
      collectAndFindBots();
    }
  }
}, 2000);

function confirmStart() {
  return confirm(`[xTwitter] It seems like you're in X/Twitter's notification page. Would you like to begin scanning, report and block spam bots?`);
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
      openSusUsers();
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
  console.log(`Found ${susUsers.length} sus users.`);
  if (susUsers.length > 0) {
    susUsers.forEach(s => {
      window.open(`${s}?${willAutoBlock ? 'autoblock' : 'block'}`);
    });
  }
}