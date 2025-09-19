import jwt from "jsonwebtoken";
import nodeJose from "node-jose";
import { Client, Issuer, TokenSet, ClientAuthMethod } from "openid-client";
import { v4 as uuid } from "uuid";
import config from "./config.js";

const client = async (): Promise<Client> => {
  const tokenxConfig = config.tokenxConfig;

  if (!tokenxConfig.discoveryUrl) {
    throw new Error("TOKEN_X_WELL_KNOWN_URL is required");
  }
  if (!tokenxConfig.privateJwk) {
    throw new Error("TOKEN_X_PRIVATE_JWK is required");
  }
  if (!tokenxConfig.clientID) {
    throw new Error("TOKEN_X_CLIENT_ID is required");
  }

  const issuer = await Issuer.discover(tokenxConfig.discoveryUrl);
  const jwk = JSON.parse(tokenxConfig.privateJwk);
  return new issuer.Client(
    {
      client_id: tokenxConfig.clientID,
      token_endpoint_auth_method:
        tokenxConfig.tokenEndpointAuthMethod as ClientAuthMethod,
      token_endpoint_auth_signing_alg: tokenxConfig.tokenEndpointAuthSigningAlg,
    },
    { keys: [jwk] }
  );
};

const getTokenExchangeAccessToken = async (
  tokenxClient: Client,
  bearerToken: string,
  backendAudience: string
): Promise<string> => {
  let backendTokenSet: TokenSet | undefined = undefined;
  const now = Math.floor(Date.now() / 1000);

  if (!config.tokenxConfig.endpoint) {
    throw new Error("TOKEN_X_TOKEN_ENDPOINT is required");
  }

  const additionalClaims = {
    clientAssertionPayload: {
      nbf: now,
      aud: [config.tokenxConfig.endpoint],
    },
  };
  const audience = config.tokenxConfig.endpoint;
  const assertionToken = await createClientAssertion(audience);
  backendTokenSet = await tokenxClient.grant(
    {
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: assertionToken,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      audience: backendAudience,
      subject_token: bearerToken,
    },
    additionalClaims
  );

  return backendTokenSet.access_token!;
};

const createClientAssertion = async (audience: string): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);

  if (!config.tokenxConfig.clientID) {
    throw new Error("TOKEN_X_CLIENT_ID is required");
  }
  if (!config.tokenxConfig.privateJwk) {
    throw new Error("TOKEN_X_PRIVATE_JWK is required");
  }

  const payload = {
    sub: config.tokenxConfig.clientID,
    iss: config.tokenxConfig.clientID,
    aud: audience,
    jti: uuid(),
    nbf: now,
    iat: now,
    exp: now + 60, // max 120
  };

  const key = await asKey(config.tokenxConfig.privateJwk);

  const options: jwt.SignOptions = {
    algorithm: "RS256",
    header: {
      kid: key.kid,
      typ: "JWT",
      alg: "RS256",
    },
  };

  return jwt.sign(payload, key.toPEM(true), options);
};

const asKey = async (jwk: string): Promise<nodeJose.JWK.Key> => {
  if (!jwk) {
    console.log("JWK Mangler");
    throw Error("JWK Mangler");
  }

  return nodeJose.JWK.asKey(jwk).then((key: nodeJose.JWK.Key) => {
    return Promise.resolve(key);
  });
};

export default { client, getTokenExchangeAccessToken };
