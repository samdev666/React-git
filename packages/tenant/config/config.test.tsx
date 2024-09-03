import React from "react";
import { isApplicableFeatureLevel, FeatureLevel } from "../config";

describe("isApplicableFeatureLevel", () => {
  it("returns true when the given level is equal to or higher than the config feature level", () => {
    const configFeatureLevel = FeatureLevel.development;
    expect(isApplicableFeatureLevel(configFeatureLevel)).toBe(false);
    expect(isApplicableFeatureLevel(FeatureLevel.development)).toBe(false);
    expect(isApplicableFeatureLevel(FeatureLevel.production)).toBe(true);
  });

  it("returns false when the given level is lower than the config feature level", () => {
    expect(isApplicableFeatureLevel(FeatureLevel.development)).toBe(false);
  });
});

describe("environmental variables", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("sets up dev env", () => {
    process.env.ENV_NAME = "dev";
    const configModule = require("../config");
    expect(configModule.config.featureLevel).toBe(FeatureLevel.development);
  });

  it("sets up prod env", () => {
    process.env.ENV_NAME = "prod";
    const configModule = require("../config");
    expect(configModule.config.featureLevel).toBe(FeatureLevel.production);
  });

  it("sets up stage env", () => {
    process.env.ENV_NAME = "stage";
    const configModule = require("../config");
    expect(configModule.config.featureLevel).toBe(FeatureLevel.staging);
  });

  it("sets up default/wrong env as staging", () => {
    process.env.ENV_NAME = "xcsdfs";
    const configModule = require("../config");
    expect(configModule.config.featureLevel).toBe(FeatureLevel.staging);
  });
});