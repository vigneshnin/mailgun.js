import urljoin from 'url-join';
import { WebhooksIds } from '../Enums';
import { IWebHooksClient } from '../Interfaces/Webhooks';

import {
  WebhookValidationResponse,
  WebhookList,
  WebhookResponse,
  WebhooksQuery,
  WebhookResult
} from '../Types/Webhooks';
import Request from './common/Request';

export class Webhook implements WebhookResult {
  id: string;
  url: string | undefined;

  constructor(id: string, url: string | undefined) {
    this.id = id;
    this.url = url;
  }
}

export default class WebhooksClient implements IWebHooksClient {
  request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  private _parseWebhookList(response: { body: { webhooks: WebhookList } }): WebhookList {
    return response.body.webhooks;
  }

  _parseWebhookWithID(id: string) {
    return function (response: WebhookResponse): WebhookResult {
      const webhookResponse = response?.body?.webhook;
      let url = webhookResponse?.url;
      if (!url) {
        url = webhookResponse?.urls && webhookResponse.urls.length
          ? webhookResponse.urls[0]
          : undefined;
      }
      return new Webhook(id, url);
    };
  }

  private _parseWebhookTest(response: { body: { code: number, message: string } })
  : {code: number, message:string} {
    return {
      code: response.body.code,
      message: response.body.message
    } as WebhookValidationResponse;
  }

  list(domain: string, query: WebhooksQuery): Promise<WebhookList> {
    return this.request.get(urljoin('/v3/domains', domain, 'webhooks'), query)
      .then(this._parseWebhookList);
  }

  get(domain: string, id: WebhooksIds): Promise<WebhookResult> {
    return this.request.get(urljoin('/v3/domains', domain, 'webhooks', id))
      .then(this._parseWebhookWithID(id));
  }

  create(domain: string,
    id: string,
    url: string,
    test = false): Promise<WebhookResult | WebhookValidationResponse> {
    if (test) {
      return this.request.putWithFD(urljoin('/v3/domains', domain, 'webhooks', id, 'test'), { url })
        .then(this._parseWebhookTest);
    }

    return this.request.postWithFD(urljoin('/v3/domains', domain, 'webhooks'), { id, url })
      .then(this._parseWebhookWithID(id));
  }

  update(domain: string, id: string, url: string): Promise<WebhookResult> {
    return this.request.putWithFD(urljoin('/v3/domains', domain, 'webhooks', id), { url })
      .then(this._parseWebhookWithID(id));
  }

  destroy(domain: string, id: string) : Promise<WebhookResult> {
    return this.request.delete(urljoin('/v3/domains', domain, 'webhooks', id))
      .then(this._parseWebhookWithID(id));
  }
}
