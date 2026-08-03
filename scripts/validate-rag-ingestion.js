#!/usr/bin/env node

const fs = require('fs');

const read = path => fs.readFileSync(path, 'utf8');
const fail = message => {
    console.error(`RAG ingestion validation failed: ${message}`);
    process.exit(1);
};
const need = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const ingestion = read('rag/ingestion.py');
[
    'CREATE TABLE IF NOT EXISTS ingestion_runs',
    'CREATE TABLE IF NOT EXISTS ingestion_pages',
    'def bootstrap_legacy_state',
    'def first_missing_final_page',
    'def next_page',
    "status IN ('error', 'empty')",
    'def quality_score',
    'def ingestion_status'
].forEach(token => need(ingestion, token, 'rag/ingestion.py'));

const pipeline = read('rag/ingest_kutub.py');
[
    'AtharResearchBot/3.0',
    'robots.txt',
    'def discover_pages',
    'def ingest_page',
    'def ingest_book',
    'def is_page_duplicate',
    'def chunk_exists_by_hash',
    'kutub_ai_unreviewed',
    'ingestion_pipeline": "kutub-v3"',
    'start_run(',
    'finish_run(',
    'sync-kutub.bat'
].forEach(token => need(pipeline, token, 'rag/ingest_kutub.py'));
if (/captcha.*bypass|cloudflare.*bypass|selenium|playwright/i.test(pipeline)) {
    fail('The crawler must never include anti-bot bypass logic.');
}

const server = read('rag/server.py');
[
    'AtharRAG/2.2',
    'from ingestion import ingestion_status',
    'if path == "/api/rag/v2/ingestion"',
    '"ingestion": ingestion_status(connection)',
    'average_quality'
].forEach(token => need(server, token, 'rag/server.py'));

const batch = read('sync-kutub.bat');
[
    'rag\\ingest_kutub.py sync --batch-size 25',
    'rag\\ingest_kutub.py status',
    'ATHAR_BOT_CONTACT',
    'requirements.txt'
].forEach(token => need(batch, token, 'sync-kutub.bat'));
if (/http\.server/i.test(batch)) fail('The ingestion launcher must not start a static server.');

const statusBatch = read('status-kutub.bat');
need(statusBatch, 'rag\\ingest_kutub.py status', 'status-kutub.bat');

const docs = read('RAG_INGESTION.md');
[
    'robots.txt',
    'duplicate',
    'kutub_ai_unreviewed',
    '/api/rag/v2/ingestion',
    'ne tente jamais de contourner'
].forEach(token => need(docs, token, 'RAG_INGESTION.md'));

console.log('RAG ingestion statically validated: durable state, gap-aware resume, deduplication, API status and respectful crawler policy.');
