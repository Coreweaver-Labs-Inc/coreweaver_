import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const pilotHostname = 'pilot.coreweaver.io';
const hostingerApi = 'https://developers.hostinger.com';
const [archivePath] = process.argv.slice(2);
const apiKey = process.env.HOSTINGER_API_KEY;
const username = process.env.PILOT_HOSTINGER_USERNAME;

if (process.env.PILOT_PUBLISH_ENABLED !== 'true') {
  throw new Error('Refusing pilot deployment: PILOT_PUBLISH_ENABLED must equal true.');
}
if (!archivePath || !apiKey || !username) {
  throw new Error('Expected archive path plus HOSTINGER_API_KEY and PILOT_HOSTINGER_USERNAME.');
}

const archive = await readFile(archivePath);
const archiveName = basename(archivePath);
const apiHeaders = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Accept: 'application/json' };

const uploadCredentialResponse = await fetch(`${hostingerApi}/api/hosting/v1/files/upload-urls`, {
  method: 'POST', headers: apiHeaders, body: JSON.stringify({ username, domain: pilotHostname })
});
if (!uploadCredentialResponse.ok) throw new Error(`Hostinger upload credential request failed with HTTP ${uploadCredentialResponse.status}.`);
const uploadCredentialPayload = await uploadCredentialResponse.json();
const uploadCredential = uploadCredentialPayload.data ?? uploadCredentialPayload;
if (![uploadCredential.url, uploadCredential.auth_key, uploadCredential.rest_auth_key].every((value) => typeof value === 'string' && value.length > 0)) {
  throw new Error('Hostinger returned incomplete temporary upload credentials.');
}

const target = new URL(uploadCredential.url);
target.pathname = `${target.pathname.replace(/\/$/, '')}/${encodeURIComponent(archiveName)}`;
target.searchParams.set('override', 'true');
const tusHeaders = { 'X-Auth': uploadCredential.auth_key, 'X-Auth-Rest': uploadCredential.rest_auth_key, 'Tus-Resumable': '1.0.0' };

const initialize = await fetch(target, {
  method: 'POST', headers: { ...tusHeaders, 'Upload-Length': String(archive.length), 'Upload-Offset': '0' }
});
if (initialize.status !== 201) throw new Error(`Hostinger TUS initialization returned HTTP ${initialize.status}.`);

const upload = await fetch(target, {
  method: 'PATCH',
  headers: { ...tusHeaders, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': '0' },
  body: archive
});
if (upload.status !== 204 || upload.headers.get('upload-offset') !== String(archive.length)) {
  throw new Error(`Hostinger TUS upload did not confirm the full archive length (${archive.length}).`);
}

const deploy = await fetch(`${hostingerApi}/api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${pilotHostname}/deploy`, {
  method: 'POST', headers: apiHeaders, body: JSON.stringify({ archive_path: archiveName })
});
if (!deploy.ok) throw new Error(`Hostinger pilot deployment request failed with HTTP ${deploy.status}.`);

process.stdout.write(JSON.stringify({ deployed: true, hostname: pilotHostname, archiveName, bytes: archive.length }) + '\n');
