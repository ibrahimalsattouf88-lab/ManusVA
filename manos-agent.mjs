
import fetch from 'node-fetch';

const MANOS_API_URL = process.env.MANOS_API_URL || 'https://api.manus.in/v1';
const AUTH = process.env.MANOS_API_KEY ? `Bearer ${process.env.MANOS_API_KEY}` : null;

console.log('Manos Agent started.');
console.log('MANOS_API_URL:', MANOS_API_URL);
console.log('Authorization:', AUTH ? 'set' : 'missing');

async function poll(){
  try{
    // placeholder polling
    const res = await fetch(MANOS_API_URL + '/ops/poll', {
      headers: AUTH ? { Authorization: AUTH } : {}
    });
    console.log('poll status', res.status);
  }catch(e){
    console.log('poll error', e.message);
  }
}
setInterval(poll, 5000);
