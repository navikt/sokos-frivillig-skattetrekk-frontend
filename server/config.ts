import dotenv from "dotenv";

dotenv.config();

interface TokenXConfig {
  discoveryUrl?: string;
  clientID?: string;
  privateJwk?: string;
  endpoint?: string;
  tokenEndpointAuthMethod: string;
  tokenEndpointAuthSigningAlg: string;
}

const tokenxConfig: TokenXConfig = {
  discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
  clientID: process.env.TOKEN_X_CLIENT_ID,
  privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
  endpoint: process.env.TOKEN_X_TOKEN_ENDPOINT,
  tokenEndpointAuthMethod: "private_key_jwt",
  tokenEndpointAuthSigningAlg: "RS256",
};

export default { tokenxConfig };
