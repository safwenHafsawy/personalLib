const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testId;
const invalidID = "FD1C";
const comment = "test comment";

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        this.timeout(5000).slow(3000);
        const testObj = { title: "title" };
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send(testObj)
            .end(function (err, res) {
              assert.strictEqual(err, null);
              assert.isObject(res.body);
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              testId = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          const testObj = {};
          chai
            .request(server)
            .post("/api/books")
            .set(testObj)
            .end(function (err, res) {
              assert.strictEqual(err, null);
              assert.isString(res.text);
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      this.timeout(5000).slow(3000);
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.strictEqual(err, null);
            assert.strictEqual(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        this.timeout(5000).slow(3000);
        chai
          .request(server)
          .get(`/api/books/${testId}`)
          .end(function (err, res) {
            assert.strictEqual(err, null);
            assert.isObject(res.body);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments);
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        this.timeout(5000).slow(3000);
        chai
          .request(server)
          .get(`/api/books/${invalidID}`)
          .end(function (err, res) {
            assert.strictEqual(err, null);
            assert.isString(res.text);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          this.timeout(5000).slow(3000);
          chai
            .request(server)
            .post(`/api/books/${testId}`)
            .send({ comment })
            .end(function (err, res) {
              assert.strictEqual(err, null);
              assert.isObject(res.body);
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              assert.property(res.body, "comments");
              assert.isArray(res.body.comments);
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          this.timeout(5000).slow(3000);
          chai
            .request(server)
            .post(`/api/books/${testId}`)
            .end(function (err, res) {
              assert.strictEqual(err, null);
              assert.isString(res.text);
              assert.equal(res.text, "missing comment field");
              assert.deepEqual(res.body, {});
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          this.timeout(5000).slow(3000);
          chai
            .request(server)
            .post(`/api/books/${invalidID}`)
            .send({ comment })
            .end(function (err, res) {
              assert.strictEqual(err, null);
              assert.isString(res.text);
              assert.equal(res.text, "no book exists");
              assert.deepEqual(res.body, {});
              done();
            });
        });
      }
    );
    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        this.timeout(5000).slow(3000);
        chai
          .request(server)
          .delete(`/api/books/${testId}`)
          .end(function (err, res) {
            assert.strictEqual(err, null);
            assert.isString(res.text);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        this.timeout(5000).slow(3000);
        chai
          .request(server)
          .delete(`/api/books/${invalidID}`)
          .end(function (err, res) {
            assert.strictEqual(err, null);
            assert.isString(res.text);
            assert.equal(res.text, "no book found");
            done();
          });
      });
    });
  });
});
