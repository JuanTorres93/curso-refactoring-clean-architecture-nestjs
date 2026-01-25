import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create.product.dto";
import { Product } from "./products.entity";
import { Category } from "../categories/categories.entity";

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

const createProductServiceResponse: Product = {
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

const productsServiceResponse: Product[] = [
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

const oneProductServiceResponse = productsServiceResponse[0];

describe("ProductsController", () => {
    let productsController: ProductsController;
    let productsService: ProductsService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                ProductsService,
                {
                    provide: ProductsService,
                    useValue: {
                        create: jest.fn().mockImplementation((_product: CreateProductDto) => {
                            return Promise.resolve(createProductServiceResponse);
                        }),
                        findAll: jest.fn().mockResolvedValue(productsServiceResponse),
                        findOne: jest.fn().mockImplementation((_id: string) => oneProductServiceResponse),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        productsController = app.get<ProductsController>(ProductsController);
        productsService = app.get<ProductsService>(ProductsService);
    });

    it("should be defined", () => {
        expect(productsController).toBeDefined();
    });

    describe("create()", () => {
        it("should create a product", async () => {
            const createdProduct = await productsController.create(createProductDto);

            expect(createdProduct.sku).toEqual(createProductServiceResponse.sku);
            expect(createdProduct.title).toEqual(createProductServiceResponse.title);
            expect(createdProduct.description).toEqual(createProductServiceResponse.description);
            expect(createdProduct.category).toEqual(createProductServiceResponse.category.categoryUid);
            expect(createdProduct.image).toEqual(createProductServiceResponse.image);
            expect(createdProduct.price).toEqual(createProductServiceResponse.price);
            expect(createdProduct.createdDate).toEqual(date);
            expect(createdProduct.lastUpdated).toEqual(date);

            expect(productsService.create).toHaveBeenCalledWith(createProductDto);
        });
    });

    describe("findAll()", () => {
        it("should find all users ", async () => {
            const products = await productsController.findAll();

            products.forEach((product, index) => {
                expect(product.sku).toEqual(productsServiceResponse[index].sku);
                expect(product.title).toEqual(productsServiceResponse[index].title);
                expect(product.description).toEqual(productsServiceResponse[index].description);
                expect(product.category).toEqual(productsServiceResponse[index].category.categoryUid);
                expect(product.image).toEqual(productsServiceResponse[index].image);
                expect(product.price).toEqual(productsServiceResponse[index].price);
                expect(product.createdDate).toEqual(date);
                expect(product.lastUpdated).toEqual(date);
            });

            expect(productsService.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne()", () => {
        it("should find a user", async () => {
            const product = await productsController.findOne(oneProductServiceResponse.sku);

            expect(product.sku).toEqual(oneProductServiceResponse.sku);
            expect(product.title).toEqual(oneProductServiceResponse.title);
            expect(product.description).toEqual(oneProductServiceResponse.description);
            expect(product.category).toEqual(oneProductServiceResponse.category.categoryUid);
            expect(product.image).toEqual(oneProductServiceResponse.image);
            expect(product.price).toEqual(oneProductServiceResponse.price);
            expect(product.createdDate).toEqual(date);
            expect(product.lastUpdated).toEqual(date);

            expect(productsService.findOne).toHaveBeenCalled();
        });
    });

    describe("remove()", () => {
        it("should remove the product", async () => {
            await productsController.remove(oneProductServiceResponse.sku);
            expect(productsService.remove).toHaveBeenCalled();
        });
    });
});
