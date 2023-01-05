"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockGudangSubscriber = void 0;
const stock_1 = require("@entity/stock");
const stockGudang_1 = require("@entity/stockGudang");
const StocksCode_1 = require("src/interface/StocksCode");
const typeorm_1 = require("typeorm");
let StockGudangSubscriber = class StockGudangSubscriber {
    /**
       * Indicates that this subscriber only listen to StockGudang events.
       */
    listenTo() {
        return stockGudang_1.StockGudang;
    }
    /**
       * Called before post insertion.
       */
    afterinsert(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const stock = yield stock_1.Stock.findOne(event.entity.stock_id);
            if (stock && (event.entity.code === StocksCode_1.E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK ||
                event.entity.code === StocksCode_1.E_GUDANG_CODE_KEY.GUD_ADD_BRG_RETUR)) {
                stock.stock_gudang = stock.stock_gudang + event.entity.amount;
                yield stock.save();
            }
            if (stock && (event.entity.code === StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_HAPUS ||
                event.entity.code === StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_KELUAR ||
                event.entity.code === StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_PIN_TOKO)) {
                stock.stock_gudang = stock.stock_gudang - event.entity.amount;
                yield stock.save();
            }
        });
    }
};
StockGudangSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], StockGudangSubscriber);
exports.StockGudangSubscriber = StockGudangSubscriber;
