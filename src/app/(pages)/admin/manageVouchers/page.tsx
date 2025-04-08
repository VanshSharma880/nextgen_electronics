// "use client";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Trash2, Pencil } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { IVoucher } from "@/types/voucher.types";
// import useAddVoucher from "@/features/voucherMutations/useAddVoucher";
// import useDeleteVoucher from "@/features/voucherMutations/useDeleteVoucher";
// import useUpdateVoucher from "@/features/voucherMutations/useUpdateVoucher";
// import useGetVoucher from "@/features/voucherMutations/useGetVoucher";
// import Spinner from "@/components/Spinner";

// const ManageAccount = () => {
//   const { addVoucher, isAddingVoucher } = useAddVoucher();
//   const { deleteVoucher, deleteVoucherPending } = useDeleteVoucher();
//   const { updateVoucher, isUpdatingVoucher } = useUpdateVoucher();
//   const { getVoucher } = useGetVoucher();
//   const voucherData = getVoucher || [];
//   const [open, setOpen] = React.useState(false);
//   const [isEditing, setIsEditing] = React.useState(false);
//   const [formData, setFormData] = React.useState({
//     _id: "",
//     name: "",
//     voucherCount: 0,
//     code: "",
//     amount: 0,
//     isActive: true,
//   });

//   const handleSaveVoucher = async () => {
//     if (isEditing) {
//       updateVoucher(formData);
//     } else {
//       addVoucher(formData);
//     }
//     resetForm();
//     setOpen(false);
//   };

//   const handleEdit = (voucher: any) => {
//     setFormData(voucher);
//     setIsEditing(true);
//     setOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     deleteVoucher(id);
//   };

//   const resetForm = () => {
//     setFormData({
//       _id: "",
//       name: "",
//       voucherCount: 0,
//       code: "",
//       amount: 0,
//       isActive: true,
//     });
//     setIsEditing(false);
//   };

//   return (
//     <div className="container mx-auto p-4 h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Manage Vouchers</h1>
//         <Dialog
//           open={open}
//           onOpenChange={(open) => {
//             setOpen(open);
//             if (!open) resetForm();
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button onClick={() => setIsEditing(false)}>Add Voucher</Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>
//                 {isEditing ? "Edit Voucher" : "Add New Voucher"}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="name" className="text-right">
//                   Name
//                 </Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="voucherCount" className="text-right">
//                   Voucher Count
//                 </Label>
//                 <Input
//                   id="voucherCount"
//                   type="number"
//                   value={formData.voucherCount}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       voucherCount: Number(e.target.value),
//                     })
//                   }
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="code" className="text-right">
//                   Code
//                 </Label>
//                 <Input
//                   id="code"
//                   value={formData.code}
//                   onChange={(e) =>
//                     setFormData({ ...formData, code: e.target.value })
//                   }
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="amount" className="text-right">
//                   Amount
//                 </Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   value={formData.amount}
//                   onChange={(e) =>
//                     setFormData({ ...formData, amount: Number(e.target.value) })
//                   }
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="isActive" className="text-right">
//                   Active
//                 </Label>
//                 <Switch
//                   id="isActive"
//                   checked={formData.isActive}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, isActive: checked })
//                   }
//                   className="col-span-3"
//                 />
//               </div>
//             </div>
//             <Button
//               onClick={handleSaveVoucher}
//               disabled={isAddingVoucher || isUpdatingVoucher}
//             >
//               {isAddingVoucher || isUpdatingVoucher
//                 ? "Saving..."
//                 : isEditing
//                 ? "Update Voucher"
//                 : "Save Voucher"}
//             </Button>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Sr. No.</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Voucher Count</TableHead>
//             <TableHead>Code</TableHead>
//             <TableHead>Amount</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {voucherData?.map((voucher: IVoucher, index: number) => (
//             <TableRow key={voucher._id}>
//               <TableCell>{index + 1}</TableCell>
//               <TableCell>{voucher.name}</TableCell>
//               <TableCell>{voucher.voucherCount}</TableCell>
//               <TableCell>{voucher.code}</TableCell>
//               <TableCell>₹{voucher.amount}</TableCell>
//               <TableCell>{voucher.isActive ? "Active" : "Inactive"}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="outline"
//                   className="mr-2"
//                   onClick={() => handleEdit(voucher)}
//                   disabled={isUpdatingVoucher || deleteVoucherPending}
//                 >
//                   <Pencil />
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleDelete(voucher._id || "")}
//                   disabled={deleteVoucherPending}
//                 >
//                   {deleteVoucherPending ? <Spinner /> : <Trash2 />}
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default ManageAccount;

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// Import shadcn Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useAddVoucher from "@/features/voucherMutations/useAddVoucher";
import useDeleteVoucher from "@/features/voucherMutations/useDeleteVoucher";
import useUpdateVoucher from "@/features/voucherMutations/useUpdateVoucher";
import useGetVoucher from "@/features/voucherMutations/useGetVoucher";
import Spinner from "@/components/Spinner";

const ManageAccount = () => {
  const { addVoucher, isAddingVoucher } = useAddVoucher();
  const { deleteVoucher, deleteVoucherPending } = useDeleteVoucher();
  const { updateVoucher, isUpdatingVoucher } = useUpdateVoucher();
  const { getVoucher } = useGetVoucher();
  const voucherData = getVoucher || [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(voucherData.length / itemsPerPage);
  const paginatedData = voucherData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    voucherCount: 0,
    code: "",
    amount: 0,
    isActive: true,
  });
  const [deletingId, setDeletingId] = useState("");

  const handleSaveVoucher = async () => {
    if (isEditing) {
      updateVoucher(formData);
    } else {
      addVoucher(formData);
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (voucher: any) => {
    setFormData(voucher);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    deleteVoucher(id);
    setDeletingId("");
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      name: "",
      voucherCount: 0,
      code: "",
      amount: 0,
      isActive: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Vouchers</h1>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)}>Add Voucher</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Voucher" : "Add New Voucher"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Label>Voucher Count</Label>
              <Input
                type="number"
                value={formData.voucherCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    voucherCount: Number(e.target.value),
                  })
                }
              />
              <Label>Code</Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
              <Label>Amount</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
              />
              <Label>Active</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
            <Button
              onClick={handleSaveVoucher}
              disabled={isAddingVoucher || isUpdatingVoucher}
            >
              {isAddingVoucher || isUpdatingVoucher
                ? "Saving..."
                : isEditing
                ? "Update Voucher"
                : "Save Voucher"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Voucher Count</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((voucher: any, index: number) => (
            <TableRow key={voucher._id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{voucher.name}</TableCell>
              <TableCell>{voucher.voucherCount}</TableCell>
              <TableCell>{voucher.code}</TableCell>
              <TableCell>₹{voucher.amount}</TableCell>
              <TableCell>{voucher.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleEdit(voucher)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(voucher._id)}
                  disabled={deletingId === voucher._id}
                >
                  {deletingId === voucher._id ? <Spinner /> : <Trash2 />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* shadcn Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ManageAccount;
