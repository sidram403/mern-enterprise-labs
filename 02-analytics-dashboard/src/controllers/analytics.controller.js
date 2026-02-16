import User from "../models/user.model.js";
import Order from "../models/order.model.js";

/**
 * Admin Analytics Controller
 */

export const getAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;

    /**
     * Optional date filter
     * Allows analytics for specific time range
     */
    const dateFilter = {};

    if (from && to) {
      dateFilter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    /**
     * Total Users (no Date filter)
     */
    const totalUsers = await User.countDocuments();

    /**
     * Total Orders (with optional filter)
     */
    const totalOrders = await Order.countDocuments(dateFilter);

    /**
     * Total Revenue
     * Aggregation used instead of feteching all documents
     */
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    /**
     * Monthly Revenue Breakdown
     */

    const monthlyRevenue = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /**
     * Top 5 Products by Revenue
     */
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$product",
          totalSales: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productName: "$productDetails.name",
          totalSales: 1,
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue,
      monthlyRevenue,
      topProducts,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
