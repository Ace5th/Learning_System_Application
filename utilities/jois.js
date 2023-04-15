const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.assignmentSchema = Joi.object({
  assignment: Joi.object({
    title: Joi.string().required().escapeHTML(),
    phase: Joi.string().required(),
    content: Joi.object({
      originalname: Joi.string().required().escapeHTML(),
      url: Joi.string().required().escapeHTML(),
      filename: Joi.string().required().escapeHTML(),
    }).required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    title: Joi.string().required().escapeHTML(),
    content: Joi.string().required().escapeHTML(),
  }).required(),
});
