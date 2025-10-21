import pino, { DestinationStream, LoggerOptions } from "pino";

const createLogger = (
  defaultConfig: LoggerOptions = {},
  destination?: DestinationStream,
): pino.Logger =>
  pino(
    {
      ...defaultConfig,
      timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
      messageKey: "message",
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
        log: (object: Record<string, unknown>) => {
          if (object.err instanceof Error) {
            const err = pino.stdSerializers.err(object.err);
            object.stack_trace = err.stack;
            object.type = err.type;
            object.message = err.message;
            delete object.err;
          }

          return object;
        },
      },
    },
    destination,
  );

export const logger = createLogger();
