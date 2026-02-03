import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductDB } from "../../products/data/products.db";

@Entity("categories")
export class CategoryDB extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    categoryUid: string;

    @Column()
    name: string;

    @OneToMany(() => ProductDB, product => product.category)
    products: ProductDB[];
}
