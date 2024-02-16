import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const domain = ProductFactory.create( 'a','Maça', 20.99)

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(domain)),
    update: jest.fn(),
  };
};

describe("Unit test for product update use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const input = { id: domain.id, name: 'Maça', price: 20.99 }
    const output = await updateProductUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
