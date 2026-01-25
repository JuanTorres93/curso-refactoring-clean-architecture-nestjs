import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/products.entity";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    categoryUid: string;

    @Column()
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}
