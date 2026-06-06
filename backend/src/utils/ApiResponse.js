// ============================================
// Standardized API Response
// ============================================
// Why: Every endpoint returns the same shape.
// Frontend developers never guess the response format.
// { success: true/false, message: "...", data: {...}, meta: {...} }
// ============================================

class ApiResponse {
  /**
   * Success response
   */
  static success(res, { data = null, message = 'Success', statusCode = 200, meta = null }) {
    const response = {
      success: true,
      message,
      data,
    };
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   */
  static created(res, { data = null, message = 'Created successfully' }) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Paginated response
   */
  static paginated(res, { data, page, limit, total, message = 'Success' }) {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  }

  /**
   * No content response (204)
   */
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
