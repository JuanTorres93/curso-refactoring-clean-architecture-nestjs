import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { Repository } from "typeorm";
import { Product } from "./products.entity";
import { Category } from "../categories/categories.entity";
import { CreateProductDto } from "./dto/create.product.dto";

const date = new Date(2025, 12, 1);

const category: Category = { id: 1, categoryUid: "category #1", name: "category #1", products: [] };

const createProductDto: CreateProductDto = {
    sku: "SKU3",
    title: "title #3",
    description: "description #3",
    category: "category #1",
    image: "image #3",
    price: 99.99,
};

const createProductRepositoryResponse: Product = {
    id: 3,
    sku: "SKU3",
    title: "title #3",
    description: "description #3",
    category: category,
    image: "image #3",
    price: 199.99,
    createdDate: date,
    lastUpdated: date,
};

const productsRepositoryResponse: Product[] = [
    {
        id: 1,
        sku: "SKU1",
        title: "title #1",
        description: "description #1",
        category: category,
        image: "image #1",
        price: 99.99,
        createdDate: date,
        lastUpdated: date,
    },
    {
        id: 2,
        sku: "SKU2",
        title: "title #2",
        description: "description #2",
        category: category,
        image: "image #2",
        price: 99.99,
        createdDate: date,
        lastUpdated: date,
    },
];

const oneProductRepositoryResponse = productsRepositoryResponse[0];

describe("ProductsService", () => {
    let service: ProductsService;
    let repository: Repository<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        find: jest.fn().mockResolvedValue(productsRepositoryResponse),
                        findOne: jest.fn().mockResolvedValue(oneProductRepositoryResponse),
                        findOneBy: jest.fn().mockResolvedValue(null),
                        save: jest.fn().mockResolvedValue(createProductRepositoryResponse),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Category),
                    useValue: {
                        find: jest.fn().mockResolvedValue([category]),
                        findOneBy: jest.fn().mockResolvedValue(category),
                        save: jest.fn().mockResolvedValue(category),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create()", () => {
        it("should successfully insert a product", async () => {
            const createdProduct = await service.create(createProductDto);

            expect(createdProduct.sku).toEqual(createProductRepositoryResponse.sku);
            expect(createdProduct.title).toEqual(createProductRepositoryResponse.title);
            expect(createdProduct.description).toEqual(createProductRepositoryResponse.description);
            expect(createdProduct.category).toEqual(createProductRepositoryResponse.category);
            expect(createdProduct.image).toEqual(createProductRepositoryResponse.image);
            expect(createdProduct.price).toEqual(createProductRepositoryResponse.price);
            expect(createdProduct.createdDate).toEqual(date);
            expect(createdProduct.lastUpdated).toEqual(date);
        });
    });

    describe("findAll()", () => {
        it("should return an array of products", async () => {
            const products = await service.findAll();

            products.forEach((product, index) => {
                expect(product.sku).toEqual(productsRepositoryResponse[index].sku);
                expect(product.title).toEqual(productsRepositoryResponse[index].title);
                expect(product.description).toEqual(productsRepositoryResponse[index].description);
                expect(product.category).toEqual(productsRepositoryResponse[index].category);
                expect(product.image).toEqual(productsRepositoryResponse[index].image);
                expect(product.price).toEqual(productsRepositoryResponse[index].price);
                expect(product.createdDate).toEqual(date);
                expect(product.lastUpdated).toEqual(date);
            });

            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe("findOne()", () => {
        it("should get a single product", async () => {
            const product = await service.findOne(oneProductRepositoryResponse.sku);

            expect(product.sku).toEqual(oneProductRepositoryResponse.sku);
            expect(product.title).toEqual(oneProductRepositoryResponse.title);
            expect(product.description).toEqual(oneProductRepositoryResponse.description);
            expect(product.category).toEqual(oneProductRepositoryResponse.category);
            expect(product.image).toEqual(oneProductRepositoryResponse.image);
            expect(product.price).toEqual(oneProductRepositoryResponse.price);
            expect(product.createdDate).toEqual(date);
            expect(product.lastUpdated).toEqual(date);

            expect(repository.findOne).toHaveBeenCalled();
        });
    });

    describe("remove()", () => {
        it("should call remove with the passed value", async () => {
            service.remove(oneProductRepositoryResponse.sku);
            expect(repository.delete).toHaveBeenCalled();
        });
    });
});
