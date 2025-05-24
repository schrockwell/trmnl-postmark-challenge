import { axios } from "@pipedream/platform";

export default defineComponent({
  name: "Send POST to TRMNL",
  description:
    "Send a POST request to usetrmnl.com API with data from a previous step",
  type: "action",
  props: {
    data: {
      type: "object",
      label: "Data",
      description:
        "The data to send in the POST request. This will typically come from a previous step.",
    },
    transform: {
      type: "boolean",
      label: "Transform Data",
      description: "Whether to transform the data before sending it",
      optional: true,
      default: false,
    },
    transformationFunction: {
      type: "string",
      label: "Transformation Function",
      description:
        "JavaScript function to transform the data. For example: `(data) => ({ ...data, timestamp: Date.now() })`. The function should take the data as input and return the transformed data.",
      optional: true,
    },
    additionalHeaders: {
      type: "object",
      label: "Additional Headers",
      description: "Additional headers to include in the request",
      optional: true,
    },
  },
  async run({ steps, $ }) {
    // Prepare the data to send
    let payload = this.data;

    // Apply transformation if enabled and function provided
    if (this.transform && this.transformationFunction) {
      try {
        // Create a function from the string and execute it
        const transformFn = eval(`(${this.transformationFunction})`);
        payload = transformFn(payload);
      } catch (error) {
        throw new Error(`Error in transformation function: ${error.message}`);
      }
    }

    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      ...this.additionalHeaders,
    };

    // Make the POST request
    const response = await axios($, {
      method: "POST",
      url: process.env.PLUGIN_WEBHOOK_URL,
      headers,
      data: payload,
    });

    // Create a summary
    $.export("$summary", "Successfully sent data to Trmnl API");

    // Return the response
    return response;
  },
});
