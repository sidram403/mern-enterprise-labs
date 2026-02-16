import User from "../models/user.model.js";
import Order from "../models/order.model.js";

/**
 * Admin Analytics Controller
 */

export const getAnalytics = async (req, res) => {
  try {
    /**
     * Total Users
     */
    const totalUsers = await User.countDocuments();

    /**
     * Total Orders
     */
    const totalOrders = await Order.countDocuments();

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
      {
        $group: {
          _id: "$product",
          totalSales: { $sum: "$amount" },
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
