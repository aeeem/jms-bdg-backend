import { Vendor } from "@entity/vendor";

export type AddVendorRequestParameter = Pick<Vendor, "address" | "name" | "pic_name" | 'pic_phone_number'>
export type UpdateVendorRequestParameter = Pick<Vendor, "address" | "name" | "pic_name" | 'pic_phone_number'>