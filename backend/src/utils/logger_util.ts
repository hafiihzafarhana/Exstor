import winston, { Logger } from 'winston';

// Level
// error: 0,
// warn: 1,
// info: 2,
// http: 3,
// verbose: 4,
// debug: 5,
// silly: 6

export const winstonLogger = (name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    }
  };

  const logger: Logger = winston.createLogger({
    // Agar tidak exit saat error
    exitOnError: false,
    // Agar dapat mengetahui nama service yang Error
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console)]
  });

  return logger;
};
