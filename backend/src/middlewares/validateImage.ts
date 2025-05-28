import { type Context, type Next } from "hono";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { keywords } from "../utils/fashionKeywords.ts";

const keyString = Buffer.from(process.env.GOOGLE_CLOUD_KEY!, "base64").toString(
  "utf-8"
);
const credentials = JSON.parse(keyString);

const client = new ImageAnnotatorClient({ credentials });

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

  const [safeSearch] = await client.safeSearchDetection({
    image: { content: Buffer.from(buffer) },
  });
  // console.log(safeSearch);

  const labels =
    result.labelAnnotations?.map(
      (label) => label.description?.toLowerCase() ?? ""
    ) ?? [];

  console.log(labels);

  const fashionKeywords = keywords;

  const isFashion = labels.some((label) =>
    fashionKeywords.some((keyword) => label.includes(keyword))
  );

  if (!isFashion) {
    return c.json({ success: false, msg: "Image is not fashion-related" }, 400);
  }

  const isAdultContent = safeSearch.safeSearchAnnotation?.adult;
  console.log(isAdultContent);

  if (isAdultContent !== "VERY_UNLIKELY" && isAdultContent !== "UNLIKELY") {
    return c.json(
      { success: false, msg: "Image may contain adult content" },
      400
    );
  }

  c.set("imageLabels", labels);
  c.set("imageValidated", true);

  await next();
};

export { validateImage };
