"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const products_module_1 = require("./products/products.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const dbType = configService.get('DB_TYPE') || 'sqlite';
                    if (dbType === 'sqlite') {
                        return {
                            type: 'better-sqlite3',
                            database: configService.get('DB_DATABASE') || 'database.sqlite',
                            entities: [__dirname + '/**/*.entity{.ts,.js}'],
                            synchronize: true,
                            logging: false,
                        };
                    }
                    return {
                        type: 'mysql',
                        host: configService.get('DB_HOST') || 'localhost',
                        port: configService.get('DB_PORT') ?? 3306,
                        username: configService.get('DB_USERNAME') || 'root',
                        password: configService.get('DB_PASSWORD') || '',
                        database: configService.get('DB_DATABASE') || 'nestjs_jwt_crud',
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: true,
                        logging: true,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            products_module_1.ProductsModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
