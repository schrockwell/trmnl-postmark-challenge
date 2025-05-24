export default defineComponent({
  name: "Transform Postmark Webhook Data",
  description:
    "Transform incoming Postmark webhook JSON data into the specified format with extracted message fields",
  type: "action",
  async run({ steps, $ }) {
    const webhookData = steps.trigger.event.body;

    // Extract the required fields
    const subject = webhookData.Subject;
    const body = webhookData.TextBody;
    const senderName = webhookData.FromName;
    const senderEmail = webhookData.From;
    const dateString = webhookData.Date;

    // Convert date to ISO 8601 format
    const isoDate = new Date(dateString).toISOString();

    // Create the transformed data structure
    const transformedData = {
      merge_strategy: "stream",
      stream_limit: 5,
      merge_variables: {
        messages: [
          {
            subject: subject,
            body: body,
            time: isoDate,
            sender_name: senderName,
            sender_email: senderEmail,
          },
        ],
      },
    };

    $.export(
      "$summary",
      `Successfully transformed Postmark webhook data for subject "${subject}"`
    );

    return transformedData;
  },
});
