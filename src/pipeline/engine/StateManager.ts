import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const STATE_FILE = path.resolve(process.cwd(), '.agent/state/run_history.json');

export interface RunRecord {
  runId: string;
  workflowId?: string;
  workflow?: string;
  status: string;
  failedStage?: string;
  error?: string;
  timestamp?: string;
  startTime?: string;
  completedStages?: string[];
  context?: any;
}

export class StateManager {
  static ensureStateFile(): void {
    const dir = path.dirname(STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(STATE_FILE)) {
      fs.writeFileSync(STATE_FILE, JSON.stringify({ runs: [] }, null, 2), 'utf-8');
    }
  }

  static getHistory(): { runs: RunRecord[] } {
    this.ensureStateFile();
    try {
      const content = fs.readFileSync(STATE_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      return { runs: [] };
    }
  }

  static saveRun(runRecord: RunRecord): void {
    const history = this.getHistory();
    history.runs.unshift(runRecord);
    if (history.runs.length > 50) history.runs = history.runs.slice(0, 50);
    fs.writeFileSync(STATE_FILE, JSON.stringify(history, null, 2), 'utf-8');
  }

  static recordRun(runRecord: RunRecord): void {
    this.saveRun(runRecord);
  }

  static getRunById(runId: string): RunRecord | undefined {
    const history = this.getHistory();
    return history.runs.find(r => r.runId === runId);
  }

  static computeHash(content: string | Buffer): string {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  static computeFileHash(filePath: string): string | null {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath);
    return this.computeHash(content);
  }
}
