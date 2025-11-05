import { IQueryFeatures } from '@/type/query-features.type';
import { FilterQuery, Model, PipelineStage } from 'mongoose';

interface IOptions<T> {
  searchFields?: (keyof T)[];
}

export class QueryBuilder<T> {
  private queryParams: IQueryFeatures;
  private pipeline: PipelineStage[] = [];
  private extraPipes: PipelineStage[] = [];
  private filterQuery: FilterQuery<T>;
  private searchFields: (keyof T)[];
  private model: Model<T>;

  constructor(
    model: Model<T>,
    queryParams: IQueryFeatures,
    options?: IOptions<T>,
  ) {
    this.model = model;
    this.queryParams = queryParams;
    if (options?.searchFields) {
      this.searchFields = options?.searchFields || [];
    }
  }

  /**
   *  Add Filter Query.
   * @param filterQuery
   */

  addFilterQuery(filterQuery: FilterQuery<T>) {
    this.filterQuery = { ...this.filterQuery, ...filterQuery };
    return this;
  }

  /**
   *  Additional Pipeline.
   * @param PipelineStage[]
   */

  addExtraPipes(extras: PipelineStage[]) {
    this.extraPipes = [...this.extraPipes, ...extras];
    return this;
  }

  /**
   * Adds a custom stage to the pipeline.
   */
  addCustomStage(stage: PipelineStage) {
    this.pipeline.push(stage);
    return this;
  }

  /**
   * Builds the `$match` stage for filtering documents.
   */
  private buildMatchStage(): PipelineStage.Match | null {
    const filters = { ...this.queryParams.filters, ...this.filterQuery };
    const searchConditions = this.searchFields.map((filed) => {
      return {
        [filed]: {
          $regex: this.queryParams.search,
          $options: 'i',
        },
      };
    });
    return {
      $match: {
        $and: [
          {
            ...filters,
          },
          {
            $or: searchConditions,
          },
        ],
      },
    };
  }

  /**
   * Builds the `$sort` stage.
   */
  private buildSortStage(): PipelineStage.Sort {
    return {
      $sort: this.queryParams.sort,
    };
  }

  /**
   * Builds the `$project` stage for field selection.
   */
  private buildProjectStage(): PipelineStage.Project | PipelineStage.AddFields {
    return Object.keys(this.queryParams.fields).length > 0
      ? { $project: this.queryParams.fields }
      : {
          $addFields: {},
        };
  }

  /**
   * Builds the pagination stages.
   */
  private buildPagination(): PipelineStage[] {
    return this.queryParams.limit
      ? [{ $skip: this.queryParams.skip }, { $limit: this.queryParams.limit }]
      : [];
  }

  /**
   * Executes the query and returns paginated results with a count.
   */
  async execute(): Promise<{ data: T[]; total: number }> {
    const matchStage = this.buildMatchStage();
    const sortStage = this.buildSortStage();
    const projectStage = this.buildProjectStage();
    const paginationBeforePopulate = this.buildPagination();
    const paginationWithPopulate = [
      ...paginationBeforePopulate,
      ...this.extraPipes,
    ];

    if (matchStage) this.pipeline.push(matchStage);
    this.pipeline.push(sortStage);
    this.pipeline.push(projectStage);
    this.pipeline.push({
      $facet: {
        data: [...(paginationWithPopulate as any)],
        total: [{ $count: 'total' }],
      },
    });
    this.pipeline.push({
      $project: {
        total: { $arrayElemAt: ['$total.total', 0] },
        data: 1,
      },
    });

    const [result] = await this.model.aggregate(this.pipeline).exec();
    return result;
  }
}
