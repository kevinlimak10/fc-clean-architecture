import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { OutputListProductDto } from "./list.product.dto";

export default class ListProductUseCase {
    private productRepository: ProductRepositoryInterface;
  
    constructor(productRepository: ProductRepositoryInterface) {
      this.productRepository = productRepository;
    }
  
    async execute(): Promise<OutputListProductDto> {
      const products = await this.productRepository.findAll();
      return OutputMapper.toOutput(products);
    }
  }
  

  class OutputMapper {
    static toOutput(product: Product[]): OutputListProductDto {
      return {
        products: product.map((item) => ({ id: item.id,        name: item.name,        price: item.price })),
      };
    }
  }  