import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const STATE_FILE = path.resolve(process.cwd(), '.agent/state/run_history.json');

export class StateManager {
  static ensureStateFile() {
    const dir = path.dirname(STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(STATE_FILE)) {
      fs.writeFileSync(STATE_FILE, JSON.stringify({ runs: [] }, null, 2), 'utf-8');
    }
  }

  static getHistory() {
    this.ensureStateFile();
    try {
      const content = fs.readFileSync(STATE_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      return { runs: [] };
    }
  }

  static saveRun(runRecord) {
    const history = this.getHistory();
    history.runs.unshift(runRecord);
    // Keep last 50 runs
    if (history.runs.length > 50) history.runs = history.runs.slice(0, 50);
    fs.writeFileSync(STATE_FILE, JSON.stringify(history, null, 2), 'utf-8');
  }

  static getRunById(runId) {
    const history = this.getHistory();
    return history.runs.find(r => r.runId === runId);
  }

  static computeHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  static computeFileHash(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath);
    return this.computeHash(content);
  }
}
