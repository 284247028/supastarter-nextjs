import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetSignedUploadUrlHandler, GetSignedUrlHander } from "../../types";

const s3Endpoint = process.env.S3_ENDPOINT as string;
if (!s3Endpoint) throw new Error("Missing env variable S3_ENDPOINT");

const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID as string;
if (!s3AccessKeyId) throw new Error("Missing env variable S3_ACCESS_KEY_ID");

const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY as string;
if (!s3SecretAccessKey)
  throw new Error("Missing env variable S3_SECRET_ACCESS_KEY");

const S3 = new S3Client({
  region: "auto",
  endpoint: s3Endpoint,
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey,
  },
});

export const getSignedUploadUrl: GetSignedUploadUrlHandler = async (
  path,
  { bucket },
) => {
  try {
    return await getS3SignedUrl(
      S3,
      new PutObjectCommand({ Bucket: bucket, Key: path }),
      {
        expiresIn: 60,
      },
    );
  } catch (e) {
    console.error(e);
    throw new Error("Could not get signed upload url");
  }
};

export const getSignedUrl: GetSignedUrlHander = async (
  path,
  { bucket, expiresIn },
) => {
  try {
    return getS3SignedUrl(
      S3,
      new GetObjectCommand({ Bucket: bucket, Key: path }),
      { expiresIn },
    );
  } catch (e) {
    console.error(e);
    throw new Error("Could not get signed url");
  }
};
