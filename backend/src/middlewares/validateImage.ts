import { type Context, type Next } from "hono";
import { ImageAnnotatorClient } from "@google-cloud/vision";

const client = new ImageAnnotatorClient();

const validateImage = async (c: Context, next: Next) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File;

  if (!image) {
    return c.json({ success: false, msg: "Image not found in request" }, 400);
  }

  const buffer = await image.arrayBuffer();
  const [result] = await client.labelDetection({
    image: { content: Buffer.from(buffer) },
  });

  const labels =
    result.labelAnnotations?.map(
      (label) => label.description?.toLowerCase() ?? "",
    ) ?? [];

  // console.log(labels);

  const fashionKeywords = [
    "fashion",
    "clothing",
    "apparel",
    "outfit",
    "style",
    "model",
    "runway",
    "accessory",
  ];

  const isFashion = labels.some((label) =>
    fashionKeywords.some((keyword) => label.includes(keyword)),
  );

  if (!isFashion) {
    return c.json({ success: false, msg: "Image is not fashion-related" }, 400);
  }

  c.set("imageLabels", labels);
  c.set("imageValidated", true);

  await next();
};

export { validateImage };
