/** ChatRequest */
export interface ChatRequest {
  /** Question */
  question: string;
  /** Session Id */
  session_id?: string | null;
}

/** ChatResponse */
export interface ChatResponse {
  /** Answer */
  answer: string;
  /** Session Id */
  session_id?: string | null;
}

/** GenerateTestimonialsResponse */
export interface GenerateTestimonialsResponse {
  /** Message */
  message: string;
  /** Testimonial Count */
  testimonial_count: number;
  /** Storage Key */
  storage_key: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** Testimonial */
export interface Testimonial {
  /** Quote */
  quote: string;
  /** Author */
  author: string;
  /** Company */
  company: string;
  /** Role */
  role: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type GenerateAndStoreTestimonialsData = GenerateTestimonialsResponse;

/** Response Get Testimonials */
export type GetTestimonialsData = Testimonial[];

export type HandleChatMessageData = ChatResponse;

export type HandleChatMessageError = HTTPValidationError;
