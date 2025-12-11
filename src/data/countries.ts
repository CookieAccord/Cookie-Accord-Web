import data from "./countries.json";

export type CountryRegion = {
  country: string;
  region: string;
};

export const countryRegions: CountryRegion[] = data;
