import fs from 'fs';
import path from 'path';
import { StateManager } from './StateManager.js';

const ARTIFACTS_DIR = path.resolve(process.cwd(), 'artifacts');

export class ArtifactTracker {
  static ensureArtifactsDir() {
    if (!fs.existsSync(ARTIFACTS_DIR)) {
      fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    }
  }

  static recordArtifact({ runId, stageId, name, filePath, type }) {
    this.ensureArtifactsDir();
    const hash = fs.existsSync(filePath) ? StateManager.computeFileHash(filePath) : null;
    const metadata = {
      runId,
      stageId,
      name,
      filePath: path.relative(process.cwd(), filePath),
      type,
      hash,
      timestamp: new Date().toISOString()
    };

    const recordFile = path.join(ARTIFACTS_DIR, `${runId}_artifacts.json`);
    let records = [];
    if (fs.existsSync(recordFile)) {
      try {
        records = JSON.parse(fs.readFileSync(recordFile, 'utf-8'));
      } catch (e) {}
    }
    records.push(metadata);
    fs.writeFileSync(recordFile, JSON.stringify(records, null, 2), 'utf-8');
    return metadata;
  }
}
