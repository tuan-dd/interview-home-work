import {
  AnyKeys,
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

export interface QueryWithPagination<T> {
  query: FilterQuery<T>;
  page: number;
  limit: number;
}

abstract class BaseService<Props, Doc extends Props & Document = Props & Document> {
  constructor(protected model: Model<Props>) {}

  createOne = (doc: AnyKeys<Props>) => {
    return this.model.create(doc);
  };

  findByIdUpdate = (
    id: string | Types.ObjectId,
    update: UpdateQuery<Doc>,
    option?: QueryOptions,
  ) => {
    return this.model
      .findByIdAndUpdate<Doc>(id, update, {
        lean: true,
        ...option,
      })
      .exec();
  };

  updateMany = (
    query: FilterQuery<Doc>,
    update: UpdateQuery<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model
      .updateMany<Doc>(query, update, {
        lean: true,
        ...option,
      })
      .exec();
  };

  findOneUpdate = (
    query: FilterQuery<Doc>,
    update: UpdateQuery<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model
      .findOneAndUpdate<Doc>(query, update, {
        lean: true,
        ...option,
      })
      .exec();
  };

  findMany = (
    query: QueryWithPagination<Doc>,
    select?: ProjectionType<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model
      .find<Doc>(query.query, select, {
        lean: true,
        ...option,
      })
      .skip(query.limit * (query.page - 1))
      .limit(query.limit)
      .exec();
  };

  findOne = (
    query: FilterQuery<Doc>,
    select?: ProjectionType<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model
      .findOne<Doc>(query, select, {
        lean: true,
        ...option,
      })
      .exec();
  };

  findById = (
    id: string | Types.ObjectId,
    select?: ProjectionType<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model.findById<Doc>(id, select, { lean: true, ...option }).exec();
  };

  findManyAndPopulateByQuery = (
    query: QueryWithPagination<Doc>,
    optionPopulate?: PopulateOptions[],
    select?: ProjectionType<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model
      .find<Doc>(query.query, select, { ...option })
      .populate(optionPopulate)
      .skip(query.limit * (query.page - 1))
      .limit(query.limit)
      .sort('-createdAt')
      .lean()
      .exec();
  };

  findByPopulate = async (
    query: FilterQuery<Doc>,
    optionPopulate: PopulateOptions[],
    select?: ProjectionType<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model
      .findOne(query, select, { ...option })
      .populate(optionPopulate)
      .lean()
      .exec();
  };

  findByIdAndPopulate = async (
    id: Types.ObjectId | string,
    optionPopulate: PopulateOptions[],
    select?: ProjectionType<Doc>,
    option?: QueryOptions<Doc>,
  ) => {
    return this.model
      .findById(id, select, { ...option })
      .populate(optionPopulate)
      .lean()
      .exec();
  };

  deleteOne = async (query: FilterQuery<Doc>, option?: QueryOptions<Doc>) => {
    return this.model.deleteOne(query, option).lean();
  };

  getCountByQuery = (query?: FilterQuery<Doc>) => {
    return this.model.count(query).lean().exec();
  };

  getCountByPopulate = (query: FilterQuery<Doc>, optionPopulate: PopulateOptions[]) => {
    return this.model
      .find<Doc>(query.query, null, { lean: true })
      .populate(optionPopulate)
      .count();
  };
}

export default BaseService;
