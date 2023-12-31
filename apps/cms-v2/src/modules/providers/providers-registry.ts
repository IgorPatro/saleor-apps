import { BuilderIo } from "./builder.io/builder-io";
import { Contentful } from "./contentful/contentful";
import { Datocms } from "./datocms/datocms";
import { Strapi } from "./strapi/strapi";

export type CMS = typeof Contentful | typeof Datocms | typeof Strapi | typeof BuilderIo;

export type CMSType = CMS["type"];

export const cmsTypes = [Contentful.type, Datocms.type, Strapi.type, BuilderIo.type] as const;

export const CMSProviders = [Contentful, Datocms, Strapi, BuilderIo] as const;
