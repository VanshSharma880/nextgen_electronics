export const toINR = (amount: number) => {
  let rupee = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
  return rupee;
};
