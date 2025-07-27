import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async () => {
  const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days ago

  const { data: oldImages, error } = await supabase
    .from("generated_images")
    .select("id, image_url")
    .lt("created_at", cutoffDate);

  if (error) {
    console.error("❌ Error fetching old images:", error);
    return new Response("Error", { status: 500 });
  }

  // Delete from Supabase Storage
  for (const image of oldImages) {
    const publicPath = image.image_url?.split("/storage/v1/object/public/")[1];
    if (publicPath) {
      const { error: storageError } = await supabase.storage
        .from("generated-images")
        .remove([publicPath]);

      if (storageError) {
        console.error(`⚠️ Failed to delete file from storage: ${publicPath}`, storageError);
      }
    }
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from("generated_images")
    .delete()
    .lt("created_at", cutoffDate);

  if (deleteError) {
    console.error("❌ Error deleting rows from database:", deleteError);
    return new Response("Error", { status: 500 });
  }

  return new Response("✅ Old images deleted successfully");
});
