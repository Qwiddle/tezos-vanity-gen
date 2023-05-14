import chalk from 'chalk';
import _sodium from 'libsodium-wrappers';
import { b58cencode, prefix } from '@taquito/utils';
import { Logger } from './logger.js';

const generateKeys = ({ sodium }) => {
  const kp = sodium.crypto_sign_keypair();

  const secretKey = b58cencode(kp.privateKey, prefix.edsk);
  const publicKey = b58cencode(kp.publicKey, prefix.edpk);
  const publicKeyHash = b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1);

  return {
    secretKey,
    publicKey,
    publicKeyHash,
  }
}

const findHashes = async ({ logger, searchTerm, caseSensitive }) => {
  let ticks = 0;
  let hashesPerSecond = 0;

  await _sodium.ready;
  const sodium = _sodium;

  const countHashesPerSecond = ({ startTicks }) => {
    setTimeout(() => {
      hashesPerSecond = ticks - startTicks;
    }, 1000);
  }

  setInterval(() => countHashesPerSecond({ startTicks: ticks }), 1000);

  const tick = () => {
    ticks++;

    logger.log({ 
      header: 'Progress: ', 
      message: `${chalk.green(ticks + ' keys checked')} \ ${chalk.cyan(hashesPerSecond + ' h/s')}`
    });

    const keys = generateKeys({ sodium });
    
    //only supports tz1 prefix for now
    const toFind = `tz1${caseSensitive ? searchTerm : searchTerm.toLowerCase()}`;

    const pkhToCheck = caseSensitive 
      ? keys.publicKeyHash.substring(0, toFind.length)
      : keys.publicKeyHash.substring(0, toFind.length).toLowerCase();
      
    const isMatch = toFind === keys.publicKeyHash.substring(0, toFind.length);

    if(!isMatch) {
      // no match found, next tick
      setImmediate(tick);    
    } else {
      const secretKey = `${chalk.green('Secret key:')} ${keys.secretKey}`;
      const publicKey = `${chalk.green('Public key:')} ${keys.publicKey}`;
      const publicKeyHash = `${chalk.green('Address:')} ${keys.publicKeyHash}`;

      logger.log({
        header: `Match found after checking ${ticks} hashes.\n`, 
        message: `${publicKeyHash}\n${secretKey}\n${publicKey}\n`,
      });

      process.exit(0);
    }
  }
  
  tick();
}

const main = async () => {
  const logger = new Logger();

  if(process.argv.length < 3) {
    logger.error({ 
      header: 'Please enter a search term.', 
      message: 'Usage: yarn start <search term> [-cs (case sensitive)]' 
    });

    process.exit(1)
  }

  const searchTerm = process.argv[2];
  const caseSensitive = process.argv.indexOf('-cs') !== -1;

  await findHashes({ logger, searchTerm, caseSensitive });
}

main();