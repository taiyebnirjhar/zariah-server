// Helper function to map Mongoose types to JavaScript types
export const mapMongooseTypeToJsType = (mongooseType: any): any => {
  if (!mongooseType) return String;
  const typeName = mongooseType.instance || mongooseType.constructor.name;
  switch (typeName) {
    case 'String':
      return String;
    case 'Number':
      return Number;
    case 'Boolean':
      return Boolean;
    case 'Date':
      return Date;
    case 'ObjectID':
      return String; // Treat ObjectIDs as strings for query params
    case 'Array':
      return Array; // Generic type for arrays
    default:
      return String; // Default to string for unknown types
  }
};
