const chai = require("chai");
const should = require("chai").should;
const expect = require("chai").expect;
const app = require("../index");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("POST /api/v1/user", () => {
  it("post /add", done => {
    let newUser = {
      email: "igolinin@mail.ru",
      password: "1234"
    };
    chai
      .request(app)
      .post("/api/v1/user/add")
      .send(newUser)
      .end((err, res) => {
        expect(res).have.status(200);
        done();
      });
  });
});
describe("DELETE /api/v1/user", () => {
  it("delete /", done => {
    chai
      .request(app)
      .delete("/api/v1/user")
      .send({ email: "igolinin@mail.ru" })
      .end((err, res) => {
        console.log(res.status);
        expect(res).have.status(200);
        done();
      });
  });
});
