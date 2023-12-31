import { createLogger } from "@saleor/apps-shared";
import {
  WebhookProductFragment,
  WebhookProductVariantFragment,
} from "../../../../generated/graphql";
import { ContentfulProviderConfig } from "../../configuration";
import { ProductWebhooksProcessor } from "../../webhooks-operations/product-webhooks-processor";
import { ContentfulClient } from "./contentful-client";

export type ContentfulClientStrip = Pick<
  ContentfulClient,
  "upsertProductVariant" | "deleteProductVariant"
>;

export type ContentfulClientFactory = (
  config: ContentfulProviderConfig.FullShape
) => ContentfulClientStrip;

export class ContentfulWebhooksProcessor implements ProductWebhooksProcessor {
  private client: ContentfulClientStrip;
  private logger = createLogger({ name: "ContentfulWebhooksProcessor" });

  constructor(
    private providerConfig: ContentfulProviderConfig.FullShape,
    clientFactory: ContentfulClientFactory = () =>
      new ContentfulClient({
        accessToken: providerConfig.authToken,
        space: providerConfig.spaceId,
      })
  ) {
    this.client = clientFactory(providerConfig);
  }

  async onProductVariantUpdated(productVariant: WebhookProductVariantFragment): Promise<void> {
    this.logger.trace("onProductVariantUpdated called");

    await this.client.upsertProductVariant({
      configuration: this.providerConfig,
      variant: productVariant,
    });
  }
  async onProductVariantCreated(productVariant: WebhookProductVariantFragment): Promise<void> {
    this.logger.trace("onProductVariantCreated called");

    await this.client.upsertProductVariant({
      configuration: this.providerConfig,
      variant: productVariant,
    });
  }
  async onProductVariantDeleted(productVariant: WebhookProductVariantFragment): Promise<void> {
    this.logger.trace("onProductVariantDeleted called");

    await this.client.deleteProductVariant({
      configuration: this.providerConfig,
      variant: productVariant,
    });
  }

  async onProductUpdated(product: WebhookProductFragment): Promise<void> {
    this.logger.trace("onProductUpdated called");

    await Promise.all(
      (product.variants ?? []).map((variant) => {
        return this.client.upsertProductVariant({
          configuration: this.providerConfig,
          variant: {
            id: variant.id,
            name: variant.name,
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
            },
          },
        });
      })
    );
  }
}
