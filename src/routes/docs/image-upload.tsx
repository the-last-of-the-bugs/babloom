import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P, PropsTable } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/image-upload")({
  head: () => ({
    meta: [
      { title: "Image Upload – BaBloom Editor" },
      { name: "description", content: "Configure the BaBloom image extension: accepted types, max size and your own upload handler." },
      { property: "og:title", content: "Image Upload – BaBloom Editor" },
      { property: "og:description", content: "Validation, drag & drop, paste and custom upload handlers for images." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Image upload" description="V1 media support: images only. Storage is entirely up to you.">
      <H2>Setup</H2>
      <CodeBlock
        lang="ts"
        code={`import { ImageExtension, type UploadResult } from "@tlob/babloom-core";

async function uploadImage(file: File): Promise<UploadResult> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) throw new Error("Upload failed");
  const { url, width, height } = await res.json();
  return { src: url, width, height, alt: file.name };
}

ImageExtension({
  accept: ["image/png", "image/jpeg", "image/webp"],
  maxSize: 5 * 1024 * 1024,
  upload: uploadImage,
  onError: (error) => toast.error(error.message),
});`}
      />

      <H2>Options</H2>
      <PropsTable
        rows={[
          { name: "accept", type: "string[]", description: "Allowed MIME types. Defaults to png, jpeg, webp, gif." },
          { name: "maxSize", type: "number", description: "Maximum file size in bytes. Defaults to 5 MB." },
          { name: "upload", type: "(file) => Promise<UploadResult>", description: "Required. Returns { src, width?, height?, alt? }." },
          { name: "onError", type: "(error: Error) => void", description: "Called on validation or upload failure." },
        ]}
      />

      <H2>Commands</H2>
      <PropsTable
        rows={[
          { name: 'command("pickImage")', type: "void", description: "Opens the native file picker and uploads the choice." },
          { name: 'command("uploadImage", file)', type: "void", description: "Uploads a File you already have." },
          { name: 'command("setImageAlt", alt)', type: "void", description: "Sets alt text on the selected image." },
          { name: 'command("deleteImage")', type: "void", description: "Removes the selected image." },
        ]}
      />

      <H2>Drag, drop and paste</H2>
      <P>
        Dropping or pasting an image file into the editor runs the same validation and upload
        pipeline. Upload progress is reported through the image:upload:start, image:upload:done and
        image:upload:error events.
      </P>
      <CodeBlock lang="ts" code={`editor.on("image:upload:start", ({ file }) => setBusy(file.name));`} />
    </DocsPage>
  );
}