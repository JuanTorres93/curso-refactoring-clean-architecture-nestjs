import { CategoryDB } from "../../categories/data/categories.db";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class ProductDB {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    sku: string;

    @Column()
    title: string;

    @Column({ type: "varchar", length: 1000 })
    description: string;

    @ManyToOne(() => CategoryDB, category => category.products, {
        cascade: false,
    })
    category: CategoryDB;

    @Column()
    image: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    price: number;

    @Column()
    createdDate: Date;

    @Column()
    lastUpdated: Date;
}
