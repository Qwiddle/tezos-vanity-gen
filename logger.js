import chalk from 'chalk';
import { vanityASCII } from './config.js';

export class Logger {
  constructor() {
    this.log({ header: `${vanityASCII}\n` });
  }

  log({ header, message = '' }) {
    this.#writeProgress({ header, message })
  }

  #writeProgress({ header, message }) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${chalk.yellow(header)}${message}`);
  }
}