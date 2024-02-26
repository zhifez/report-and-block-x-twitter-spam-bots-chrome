const pathname = window.location.pathname.replace('/', '');
const isUserABotOverride = window.location.search.includes('autoRNB');
const willAutoRNB = window.location.search.includes('autoRNB=true');
let willReport = true;
let willBlock = true;

if (window.location.search.includes('willReport=false')) {
  willReport = false;
}
if (window.location.search.includes('willBlock=false')) {
  willBlock = false;
}

if (!isUserABot(pathname) && !isUserABotOverride) {
  console.log('User is not a bot, I think.');
} else {
  console.log(`${isUserABotOverride ? '[Override] ' : ''}User is a bot, I think.`);

  let isUserBlocked = false;
  if (document.visibilityState === "hidden") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        if (!isUserBlocked) {
          isUserBlocked = true;
          manualOrAutoBlockUser();
        }
      }
    });
  } else {
    setTimeout(() => {
      manualOrAutoBlockUser();
    }, 3000);
  }
}

function manualOrAutoBlockUser() {
  if (willAutoRNB) {
    runOperation();
    return;
  }

  if (confirm(`User (@${pathname}) is a bot, proceed to report${willReport ? '' : ' (disabled)'} and block${willBlock ? '' : ' (disabled)'} this user?`)) {
    runOperation();
  }
}

function runOperation() {
  if (willReport && willBlock) {
    startReportAndOrBlockUser();
  } else if (willReport && !willBlock) {
    startReportAndOrBlockUser();
  } else if (!willReport && willBlock) {
    startBlockUser();
  } else {
    console.log('Nothing happens');
  }
}

function startReportAndOrBlockUser() {
  const moreButton = document.querySelector('div[aria-label="More"]');
  if (!moreButton) return;

  console.log('Click More button');
  moreButton.click();

  const spans = document.querySelectorAll('span');
  const reportBtn = Array.from(spans).find(span => span.textContent.includes("Report"));
  if (!reportBtn) return;

  console.log('Click report button');
  reportBtn.click();

  setTimeout(() => {
    reportUser();

    if (willBlock) {
      setTimeout(blockUser, 2000);
    } else {
      setTimeout(clickDone, 2000);
    }
  }, 2000);
}

function startBlockUser() {
  const moreButton = document.querySelector('div[aria-label="More"]');
  if (!moreButton) return;

  console.log('Click More button');
  moreButton.click();

  const spans = document.querySelectorAll('span');
  const blockBtn = Array.from(spans).find(span => span.textContent.includes("Block"));
  if (!blockBtn) return;

  console.log('Click block button');
  blockBtn.click();

  // Find and click on the block button in modal
  const modalInnerSpans = document.querySelectorAll('span');
  const blockSpans = Array.from(modalInnerSpans).filter(span => span.textContent.includes("Block"));
  if (!blockSpans?.length) return;

  let nextBlockBtn;
  blockSpans.forEach(span => {
    const targetParent = findTargetParent(span, 4);
    if (targetParent) {
      nextBlockBtn = targetParent;
    }
  });
  if (!nextBlockBtn) return;

  console.log('Click Block button');
  nextBlockBtn.click();
}

function reportUser() {
  const modalDiv = document.querySelector('div[aria-labelledby="modal-header"]');
  const modalSpans = modalDiv.querySelectorAll('span');
  const nextBtn = Array.from(modalSpans).find(span => span.textContent.includes("Next"));
  if (!modalDiv) return;

  const modalInnerDiv = document.querySelector('div[data-viewportview="true"]');
  if (!modalInnerDiv) return;

  console.log('Scroll down on modal');
  modalInnerDiv.scrollTop += 400;

  const modalInnerSpans = modalInnerDiv.querySelectorAll('span');
  const spamSpan = Array.from(modalInnerSpans).find(span => span.textContent.includes("Spam"));
  if (!spamSpan) return;

  console.log('Click Spam button');
  spamSpan.click();

  if (!nextBtn) return;

  console.log('Click Next button');
  nextBtn.click();
}

function blockUser() {
  const modalInnerDiv = document.querySelector('div[data-viewportview="true"]');
  if (!modalInnerDiv) return;

  console.log('Scroll down on modal');
  modalInnerDiv.scrollTop += 300;

  const modalInnerSpans = modalInnerDiv.querySelectorAll('span');
  const blockSpans = Array.from(modalInnerSpans).filter(span => span.textContent.includes("Block"));
  if (!blockSpans?.length) return;

  let blockBtn;
  blockSpans.forEach(span => {
    const targetParent = findTargetParent(span, 4);
    if (targetParent) {
      blockBtn = targetParent;
    }
  });
  if (!blockBtn) return;

  console.log('Click Block button');
  blockBtn.click();

  setTimeout(() => {
    window.close();
  }, 1000);
}

function clickDone() {
  const modalDiv = document.querySelector('div[aria-labelledby="modal-header"]');
  const modalSpans = modalDiv.querySelectorAll('span');
  const doneBtn = Array.from(modalSpans).find(span => span.textContent.includes("Done"));

  if (!doneBtn) return;

  doneBtn.click();
}

// Function to find the parent's parent div with role="button"
function findTargetParent(span, maxHistory) {
  let parentElement = span.parentElement;
  let history = maxHistory;
  // Traverse up to the parent's parent
  while (parentElement && parentElement.parentElement && history > 0) {
    // Check if the parent's parent is a div with role="button"
    if (parentElement.parentElement.tagName === 'DIV' && parentElement.parentElement.getAttribute('role') === 'button') {
      return parentElement.parentElement; // Return the matching parent's parent
    }
    parentElement = parentElement.parentElement; // Move up in the DOM tree
    --history;
  }
  return null; // No matching parent's parent found
}