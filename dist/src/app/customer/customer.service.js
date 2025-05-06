"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerService = exports.updateCustomerService = exports.createCustomerService = exports.searchCustomerService = exports.payDebtService = exports.addDepositService = exports.getCustomerDebtService = exports.getCustomerDepositService = exports.getCustomerByIdService = exports.getAllCustomerService = void 0;
const customer_1 = require("@entity/customer");
const customerMonetary_1 = require("@entity/customerMonetary");
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const errorHandler_1 = require("src/errorHandler");
const AccountCode_1 = require("src/interface/AccountCode");
const cashFlow_1 = require("@entity/cashFlow");
const cashFlow_2 = require("src/database/enum/cashFlow");
const getAllCustomerService = async (offset, limit, orderByColumn, Order, search) => {
    try {
        //     LEFT JOIN (select  sum(
        // case
        // when "customer_monetary"."type"='DEBT' then "customer_monetary"."amount"
        // else 0
        // end) as "debt",customer_monetary.customer_id from "customer_monetary" group by customer_monetary.customer_id
        // )
        let queryBuilder = await customer_1.Customer.getRepository().createQueryBuilder('customer')
            .select(['customer.*,coalesce(cm.debt,0) AS debt,coalesce(cm.deposit,0) AS deposit'])
            .leftJoin(selecQueryBuilder => selecQueryBuilder
            .select([
            `sum( case
     when "customer_monetary"."type"='DEBT' then "customer_monetary"."amount"
     else 0
     end) as "debt"`,
            'customer_monetary.customer_id as customer_id',
            `sum( case
     when "customer_monetary"."type"='DEPOSIT' then "customer_monetary"."amount"
     else 0
     end) as "deposit"`
        ]).from('customer_monetary', 'customer_monetary')
            .groupBy('customer_monetary.customer_id'), 'cm', 'cm.customer_id = customer.id')
            .leftJoin('customer_monetary', 'c1', 'c1.customer_id = customer.id')
            .leftJoin('customer_monetary', 'c2', 'c2.customer_id = customer.id AND (c1.created_at < c2.created_at OR (c1.created_at = c2.created_at AND c1.id < c2.id))')
            .where('c2.id IS NULL')
            .addSelect('c1.created_at', 'last_transaction_date')
            .orderBy(orderByColumn, Order === 'DESC' ? 'DESC' : 'ASC')
            .offset(offset);
        if (search) {
            queryBuilder = queryBuilder.andWhere('customer.name ILIKE :search', { search: `%${search}%` });
        }
        const count_data = await customer_1.Customer.count();
        queryBuilder = queryBuilder.limit(limit);
        const customers = await queryBuilder.getRawMany();
        return {
            count_data,
            customers
        };
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getAllCustomerService = getAllCustomerService;
const getCustomerByIdService = async (id) => {
    try {
        const queryBuilder = await customer_1.Customer.getRepository()
            .createQueryBuilder('customer')
            .select(['customer.*,coalesce(cm.debt,0) AS debt,coalesce(cm.deposit,0) AS deposit'])
            .leftJoin(selecQueryBuilder => selecQueryBuilder
            .select([
            `sum( case
        when "customer_monetary"."type"='DEBT' then "customer_monetary"."amount"
        else 0
        end) as "debt"`,
            'customer_monetary.customer_id as customer_id',
            `sum( case
        when "customer_monetary"."type"='DEPOSIT' then "customer_monetary"."amount"
        else 0
        end) as "deposit"`
        ])
            .from('customer_monetary', 'customer_monetary')
            .groupBy('customer_monetary.customer_id'), 'cm', 'cm.customer_id = customer.id')
            .leftJoin('customer_monetary', 'c1', 'c1.customer_id = customer.id')
            .leftJoin('customer_monetary', 'c2', 'c2.customer_id = customer.id AND (c1.created_at < c2.created_at OR (c1.created_at = c2.created_at AND c1.id < c2.id))')
            .where('c2.id IS NULL')
            .addSelect('c1.created_at', 'last_transaction_date')
            .where('customer.id=:id', { id });
        console.log(queryBuilder.getSql());
        const customer = await queryBuilder.getRawOne();
        if (customer == null)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        return customer;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getCustomerByIdService = getCustomerByIdService;
const getCustomerDepositService = async (id, orderByColumn, Order, offset, limit) => {
    try {
        if (orderByColumn !== 'last_transaction_date' &&
            orderByColumn !== undefined) {
            orderByColumn = `customer_monetary.${String(orderByColumn)}`;
        }
        if (orderByColumn === undefined) {
            orderByColumn = 'customer_monetary.id';
        }
        let queryBuilder = await customerMonetary_1.CustomerMonetary.createQueryBuilder('customer_monetary')
            .select(['customer_monetary.*'])
            .where('customer_monetary.customer_id=:id', { id })
            .andWhere('customer_monetary.type=:type', { type: hutangPiutang_1.E_Recievables.DEPOSIT })
            .orderBy(orderByColumn, Order === 'DESC' ? 'DESC' : 'ASC');
        const qb_deposit = await customerMonetary_1.CustomerMonetary.createQueryBuilder('customer_monetary')
            .select(['coalesce(sum(customer_monetary.amount),0) as total_deposit'])
            .where('customer_monetary.customer_id=:id', { id })
            .andWhere('customer_monetary.type=:type', { type: hutangPiutang_1.E_Recievables.DEPOSIT });
        const total_deposit_obj = await qb_deposit.getRawOne();
        const count_data = await queryBuilder.getCount();
        // If a limit is provided, set the maximum number of records to retrieve
        if (limit) {
            queryBuilder = queryBuilder.limit(limit);
        }
        // If a offset is provided, set the maximum number of records to retrieve
        if (offset) {
            queryBuilder = queryBuilder.offset(offset);
        }
        const total_deposit = total_deposit_obj.total_deposit;
        const customer_deposit_list = await queryBuilder.getRawMany();
        return {
            count_data,
            total_deposit,
            customer_deposit_list
        };
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getCustomerDepositService = getCustomerDepositService;
const getCustomerDebtService = async (id, orderByColumn, Order, offset, limit) => {
    try {
        if (orderByColumn !== 'last_transaction_date' &&
            orderByColumn !== undefined) {
            orderByColumn = `customer_monetary.${String(orderByColumn)}`;
        }
        if (orderByColumn === undefined) {
            orderByColumn = 'customer_monetary.id';
        }
        let queryBuilder = await customerMonetary_1.CustomerMonetary.createQueryBuilder('customer_monetary')
            .select(['customer_monetary.*'])
            .where('customer_monetary.customer_id=:id', { id })
            .orderBy(orderByColumn, Order === 'DESC' ? 'DESC' : 'ASC')
            .andWhere('customer_monetary.type=:type', { type: hutangPiutang_1.E_Recievables.DEBT });
        const total_debt_obj = await customerMonetary_1.CustomerMonetary.createQueryBuilder('customer_monetary')
            .select(['coalesce(sum(customer_monetary.amount)) as total_debt'])
            .where('customer_monetary.customer_id=:id', { id })
            .andWhere('customer_monetary.type=:type', { type: hutangPiutang_1.E_Recievables.DEBT })
            .getRawOne();
        const count_data = await queryBuilder.getCount();
        // If a limit is provided, set the maximum number of records to retrieve
        if (limit) {
            queryBuilder = queryBuilder.limit(limit);
        }
        // If a offset is provided, set the maximum number of records to retrieve
        if (offset) {
            queryBuilder = queryBuilder.offset(offset);
        }
        const total_debt = total_debt_obj.total_debt;
        const customer_debt_list = await queryBuilder.getRawMany();
        return {
            count_data,
            total_debt,
            customer_debt_list
        };
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getCustomerDebtService = getCustomerDebtService;
const addDepositService = async ({ amount, customer_id, is_transfer, description }) => {
    try {
        const customer = await customer_1.Customer.findOne({ where: { id: customer_id } });
        if (!customer)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        const customerMonetary = new customerMonetary_1.CustomerMonetary();
        customerMonetary.customer_id = customer.id;
        customerMonetary.amount = amount;
        customerMonetary.type = hutangPiutang_1.E_Recievables.DEPOSIT;
        customerMonetary.source = is_transfer ? AccountCode_1.E_CODE_KEY.DEP_ADD_CASH_DEPOSIT_TRANSFER : AccountCode_1.E_CODE_KEY.DEP_ADD_CASH_DEPOSIT;
        if (description) {
            customerMonetary.description = description;
        }
        await customerMonetary.save();
        const cashFlow = new cashFlow_1.CashFlow();
        cashFlow.amount = amount;
        cashFlow.code = cashFlow_2.E_CashFlowCode.IN_ADD_DEPOSIT;
        cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
        cashFlow.cash_type = is_transfer ? cashFlow_2.E_CashType.TRANSFER : cashFlow_2.E_CashType.CASH;
        cashFlow.note = `${customer.name} Tambah Deposit`; // temporary harcode
        return customerMonetary;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.addDepositService = addDepositService;
const payDebtService = async ({ amount, customer_id, is_transfer, description }) => {
    try {
        const customer = await customer_1.Customer.findOne({ where: { id: customer_id } });
        if (!customer)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        const customerMonetary = new customerMonetary_1.CustomerMonetary();
        customerMonetary.customer_id = customer.id;
        customerMonetary.amount = amount;
        customerMonetary.type = hutangPiutang_1.E_Recievables.DEBT;
        customerMonetary.source = is_transfer ? AccountCode_1.E_CODE_KEY.DEBT_SUB_PAY_WITH_TRANSFER : AccountCode_1.E_CODE_KEY.DEBT_SUB_PAY_WITH_CASH;
        if (description) {
            customerMonetary.description = description;
        }
        await customerMonetary.save();
        const cashFlow = new cashFlow_1.CashFlow();
        cashFlow.amount = amount;
        cashFlow.code = cashFlow_2.E_CashFlowCode.IN_PAY_DEBT;
        cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
        cashFlow.cash_type = is_transfer ? cashFlow_2.E_CashType.TRANSFER : cashFlow_2.E_CashType.CASH;
        cashFlow.note = `Pembayaran Hutang : ${customer.name}`; // temporary harcode
        cashFlow.customer = customer;
        await cashFlow.save();
        return customerMonetary;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.payDebtService = payDebtService;
const searchCustomerService = async (query) => {
    try {
        const customer = await customer_1.Customer.createQueryBuilder('customer')
            .where('UPPER(customer.name) LIKE UPPER(:query)', { query: `%${query}%` })
            .leftJoinAndSelect('customer.monetary', 'monetary')
            .leftJoinAndSelect('customer.transactions', 'transactions')
            .orderBy('customer.id', 'ASC')
            .getMany();
        return customer;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.searchCustomerService = searchCustomerService;
const createCustomerService = async (payload) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        await queryRunner.startTransaction();
        const _newCustomer = new customer_1.Customer();
        _newCustomer.name = payload.name;
        _newCustomer.contact_number = payload.contact_number ?? '';
        await queryRunner.manager.save(_newCustomer);
        const _customerMonet = new customerMonetary_1.CustomerMonetary();
        _customerMonet.customer = _newCustomer;
        // if ( payload.hutang ) {
        //   _customerMonet.amount = payload.hutang
        //   _customerMonet.type = E_Recievables.DEBT
        // } else if ( payload.piutang ) {
        //   _customerMonet.amount = payload.piutang
        //   _customerMonet.type = E_Recievables.DEPOSIT
        // }
        // if ( payload.hutang ?? payload.piutang ) {
        //   await queryRunner.manager.save( _customerMonet )
        // }
        await queryRunner.commitTransaction();
        const customer = await customer_1.Customer.findOne({ where: { id: _newCustomer.id } });
        return customer;
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        await queryRunner.release();
    }
};
exports.createCustomerService = createCustomerService;
const updateCustomerService = async (id, payload) => {
    try {
        const customer = await customer_1.Customer.findOne({ where: { id } });
        if (customer != null) {
            customer.name = payload.name ? payload.name : customer.name;
            customer.contact_number = payload.contact_number ? payload.contact_number : customer.contact_number;
            await customer.save();
        }
        else
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        return await customer_1.Customer.findOne({ where: { id } });
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.updateCustomerService = updateCustomerService;
const deleteCustomerService = async (id) => {
    try {
        const customer = await customer_1.Customer.findOne({ where: { id } });
        if (customer != null) {
            await customer.remove();
        }
        else
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.deleteCustomerService = deleteCustomerService;
