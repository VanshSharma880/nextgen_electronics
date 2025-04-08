"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { GiShoppingCart } from "react-icons/gi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/ModeToggle/ModeToggle";
import { useLogout } from "@/features/authMutations/useLogin";
import useGetCartProduct from "@/features/cartMutations/useGetCartProduct";
import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  console.log("session: ", session);
  const userId = session?.user?.id;
  const isLogin = !!session?.user;
  const isAdmin = session?.user?.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getAllCartProduct } = useGetCartProduct(userId || null);
  const cartCount = getAllCartProduct?.length || 0;
  const { logout } = useLogout();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Orders", href: "/orders" },
    { name: "Contact", href: "/contact" },
  ];

  const adminNavLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Add products", href: "/admin/addProducts" },
    { name: "Edit products", href: "/products" },
    { name: "All orders", href: "/admin/allOrders" },
  ];

  const linksToDisplay = isAdmin ? adminNavLinks : navLinks;

  const handleLogout = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <nav className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="md:text-lg font-bold dark:bg-white bg-black bg-clip-text text-transparent">
              NextGenElectronics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {linksToDisplay.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Cart, Profile, Theme Toggle, Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/search" className="relative">
              <CiSearch className="h-5 w-5" />
            </Link>

            {/* Cart */}
            {!isAdmin && (
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <GiShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-red-600 rounded-full"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User Profile / Auth */}
            {isLogin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-8 w-8 rounded-full cursor-pointer">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-white text-sm font-medium text-primary">
                      {session.user.image ? (
                        <Image
                          width={32}
                          height={32}
                          src={session.user.image}
                          alt={session.user.name || "user"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        session.user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {session.user.name} {isAdmin ? "(Admin)" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/manageAccount">Manage voucher</Link>
                    </DropdownMenuItem>
                  ) : (
                    ""
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" className="hidden md:block">
                <Link href="/sign-in">Get Started</Link>
              </Button>
            )}

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3 px-2 pt-2">
              {linksToDisplay.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!isLogin && (
                <Button asChild variant="default" size="sm" className="mt-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
