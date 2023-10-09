const rs = require("jsrsasign");

function jwtDecode(token) {
  const payload = rs.KJUR.jws.JWS.readSafeJSONString(
    rs.b64utoutf8(token.split(".")[1])
  );
  return payload;
}

addHandler("transform", (request, context) => {
  request.headers['content-type'] = 'application/json';
  const payload = jwtDecode(request.body);

  request.body = JSON.parse(JSON.parse(payload.data).data);

  return request;
});
