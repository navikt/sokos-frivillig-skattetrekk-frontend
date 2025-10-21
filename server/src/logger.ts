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
            return {
              ...object,
              stack_trace: err.stack,
              type: err.type,
              message: err.message,
              err: undefined,
            };
          }

          return object;
        },
      },
    },
    destination,
  );

export const logger = createLogger();
