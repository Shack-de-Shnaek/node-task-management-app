export default interface ICrudService {
    get: (input) => Promise<unknown | null>;
    list: (params) => Promise<unknown[]>;
    create: (data) => Promise<unknown>;
    update: (id: number, data) => Promise<unknown>;
    delete: (id: number) => Promise<unknown>;
}