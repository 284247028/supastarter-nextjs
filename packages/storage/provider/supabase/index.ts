import { createClient } from "@supabase/supabase-js";
import { GetSignedUploadUrlHandler, GetSignedUrlHander } from "../../types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!supabaseUrl) {
  throw new Error("Missing env variable NEXT_PUBLIC_SUPABASE_URL");
}

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseServiceRoleKey) {
  throw new Error("Missing env variable SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

export const getSignedUploadUrl: GetSignedUploadUrlHandler = async (
  path,
  { bucket },
) => {
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error) {
    console.error(error);
    throw new Error("Could not get signed url");
  }

  return data.signedUrl;
};

export const getSignedUrl: GetSignedUrlHander = async (
  path,
  { bucket, expiresIn },
) => {
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn ?? 60);

  if (error) {
    console.error(error);
    throw new Error("Could not get signed url");
  }

  return data.signedUrl;
};
