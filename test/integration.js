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
      password: "12345678"
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
describe("PUT /api/v1/user/password", () => {
  it("post /add", done => {
    let newUser = {
      email: "igolinin@mail.ru",
      password: "12345678",
      email: "87654321"
    };
    chai
      .request(app)
      .put("/api/v1/user")
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
