export enum FeatureLevel {
  production = "production",
  staging = "staging",
  development = "development",
}

export interface Config {
  featureLevel: FeatureLevel;
  apiHost: string;
  baseImageUrl: string;
}

const featureLevelValue = Object.freeze({
  development: 0,
  staging: 1,
  production: 2,
});

const prod: Config = Object.freeze({
  featureLevel: FeatureLevel.production,
  apiHost: "https://api-stg.wizehub.co",
  baseImageUrl: "https://d26eldlo0tejki.cloudfront.net",
});

const stage: Config = Object.freeze({
  featureLevel: FeatureLevel.staging,
  apiHost: "https://api-stg.wizehub.co",
  baseImageUrl: "https://d26eldlo0tejki.cloudfront.net",
});

const dev: Config = Object.freeze({
  featureLevel: FeatureLevel.development,
  apiHost: "https://api-dev.wizehub.co",
  baseImageUrl: "https://d26eldlo0tejki.cloudfront.net",
});

const local: Config = Object.freeze({
  featureLevel: FeatureLevel.staging,
  apiHost: "https://api-dev.wizehub.co",
  baseImageUrl: "https://d26eldlo0tejki.cloudfront.net",
});

let env: Config;

switch (process.env.ENV_NAME) {
  case "prod":
    env = { ...prod };
    break;
  case "stage":
    env = { ...stage };
    break;
  case "dev":
    env = { ...dev };
    break;
  default:
    env = { ...local };
    break;
}

export const config = Object.freeze({ ...env });
export const isApplicableFeatureLevel = (level: FeatureLevel): boolean =>
  featureLevelValue[config.featureLevel] <= featureLevelValue[level];
