import { generateMnemonic, mnemonicToSeed } from 'bip39';
import _sodium from 'libsodium-wrappers-sumo';
import { b58cencode, prefix } from '@taquito/utils';
import chalk from 'chalk';
import { Logger } from './logger.js';

const generateKeys = async ({ mnemonic, sodium }) => {
  const seed = (await mnemonicToSeed(mnemonic)).slice(0, 32);
  const kp = sodium.crypto_sign_seed_keypair(seed);

  const secretKey = b58cencode(kp.privateKey, prefix.edsk);
  const publicKey = b58cencode(kp.publicKey, prefix.edpk);
  const publicKeyHash = b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1);

  return {
    mnemonic,
    secretKey,
    publicKey,
    publicKeyHash,
  }
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

const findHashes = async ({ logger, searchTerm }) => {
  let ticks = 0;

  await _sodium.ready;
  const sodium = _sodium;

  const tick = async () => {
    ticks++;

    const mnemonic = generateMnemonic();
    const keys = await generateKeys({ mnemonic, sodium });  

    //only supports tz1 prefix for now
    const toFind = 'tz1' + searchTerm;

    logger.log({ 
      header: 'Progress: ', 
      message: `${chalk.green(ticks + ' keys checked')}`
    });
  
    if(keys.publicKeyHash.indexOf(toFind) === -1) {
      // no match found, next tick
      setImmediate(tick);
    } else {
      const mnemonic = `${chalk.green('Mnemonic:')} ${keys.mnemonic}`;
      const secretKey = `${chalk.green('Secret key:')} ${keys.secretKey}`;
      const publicKey = `${chalk.green('Public key:')} ${keys.publicKey}`;
      const publicKeyHash = `${chalk.green('Address:')} ${keys.publicKeyHash}`;

      logger.log({
        header: `Match found after checking ${ticks} hashes.\n`, 
        message: `${publicKeyHash}\n${mnemonic}\n${secretKey}\n${publicKey}\n`,
      })
    }
  }
  
  tick();
}

main();