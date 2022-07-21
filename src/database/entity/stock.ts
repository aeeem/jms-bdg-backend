import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product";
import { Vendor } from "./vendor";


@Entity({ name: 'stock' })
export class Stock extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    total_stock!: number;
    
    @Column()
    buy_price!: number;
    
    @OneToOne(() => Product, (product: Product) => product.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    product: Product;

    @OneToOne(() => Vendor, (vendor: Vendor) => vendor.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    vendor: Vendor;
    
    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;

}