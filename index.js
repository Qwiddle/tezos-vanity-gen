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

const findHashes = async ({ logger, searchTerm }) => {
  let ticks = 0;

  await _sodium.ready;
  const sodium = _sodium;

  const tick = async () => {
    ticks++;

    logger.log({ 
      header: 'Progress: ', 
      message: `${chalk.green(ticks + ' keys checked')}`
    });
    
    //only supports tz1 prefix for now
    const toFind = 'tz1' + searchTerm;

    const keys = generateKeys({ sodium });  
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
      })
    }
  }
  
  tick();
}

const main = async () => {
  const logger = new Logger();

  if(process.argv.length < 3) {
    logger.error({ 
      header: 'Please enter a search term.', 
      message: 'Usage: yarn start <search term>' 
    });

    process.exit(1)
  }

  const searchTerm = process.argv[2];
  await findHashes({ logger, searchTerm });
}

main();