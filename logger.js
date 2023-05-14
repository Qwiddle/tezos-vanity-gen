import chalk from 'chalk';
import { vanityASCII } from './config.js';

export class Logger {
  constructor() {
    this.log({ header: `${vanityASCII}\n` });
  }

  log({ header, message = '' }) {
    this.#writeProgress({ header, message })
  }

  error({ header, message = '' }) {
    this.#writeError({ header, message })
  }

  #writeProgress({ header, message }) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${chalk.yellow(header)}${message}`);
  }

  #writeError({ header, message }) {
    console.error(`${chalk.yellow(header)}\n${message}`);
  }
}