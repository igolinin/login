const chai = require("chai");
const should = require("chai").should;
const expect = require("chai").expect;
const request = require("supertest");
const chaiHttp = require("chai-http");
const app = require("../index");
chai.use(chaiHttp);

describe("Add new user - update - delete", () => {
  it("should add new user", done => {
    let newUser = {
      email: "igolinin@mail.ru",
      password: "12345678"
    };
    request(app)
      .post("/api/v1/user/add")
      .send(newUser)
      .end((err, res) => {
        expect(res).have.status(200);
        done();
      })
      .timeout(5000);
  });
  it("should update password", done => {
    let newUser = {
      email: "igolinin@mail.ru",
      password: "12345678",
      email: "87654321"
    };
    request(app)
      .put("/api/v1/user")
      .send(newUser)
      .end((err, res) => {
        expect(res).have.status(200);
        done();
      });
  });
  it("should delete user", done => {
    request(app)
      .delete("/api/v1/user")
      .send({ email: "igolinin@mail.ru" })
      .end((err, res) => {
        console.log(res.status);
        expect(res).have.status(204);
        done();
      });
  });
});
describe("Add new user - update - delete with invalid input", () => {
  it("should reject new user  alraedy exist", done => {
    let newUser = {
      email: "igolinin@mail.ru",
      password: "12345678"
    };
    request(app)
      .post("/api/v1/user/add")
      .send(newUser)
      .end((err, res) => {
        expect(res).have.status(200);
        done();
      })
      .timeout(5000);
  });
  it("should reject update password - user doesn't exist", done => {
    let newUser = {
      email: "igolinin1@mail.ru",
      password: "12345678",
      email: "87654321"
    };
    request(app)
      .put("/api/v1/user")
      .send(newUser)
      .end((err, res) => {
        expect(res).have.status(200);
        done();
      });
  });
  it("should reject delete user - user doesn't exist", done => {
    request(app)
      .delete("/api/v1/user")
      .send({ email: "igolinin1@mail.ru" })
      .end((err, res) => {
        expect(res).have.status(204);
        done();
      });
  });
});
describe("Login routes", () => {
  it("should logg user in", done => {
    let newUser = {
      email: "igolinin@mail.ru",
      password: "12345678"
    };
    request(app)
      .post("/api/v1/auth/login")
      .send(newUser)
      .end((err, res) => {
        expect(res).have.status(200);
        done();
      })
      .timeout(5000);
  });
  it("should reject not existing user", done => {
    let newUser = {
      email: "igolinin1@mail.ru",
      password: "12345678"
    };
    request(app)
      .post("/api/v1/auth/login")
      .send(newUser)
      .end((err, res) => {
        expect(res).have.status(200);
        done();
      })
      .timeout(5000);
  });
});
