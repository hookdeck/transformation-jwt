const rs = require("jsrsasign");

function jwtVerify(token, secret) {
  const isValid = rs.jws.JWS.verifyJWT(
    token,
    Buffer.from(secret, "utf8").toString("hex"),
    {
      alg: ["HS256"],
      verifyAt: rs.jws.IntDate.get("now"),
    }
  );

  if (!isValid) return undefined;

  const payload = rs.KJUR.jws.JWS.readSafeJSONString(
    rs.b64utoutf8(token.split(".")[1])
  );
  return payload;
}

const processText = "process";
const _process = global[processText];

addHandler("transform", (request, context) => {
  const payload = jwtVerify(request.body.encoded, _process.env.JWT_TOKEN);
  request.body.decoded = payload;
  return request;
});
