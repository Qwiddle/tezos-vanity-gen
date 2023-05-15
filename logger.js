import chalk from 'chalk';
import { vanityASCII } from './config.js';
import { createInterface } from 'readline';

export class Logger {
  constructor() {
    this.log({ header: `${vanityASCII}\n` });

    this.readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  log({ header, message = '' }) {
    this.#writeProgress({ header, message })
  }

  error({ header, message = '' }) {
    this.#writeError({ header, message })
  }

  #writeProgress({ header, message }) {
    process.stdout.clearLine(1);
    process.stdout.cursorTo(0);
    process.stdout.write(`${chalk.yellow(header)}${message}`);
  }

  #writeError({ header, message }) {
    console.error(`${chalk.yellow(header)}\n${message}`);
  }

  clear() {
    process.stdout.moveCursor(0, -8) 
    process.stdout.clearScreenDown();
    process.stdout.cursorTo(0);
  }

  readLineAsync({ message }) {
    return new Promise(resolve => {
      this.readline.question(message, userRes => {
        resolve(userRes);
      });
    });
  }
}