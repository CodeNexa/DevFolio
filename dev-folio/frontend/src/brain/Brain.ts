import {
  ChatRequest,
  CheckHealthData,
  GenerateAndStoreTestimonialsData,
  GetTestimonialsData,
  HandleChatMessageData,
  HandleChatMessageError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Generates 5-6 diverse testimonials using OpenAI and stores them in Databutton storage.
   *
   * @tags Testimonials, dbtn/module:testimonial_generator
   * @name generate_and_store_testimonials
   * @summary Generate And Store Testimonials
   * @request POST:/routes/testimonials/generate-testimonials
   */
  generate_and_store_testimonials = (params: RequestParams = {}) =>
    this.request<GenerateAndStoreTestimonialsData, any>({
      path: `/routes/testimonials/generate-testimonials`,
      method: "POST",
      ...params,
    });

  /**
   * @description Retrieves the stored testimonials.
   *
   * @tags Testimonials, dbtn/module:testimonial_generator
   * @name get_testimonials
   * @summary Get Testimonials
   * @request GET:/routes/testimonials/view-testimonials
   */
  get_testimonials = (params: RequestParams = {}) =>
    this.request<GetTestimonialsData, any>({
      path: `/routes/testimonials/view-testimonials`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Chatbot, dbtn/module:chatbot_api
   * @name handle_chat_message
   * @summary Handle Chat Message
   * @request POST:/routes/chatbot/chat
   */
  handle_chat_message = (data: ChatRequest, params: RequestParams = {}) =>
    this.request<HandleChatMessageData, HandleChatMessageError>({
      path: `/routes/chatbot/chat`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
