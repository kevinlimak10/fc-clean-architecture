import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product = new Product('123', 'Maça', 20);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test list product use case", () => {
  it("should list a product", async () => {
    const listRepository = MockRepository();
    const usecase = new ListProductUseCase(listRepository);

    const output = {
      products: [{
        id: "123",
        name: "Maça",
        price: 20
      }]
    };

    const result = await usecase.execute();

    expect(result).toEqual(output);
  });

  it("should not list a Product", async () => {
    const ProductRepository = MockRepository();
    ProductRepository.findAll.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const usecase = new ListProductUseCase(ProductRepository);

    const input = {
      id: "123",
    };

    expect(() => {
      return usecase.execute();
    }).rejects.toThrow("Product not found");
  });
});
