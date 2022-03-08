import { SelectQueryBuilder } from "typeorm";


export interface paginateOptions{
    limit:number;
    currentPage:number;
    total?:boolean;
}

export interface paginationResult<T>{
    first:number;
    last:number;
    limit:number;
    total?:number;
    data:T[];
}

export async function paginate<T>(
    qb:SelectQueryBuilder<T>,
    options: paginateOptions ={
        limit:10, currentPage:1
    }
):Promise<paginationResult<T>>{
    const offset = (options.currentPage - 1) * options.limit;
    const data = await qb.limit(options.limit).offset(offset).getMany();

    return {
        first: offset + 1,
        last: offset + data.length,
        limit: options.limit,
        total: options.total ? await qb.getCount(): null,
        data
    }
}