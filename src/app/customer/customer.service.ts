import { Customer } from "@entity/customer";


export type CustomerRequestParameter = Pick<Customer,  "name" | "contact_number">;