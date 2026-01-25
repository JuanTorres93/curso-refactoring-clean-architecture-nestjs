import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../categories/categories.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    sku: string;

    @Column()
    title: string;

    @Column({ type: "varchar", length: 1000 })
    description: string;

    @ManyToOne(() => Category, category => category.products, {
        cascade: false,
    })
    category: Category;

    @Column()
    image: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    price: number;

    @Column()
    createdDate: Date;

    @Column()
    lastUpdated: Date;
}
