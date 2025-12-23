
const paginate = async (model, options) => {
    try {
      const { page = 1, pageSize = 10, attributes=[], whereClause = {}, order = [] } = options;
      const offset = (page - 1) * pageSize;
  
      const result = await model.findAndCountAll({
        ...options,
        attributes: attributes.length > 0 ? attributes: undefined,
        where: { ...whereClause },
        limit: parseInt(pageSize),
        offset: parseInt(offset),
        order: order.length > 0 ? order : undefined,
      });

      const totalCount = result.count;
      const totalPages = Math.ceil(totalCount / pageSize);
  
      return {
        data: result.rows,
        totalPageCount: totalPages,
      };
    } catch (error) {
      console.error('Pagination Error:', error);
      throw error;
    }
  };
  
  module.exports = {
    paginate,
  };