import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John");
    expect(response.body.address.street).toBe("Street");
    expect(response.body.address.city).toBe("City");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.zip).toBe("12345");
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "john",
    });
    expect(response.status).toBe(500);
  });

  it("should list all customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 1234,
          zip: "12344",
        },
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers.length).toBe(2);
    const customer = listResponse.body.customers[0];
    expect(customer.name).toBe("John");
    expect(customer.address.street).toBe("Street");
    const customer2 = listResponse.body.customers[1];
    expect(customer2.name).toBe("Jane");
    expect(customer2.address.street).toBe("Street 2");

    const listResponseXML = await request(app)
    .get("/customer")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<customers>`);
    expect(listResponseXML.text).toContain(`<customer>`);
    expect(listResponseXML.text).toContain(`<name>John</name>`);
    expect(listResponseXML.text).toContain(`<address>`);
    expect(listResponseXML.text).toContain(`<street>Street</street>`);
    expect(listResponseXML.text).toContain(`<city>City</city>`);
    expect(listResponseXML.text).toContain(`<number>123</number>`);
    expect(listResponseXML.text).toContain(`<zip>12345</zip>`);
    expect(listResponseXML.text).toContain(`</address>`);
    expect(listResponseXML.text).toContain(`</customer>`);
    expect(listResponseXML.text).toContain(`<name>Jane</name>`);
    expect(listResponseXML.text).toContain(`<street>Street 2</street>`);
    expect(listResponseXML.text).toContain(`</customers>`);
    

    
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Maça",
        price: 20
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Maça");
    expect(response.body.price).toBe(20);
  });


  it("should list a product", async () => {
    const responsePost = await request(app)
    .post("/product")
    .send({
      name: "Maça",
      price: 20
    });

    expect(responsePost.status).toBe(201);
    const responsePost2 = await request(app)
    .post("/product")
    .send({
      name: "Banana",
      price: 9.99
    });
    expect(responsePost2.status).toBe(201);

    const response = await request(app)
      .get("/product")
      .send();

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].name).toBe('Maça');
    expect(response.body.products[0].price).toBe(20);
    expect(response.body.products[1].name).toBe('Banana');
    expect(response.body.products[1].price).toBe(9.99);
  });


  it("should return error with product null", async () => {
    const response = await request(app)
    .post("/product")
    .send({
      price: 20
    });

    const expected = [{context: 'product', message: 'Name is required'}]
    expect(response.status).toBe(400);
    expect(response.body.errors).toStrictEqual(expected);
  });

  it("should return error with product empty", async () => {
    const response = await request(app)
    .post("/product")
    .send({
      name: "",
      price: 20
    });

    expect(response.status).toBe(400);
    const responseExpected = [ { context: 'product', message: 'Name is required' } ];
    expect(response.body.errors).toStrictEqual(responseExpected);
  });

  it("should return error with price null", async () => {
    const response = await request(app)
    .post("/product")
    .send({
      name: "",
      price: undefined
    });

    expect(response.status).toBe(400);
    const responseExpected = [ { context: 'product', message: 'Name is required' }, { context: 'product', message: 'Price is required' } ];
    expect(response.body.errors).toStrictEqual(responseExpected);
  });
});
