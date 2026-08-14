export async function onRequest(context) {

  const url = new URL(context.request.url);

  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", {
      status: 400
    });
  }

  return Response.redirect(
    "https://sonjass-photo.pages.dev/admin/",
    302
  );

}
