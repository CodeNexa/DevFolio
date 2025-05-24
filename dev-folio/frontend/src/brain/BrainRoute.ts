import {
  ChatRequest,
  CheckHealthData,
  GenerateAndStoreTestimonialsData,
  GetTestimonialsData,
  HandleChatMessageData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Generates 5-6 diverse testimonials using OpenAI and stores them in Databutton storage.
   * @tags Testimonials, dbtn/module:testimonial_generator
   * @name generate_and_store_testimonials
   * @summary Generate And Store Testimonials
   * @request POST:/routes/testimonials/generate-testimonials
   */
  export namespace generate_and_store_testimonials {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateAndStoreTestimonialsData;
  }

  /**
   * @description Retrieves the stored testimonials.
   * @tags Testimonials, dbtn/module:testimonial_generator
   * @name get_testimonials
   * @summary Get Testimonials
   * @request GET:/routes/testimonials/view-testimonials
   */
  export namespace get_testimonials {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTestimonialsData;
  }

  /**
   * No description
   * @tags Chatbot, dbtn/module:chatbot_api
   * @name handle_chat_message
   * @summary Handle Chat Message
   * @request POST:/routes/chatbot/chat
   */
  export namespace handle_chat_message {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChatRequest;
    export type RequestHeaders = {};
    export type ResponseBody = HandleChatMessageData;
  }
}
