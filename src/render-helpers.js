function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function nl2br(value) {
  return String(value ?? '').replace(/\n/g, '<br />\n');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

module.exports = { esc, nl2br, pad2 };
