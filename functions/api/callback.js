export async function onRequest(context) {

  const url = new URL(context.request.url);

  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No code", {
      status: 400
    });
  }


  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        client_id: context.env.GITHUB_CLIENT_ID,
        client_secret: context.env.GITHUB_CLIENT_SECRET,
        code
      })
    }
  );


  const data = await tokenResponse.json();


  if (!data.access_token) {
    return new Response(
      JSON.stringify(data),
      {
        status: 400,
        headers:{
          "Content-Type":"application/json"
        }
      }
    );
  }


  return Response.redirect(
    "https://sonjass-photo.pages.dev/admin/",
    302
  );

}
