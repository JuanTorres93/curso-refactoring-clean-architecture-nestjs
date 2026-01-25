import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesService } from "./categories.service";
import { Repository } from "typeorm";
import { Category } from "./categories.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

const categoriesRepositoryReponse: Category[] = [
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

const oneCategoryRepositoryResponse = categoriesRepositoryReponse[0];

describe("CategoriesService", () => {
    let service: CategoriesService;
    let repository: Repository<Category>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: {
                        find: jest.fn().mockResolvedValue(categoriesRepositoryReponse),
                        findOneBy: jest.fn().mockResolvedValue(oneCategoryRepositoryResponse),
                    },
                },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
        repository = module.get<Repository<Category>>(getRepositoryToken(Category));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll()", () => {
        it("should return an array of users", async () => {
            const categories = await service.findAll();

            categories.forEach((category, index) => {
                expect(category.id).toEqual(categoriesRepositoryReponse[index].id);
                expect(category.categoryUid).toEqual(categoriesRepositoryReponse[index].categoryUid);
                expect(category.name).toEqual(categoriesRepositoryReponse[index].name);
                expect(category.products).toEqual(categoriesRepositoryReponse[index].products);
            });

            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe("findOne()", () => {
        it("should get a single user", async () => {
            const category = await service.findOne(oneCategoryRepositoryResponse.categoryUid);

            expect(category.id).toEqual(oneCategoryRepositoryResponse.id);
            expect(category.categoryUid).toEqual(oneCategoryRepositoryResponse.categoryUid);
            expect(category.name).toEqual(oneCategoryRepositoryResponse.name);
            expect(category.products).toEqual(oneCategoryRepositoryResponse.products);

            expect(repository.findOneBy).toHaveBeenCalled();
        });
    });
});
