"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Tickets,
  Users,
} from "lucide-react";
import Link from "next/link";
import useGetAllOrder from "@/features/orderMutations/useGetAllOrder";
import { toINR } from "@/helpers/convertToINR";
import useGetAllProducts from "@/features/productMutations/useGetAllProducts";
import useGetUserCount from "@/features/authMutations/useGetUserCount";
import { IProduct } from "@/types/product.types";

const Dashboard = () => {
  const { allOrders } = useGetAllOrder();
  const { getAllProducts } = useGetAllProducts();
  const { allUsers } = useGetUserCount();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // get User
  const userCount = allUsers?.users.length || 0;

  const currentMonthUserCount =
    allUsers?.users.filter((user: any) => {
      const createdDate = new Date(user.createdAt);
      return (
        user.role === "user" &&
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length || 0;

  // Revenue calculations
  const currentMonthRevenue =
    allOrders
      ?.filter((order) => {
        const date = new Date(order.createdAt || "");
        return (
          order.paymentStatus === "completed" &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((acc, order) => acc + order.totalAmount, 0) || 0;

  const previousMonthRevenue =
    allOrders
      ?.filter((order) => {
        const date = new Date(order.createdAt || "");
        return (
          order.paymentStatus === "completed" &&
          date.getMonth() === previousMonth &&
          date.getFullYear() === previousYear
        );
      })
      .reduce((acc, order) => acc + order.totalAmount, 0) || 0;

  const revenueGrowth =
    previousMonthRevenue === 0
      ? 100
      : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
        100;

  // Orders calculations
  const currentMonthOrders =
    allOrders?.filter((order) => {
      const date = new Date(order.createdAt || "");
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    }).length || 0;

  const previousMonthOrders =
    allOrders?.filter((order) => {
      const date = new Date(order.createdAt || "");
      return (
        date.getMonth() === previousMonth && date.getFullYear() === previousYear
      );
    }).length || 0;

  const orderGrowth =
    previousMonthOrders === 0
      ? 100
      : ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) *
        100;

  const totalOrders = allOrders?.length || 0;
  const totalProducts = getAllProducts?.length || 0;

  const recentOrders = allOrders
    ?.sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    )
    .slice(0, 5);

  const salesDataMap = new Map<string, number>();
  allOrders
    ?.filter((order) => order.paymentStatus === "completed")
    .forEach((order) => {
      const date = new Date(order.createdAt || "");
      const month = date.toLocaleString("default", { month: "short" });
      salesDataMap.set(
        month,
        (salesDataMap.get(month) || 0) + order.totalAmount
      );
    });

  const salesData = Array.from(salesDataMap, ([name, sales]) => ({
    name,
    sales,
  }));

  // Product calculations
  const currentMonthProducts =
    getAllProducts?.filter((product: IProduct) => {
      const date = new Date(product.createdAt || "");
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    }).length || 0;

  const previousMonthProducts =
    getAllProducts?.filter((product: IProduct) => {
      const date = new Date(product.createdAt || "");
      return (
        date.getMonth() === previousMonth && date.getFullYear() === previousYear
      );
    }).length || 0;

  const productGrowth =
    previousMonthProducts === 0
      ? 100
      : ((currentMonthProducts - previousMonthProducts) /
          previousMonthProducts) *
        100;

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toINR(currentMonthRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueGrowth >= 0
                ? `+${revenueGrowth.toFixed(1)}% from last month`
                : `${revenueGrowth.toFixed(1)}% from last month`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {orderGrowth >= 0
                ? `+${orderGrowth.toFixed(1)}% from last month`
                : `${orderGrowth.toFixed(1)}% from last month`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {productGrowth >= 0
                ? `+${productGrowth.toFixed(1)}% from last month`
                : `${productGrowth.toFixed(1)}% from last month`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{userCount}</div>
            <p className="text-xs text-muted-foreground">
              +{currentMonthUserCount} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                  labelStyle={{ color: "#6b7280" }}
                  itemStyle={{ color: "#4f46e5" }}
                />{" "}
                <Bar dataKey="sales" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders?.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx}>
                        {item.productName} × {item.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{toINR(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.deliveryStatus === "shipped"
                          ? "default"
                          : order.deliveryStatus === "processing"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order.deliveryStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "completed"
                          ? "default"
                          : order.paymentStatus === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your store efficiently</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/addProducts">
            <Button className="w-full">
              <Package className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </Link>
          <Link href="/admin/allOrders">
            <Button variant="outline" className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" /> View All Orders
            </Button>
          </Link>
          <Link href="/admin/manageVouchers">
            <Button variant="outline" className="w-full">
              <Tickets className="mr-2 h-4 w-4" /> Manage Voucher
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
