import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product";
import { Vendor } from "./vendor";


@Entity({ name: 'stock' })
export class Stock extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Product, (product:Product) => product.sku, { onDelete: 'CASCADE' })
    @Column()
    product_sku: string;
    
    @Column()
    total_stock: number;
    
    @OneToOne(() => Vendor, (vendor: Vendor) => vendor.id, {onDelete: 'CASCADE'})
    @Column()
    vendor_id: number;
    
    @Column()
    buy_price: number;
    
    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
    
}