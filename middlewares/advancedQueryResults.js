// Function to handle advanced results for model queries
const advancedQueryResults =
  (model, resourceName, populate) => async (req, res, next) => {
    try {
      // Copy req.query to avoid modifying the original request object
      const reqQuery = { ...req.query };

      // Fields to exclude from query
      const excludedFields = ["select", "sort", "page", "limit"];

      // Remove excluded fields from reqQuery
      excludedFields.forEach((field) => delete reqQuery[field]);

      // Convert reqQuery to a string
      let queryStr = JSON.stringify(reqQuery);

      // Replace comparison operators ($gt, $gte, $lt, $lte, $in) with MongoDB operators
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );

      // Parse query string to JSON
      const parsedQuery = JSON.parse(queryStr);

      // Construct initial query
      let query = model.find(parsedQuery);

      // Select specific fields if specified in req.query
      if (req.query.select) {
        const selectFields = req.query.select.split(",").join(" ");
        query = query.select(selectFields);
      }

      // Sort results based on query parameters or default to descending createdAt
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 25;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await model.countDocuments(parsedQuery);

      query = query.skip(startIndex).limit(limit);

      // Populate referenced fields if specified
      if (populate) {
        query = query.populate(populate);
      }

      // Execute query to fetch results
      const results = await query;

      // Pagination result
      const pagination = {};

      // Add next page information if there are more results
      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }

      // Add previous page information if not on the first page
      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }

      // Attach advanced results to response object
      res.advancedQueryResults = {
        success: true,
        status: true,
        message: `All ${resourceName} retrieved successfully`,
        count: results.length,
        pagination,
        data: results,
      };

      // Proceed to next middleware
      next();
    } catch (err) {
      // Handle any errors and pass to error handling middleware
      next(err);
    }
  };

module.exports = advancedQueryResults;
