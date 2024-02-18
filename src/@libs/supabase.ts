import { envConfig } from "@_utils/config";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  envConfig.database_url!,
  envConfig.database_key!
);
