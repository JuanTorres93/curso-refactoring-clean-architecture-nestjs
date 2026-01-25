import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./categories.entity";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly CategoriesRepository: Repository<Category>
    ) {}

    async findAll(): Promise<Category[]> {
        return this.CategoriesRepository.find();
    }

    findOne(uid: string): Promise<Category> {
        return this.CategoriesRepository.findOneBy({ categoryUid: uid });
    }
}
