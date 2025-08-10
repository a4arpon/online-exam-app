import { Editor } from "@tinymce/tinymce-react"

export type TinyMCERef = {
  getContent(): string
}

export const TinyMCEditor = ({
  editorRef,
  contents,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: true
  editorRef: any
  contents?: string
}) => {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      initialValue={
        contents ?? "<p>This is the initial content of the editor.</p>"
      }
      // biome-ignore lint/suspicious/noAssignInExpressions: true
      onInit={(_evt, editor) => (editorRef.current = editor)}
      licenseKey="gpl"
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "preview",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  )
}
