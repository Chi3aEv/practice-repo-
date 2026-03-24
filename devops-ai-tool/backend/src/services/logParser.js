const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG'];

function parseLogLine(line) {
  const timestampRegex = /(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2})/;
  const levelRegex = new RegExp(`(${LOG_LEVELS.join('|')})`);

  const timestamp = (line.match(timestampRegex) || [])[1] || null;
  const level = (line.match(levelRegex) || [])[1] || 'INFO';
  const message = line.replace(timestampRegex, '').replace(levelRegex, '').trim();

  return { timestamp, level, message, raw: line };
}

function parseLogs(rawLogs) {
  const lines = rawLogs.split('\n').filter(l => l.trim());
  const parsed = lines.map(parseLogLine);

  return {
    total: parsed.length,
    errors: parsed.filter(l => l.level === 'ERROR').length,
    warnings: parsed.filter(l => l.level === 'WARN').length,
    entries: parsed,
  };
}

module.exports = { parseLogs, parseLogLine };
