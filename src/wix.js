const rs = require("jsrsasign");

function jwtVerify(token, secret) {
  const isValid = rs.jws.JWS.verifyJWT(token, rs.KEYUTIL.getKey(secret), {
    alg: [
      "RS256",
      "RS384",
      "RS512",
      "PS256",
      "PS384",
      "PS512",
      "ES256",
      "ES384",
      "ES512",
    ],
    verifyAt: rs.jws.IntDate.get("now"),
  });

  if (!isValid) return undefined;

  const payload = rs.KJUR.jws.JWS.readSafeJSONString(
    rs.b64utoutf8(token.split(".")[1])
  );
  return payload;
}

const processText = "process";
const _process = global[processText];

addHandler("transform", (request, context) => {
  const payload = jwtVerify(request.body, _process.env.PUBLIC_KEY);
  const parsedPayload = JSON.parse(payload.data);
  if (parsedPayload.data && typeof parsedPayload.data === "string") {
    parsedPayload.data = JSON.parse(parsedPayload.data);
  }
  request.body = parsedPayload;
  request.headers["content-type"] = "application/json";
  return request;
});
