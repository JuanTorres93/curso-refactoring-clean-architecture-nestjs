import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { Category } from "./categories.entity";

const categoriesServiceReponse: Category[] = [
    {
        id: 1,
        categoryUid: "122-123-123",
        name: "name #1",
        products: [],
    },
    {
        id: 1,
        categoryUid: "322-123-123",
        name: "name #2",
        products: [],
    },
];

const oneCategoryServiceResponse = categoriesServiceReponse[0];

describe("CategoriesController", () => {
    let categoriesController: CategoriesController;
    let categoriesService: CategoriesService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [CategoriesController],
            providers: [
                CategoriesService,
                {
                    provide: CategoriesService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue(categoriesServiceReponse),
                        findOne: jest
                            .fn()
                            .mockImplementation((_id: string) => Promise.resolve(oneCategoryServiceResponse)),
                    },
                },
            ],
        }).compile();

        categoriesController = app.get<CategoriesController>(CategoriesController);
        categoriesService = app.get<CategoriesService>(CategoriesService);
    });

    it("should be defined", () => {
        expect(categoriesController).toBeDefined();
    });

    describe("findAll()", () => {
        it("should find all categories ", async () => {
            const categories = await categoriesController.findAll();

            categories.forEach((category, index) => {
                expect(category.categoryUid).toEqual(categories[index].categoryUid);
                expect(category.name).toEqual(categories[index].name);
            });

            expect(categoriesService.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne()", () => {
        it("should find a category", async () => {
            const category = await categoriesController.findOne(oneCategoryServiceResponse.categoryUid);

            expect(category.categoryUid).toEqual(oneCategoryServiceResponse.categoryUid);
            expect(category.name).toEqual(oneCategoryServiceResponse.name);

            expect(categoriesService.findOne).toHaveBeenCalled();
        });
    });
});
