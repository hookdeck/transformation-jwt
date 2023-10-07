const { KEYUTIL } = require("jsrsasign");
const rs = require("jsrsasign");

function jwtVerify(token, secret) {

  const k = KEYUTIL.getKey(secret);
  const isValid = rs.jws.JWS.verify(
    token,
    k,
    {
      alg: ["RS256"],
    }
  );

  if (!isValid) return undefined;

  const payload = rs.KJUR.jws.JWS.readSafeJSONString(
    rs.b64utoutf8(token.split(".")[1])
  );
  return payload;
}

addHandler("transform", (request, context) => {
  const jwt_secret = process.env.JWT_SECRET;

  const payload = jwtVerify(request.body, jwt_secret);

  request.headers['content-type'] = 'application/json';

  request.body = {};
  if(payload) {
    request.body = JSON.parse(JSON.parse(payload.data).data);
  }

  return request;
});
