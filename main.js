const REGEX_DIGITS_EXTRACTION = /\d+/g;
const REGEX_SPAM_USERNAME_REQS = [
  /^(?=(?:[^a-z]*[a-z]){2})(?=(?:[^A-Z]*[A-Z]){2})(?=(?:\D*\d){6}).*$/, // e.g. NAoKI123456
  /^(?=(?:[^a-z]*[a-z]){1})(?=(?:[^A-Z]*[A-Z]){3})(?=(?:\D*\d){6}).*$/, // e.g. NAOki123456
  /^(?=(?:[^a-z]*[a-z]){1})(?=(?:[^A-Z]*[A-Z]){1})(?=(?:\D*\d){7}).*$/, // e.g. naoki1234567
  /^(?=(?:[^a-z]*[a-z]){1})(?=(?:[^A-Z]*[A-Z]){5})(?=(?:\D*\d){4}).*$/, // e.g. NAOKImao1234
];
const MAX_SUS_DIGITS = 6;

function isUserABot(username) {
  // Extract the digits
  const matches = username.match(REGEX_DIGITS_EXTRACTION);

  // If username doesn't contain digits, high chance it's not a spam bot
  if (matches?.length) {
    const digits = matches[0];
    // If no of digits is more than MAX_SUS_DIGITS, then it's likely a bot
    if (digits.length > MAX_SUS_DIGITS) {
      return true;
    } else if (digits.length === MAX_SUS_DIGITS) {
      // If digits are equal to range, it might be a date, try parsing it
      // If it can't be parsed, then it's likely a bot
      if (isNaN(Date.parse(digits))) {
        return true;
      }
    } else {
      // If username fits all the other spam requirements, then it's likely a spam bot
      if (isUsernameFitsSpamReq(username)) {
        return true;
      }
    }
  }
  return false;
}

function isUsernameFitsSpamReq(username) {
  for (let a = 0; a < REGEX_SPAM_USERNAME_REQS.length; ++a) {
    if (REGEX_SPAM_USERNAME_REQS[a].test(username)) {
      return true;
    }
  }
  return false;
}