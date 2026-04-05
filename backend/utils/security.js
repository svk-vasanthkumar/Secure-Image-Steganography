const attempts = {};

function checkAttempts(ip) {
  if (!attempts[ip]) {
    attempts[ip] = 0;
  }

  if (attempts[ip] >= 3) {
    return false;
  }

  return true;
}

function recordFailure(ip) {
  attempts[ip] = (attempts[ip] || 0) + 1;
}

function resetAttempts(ip) {
  attempts[ip] = 0;
}

module.exports = { checkAttempts, recordFailure, resetAttempts };