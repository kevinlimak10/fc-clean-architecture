import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import CreateProductUseCase from "./create.product.usecase";
import { InputCreateProductDto } from "./create.product.dto";

describe("Test find product use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should create a product", async () => {
      const productRepository = new ProductRepository();
      const usecase = new CreateProductUseCase(productRepository);
      
      const product = new Product("123", 'Maça', 20);
  
      await productRepository.create(product);
  
      const input = {
        name: 'Maça',
        price: 20
      } as InputCreateProductDto;
  
      const output = {
        id: "123",
        name: "Maça",
        price: 20
      };
  
      const result = await usecase.execute(input);
  
      expect(result.name).toEqual(output.name);
      expect(result.price).toEqual(output.price);
    })
});