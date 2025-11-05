import { IQueryFeatures } from '@/type/query-features.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isObjectIdOrHexString, Types } from 'mongoose';

type TDocumentNumber = 'single' | 'multiple';

const getQueryFeatureContext = (
  context: ExecutionContext,
  documentNumber: TDocumentNumber,
) => {
  const req = context.switchToHttp().getRequest();
  // set fields that wanted
  const fieldsObj: { [key: string]: number } = {};

  // select fields
  if (req.query.fields) {
    let fields = String(req.query.fields);
    fields = fields.split(',').join(' ');

    // create fields object
    fields.split(' ').forEach((el) => {
      fieldsObj[el] = 1;
    });
  }

  if (documentNumber === 'single') {
    // lookup control
    const populate: string = req.query.populate
      ? String(req.query.populate).split(',').join(' ')
      : '';
    const queryFeaturesObj: Partial<IQueryFeatures> = {
      fields: fieldsObj,
      populate,
    };

    return queryFeaturesObj;
  } else {
    // set limit and skip to the request
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const skip = page && limit ? (page - 1) * limit : 0;

    const search: string = req.query.search ? String(req.query.search) : '';

    let sort = req.query.sort ? String(req.query.sort) : undefined;

    // create sort object
    const sortObj: {
      [key: string]: 1 | -1;
    } = {};

    if (sort) {
      sort = sort.split(',').join(' ');

      sort.split(' ').forEach((el) => {
        if (el.startsWith('-')) {
          sortObj[el.slice(1)] = -1;
        } else {
          sortObj[el] = 1;
        }
      });
    } else {
      sortObj.createdAt = -1;
    }

    // get filters
    const query: object = req.query;
    const filters: {
      [key: string]: any;
    } = {
      ...query,
    };

    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'search',
      'populate',
    ];

    excludedFields.forEach((el) => delete filters[el]);

    Object.keys(filters).forEach((key) => {
      if (filters[key] === 'true') {
        filters[key] = true;
      } else if (filters[key] === 'false') {
        filters[key] = false;
      } else if (Number(filters[key])) {
        filters[key] = Number(filters[key]);
      } else if (isObjectIdOrHexString(filters[key])) {
        filters[key] = new Types.ObjectId(filters[key] as any);
      } else if (filters[key].includes(',')) {
        // replace gte|gt|lte|lt with $gte|$gt|$lte|$lt
        const queryStr = filters[key].replace(
          /\b(gte|gt|lte|lt)\b/g,
          (match: any) => `$${match}`,
        );
        const [keys, value] = queryStr.split(',');
        const object: any = { [keys]: value };
        Object.keys(object).forEach((el) => {
          // Try parsing as integer first
          if (!isNaN(object[el])) {
            object[el] = parseInt(object[el]);
            return;
          }

          // Then try parsing as date
          const dateValue = new Date(object[el]);
          if (!isNaN(dateValue.getTime())) {
            object[el] = dateValue;
            return;
          }

          // Finally try parsing as float
          const floatValue = parseFloat(object[el]);
          if (!isNaN(floatValue)) {
            object[el] = floatValue;
          }
        });
        filters[key] = object;
      }
    });

    // lookup control
    const populateObj: { [key: string]: boolean } = {};

    if (req.query.populate) {
      let populate = String(req.query.populate);
      populate = populate.split(',').join(' ');

      // create fields object
      populate.split(' ').forEach((el) => {
        populateObj[el] = true;
      });
    }

    const queryFeaturesObj: IQueryFeatures = {
      page,
      limit,
      skip,
      fields: fieldsObj,
      filters,
      sort: sortObj,
      search,
      populate: populateObj,
    };

    return queryFeaturesObj;
  }
};

export const QueryFeatureMultiple = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getQueryFeatureContext(context, 'multiple'),
);

export const QueryFeatureSingle = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getQueryFeatureContext(context, 'single'),
);
